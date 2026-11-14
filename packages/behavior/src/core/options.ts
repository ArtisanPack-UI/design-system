/**
 * Options for the React and Vue adapters (#36), and how they become machine
 * props. Both adapters run the same widget definitions through Zag's own
 * framework adapters, so this is the one place their options are mapped: the
 * two stacks can't drift from each other, and they emit the same parts and
 * data attributes as the Alpine adapter.
 *
 * State follows each stack's controlled/uncontrolled convention, which Zag's
 * machines support directly: pass `open` or `value` (with `onOpenChange` or
 * `onValueChange`) to control it, or `defaultOpen` or `defaultValue` to let
 * the widget own it.
 */
import type { Attrs } from './props';
import {
  type Direction,
  type LogicalPlacement,
  type PositionOptions,
  zagPositioning,
} from '../positioning';
import {
  type ComboboxItem,
  type ComboboxProps,
  createCollection,
  createItem,
  filterItems,
} from '../widgets/combobox';
import type { DialogProps } from '../widgets/dialog';
import type { DropdownMenuProps } from '../widgets/dropdown-menu';
import type { Toaster, ToastGroupProps } from '../widgets/toast';

// ---------------------------------------------------------------------------
// Dialog

export interface DialogOptions extends Pick<
  DialogProps,
  | 'role'
  | 'modal'
  | 'closeOnEscape'
  | 'closeOnInteractOutside'
  | 'preventScroll'
  | 'trapFocus'
  | 'restoreFocus'
  | 'ids'
  | 'dir'
> {
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog opens or closes itself (trigger, Escape, outside click, close trigger). */
  onOpenChange?: (details: { open: boolean }) => void;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  /** Accessible name when there's no `title` part. */
  label?: string;
}

/** The dialog machine's props for `options`. */
export function toDialogProps(options: DialogOptions, id: string): Partial<DialogProps> {
  return {
    id,
    ids: options.ids,
    dir: options.dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    role: options.role,
    modal: options.modal,
    closeOnEscape: options.closeOnEscape,
    closeOnInteractOutside: options.closeOnInteractOutside,
    preventScroll: options.preventScroll,
    trapFocus: options.trapFocus,
    restoreFocus: options.restoreFocus,
    'aria-label': options.label,
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
  };
}

// ---------------------------------------------------------------------------
// Combobox

/** A combobox value: a string (or null) for one, an array with `multiple`. */
export type ComboboxValue = string | string[] | null;

export interface ComboboxOptions extends Pick<
  ComboboxProps,
  | 'multiple'
  | 'disabled'
  | 'readOnly'
  | 'placeholder'
  | 'name'
  | 'translations'
  | 'closeOnSelect'
  | 'invalid'
  | 'required'
  | 'loading'
  | 'ids'
  | 'dir'
> {
  /** Every option. Unless `remote`, the combobox filters them by label as you type. */
  items: ComboboxItem[];
  /** Controlled value: a string (or null), or an array with `multiple`. Pair it with `onValueChange`. */
  value?: ComboboxValue;
  /** Initial value when uncontrolled. */
  defaultValue?: ComboboxValue;
  /** Called when a selection changes the value. */
  onValueChange?: (details: { value: ComboboxValue }) => void;
  /** Controlled open state of the listbox. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /** Controlled input text. */
  inputValue?: string;
  /** Initial input text when uncontrolled. */
  defaultInputValue?: string;
  /**
   * Called when the input text changes. `reason` is `input-change` when the
   * user typed it; with `remote`, that's the search to send to the server.
   */
  onInputValueChange?: (details: { inputValue: string; reason?: string }) => void;
  /** The server filters the items. Without it, items are filtered by label here. */
  remote?: boolean;
  /** Accept a typed value that isn't an item. */
  allowCustom?: boolean;
  /**
   * Offer a create option for typed text that names no item or chosen value
   * (ignoring case and accents). Choosing it adds the text to the value and
   * calls `onCreate`.
   */
  allowCreate?: boolean;
  /** Called with the new value when the create option is chosen. */
  onCreate?: (details: { value: string }) => void;
  /** With `multiple`, the most values that can be chosen; the other items are disabled once reached. */
  max?: number;
  /** Where the listbox opens. Default `bottom-start`, as wide as the control. */
  positioning?: PositionOptions;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
}

/** A value as the machine's array. */
export function toValueArray(value: ComboboxValue | undefined): string[] {
  if (Array.isArray(value)) return value.map(String);
  return value == null || value === '' ? [] : [String(value)];
}

/** The machine's array as the value the options use: a string or null unless `multiple`. */
export function fromValueArray(value: string[], multiple: boolean | undefined): ComboboxValue {
  return multiple ? value : (value[0] ?? null);
}

/**
 * The items to render: every item when remote, otherwise those whose label
 * matches `query`; then the create option, with `allowCreate`. With `max`
 * reached, the items not chosen are disabled. `values` defaults to the
 * options' value.
 */
export function visibleItems(
  options: Pick<ComboboxOptions, 'items' | 'remote' | 'allowCreate' | 'max' | 'multiple'> &
    Partial<Pick<ComboboxOptions, 'value' | 'defaultValue'>>,
  query: string,
  values: string[] = toValueArray(options.value ?? options.defaultValue),
): ComboboxItem[] {
  let items = options.remote ? options.items : filterItems(options.items, query);
  const created = options.allowCreate ? createItem(query, options.items, values) : null;
  if (created) items = [...items, created];
  if (options.multiple && options.max && values.length >= options.max) {
    items = items.map((item) =>
      values.includes(item.value) || item.disabled ? item : { ...item, disabled: true },
    );
  }
  return items;
}

/**
 * Whether a value change is allowed, and the value it creates if any. A
 * change past `max` is refused; a new value that is the create option among
 * `items` is reported.
 */
export function reviewValueChange(
  options: Pick<ComboboxOptions, 'multiple' | 'max'>,
  previous: string[],
  next: string[],
  items: readonly ComboboxItem[],
): { allowed: boolean; created: string | null } {
  if (
    options.multiple &&
    options.max &&
    next.length > options.max &&
    next.length > previous.length
  ) {
    return { allowed: false, created: null };
  }
  const added = next.find((value) => !previous.includes(value));
  const created = added !== undefined && items.some((item) => item.create && item.value === added);
  return { allowed: true, created: created ? added! : null };
}

/**
 * The text direction for logical placements. React and Vue compute props
 * before the elements exist, so it's read from `dir` on `<html>`, unless the
 * options say. The attribute, not the computed style: props are computed on
 * every render, and reading computed style there would force a style
 * recalculation per keystroke.
 */
export function direction(options: {
  dir?: Direction;
  positioning?: Pick<PositionOptions, 'dir'>;
}): Direction {
  const explicit = options.positioning?.dir ?? options.dir;
  if (explicit) return explicit;
  if (typeof document === 'undefined') return 'ltr';
  return document.documentElement.getAttribute('dir')?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * The combobox machine's props for `options`. `items` are the visible ones
 * (see `visibleItems`); `setQuery` receives the text to filter by, which is
 * the typed text, or empty after a selection or when the listbox closes, so
 * the next open lists everything again.
 */
export function toComboboxProps(
  options: ComboboxOptions,
  id: string,
  items: ComboboxItem[],
  setQuery: (query: string) => void,
  local?: ComboboxLocalValue,
): Partial<ComboboxProps> {
  const multiple = Boolean(options.multiple);
  return {
    id,
    ids: options.ids,
    dir: options.dir,
    multiple,
    disabled: options.disabled,
    readOnly: options.readOnly,
    placeholder: options.placeholder,
    // No `name` on the text input: it holds a label. Components render a
    // hidden input per value instead (`toValueArray`).
    translations: options.translations,
    closeOnSelect: options.closeOnSelect,
    invalid: options.invalid,
    required: options.required,
    loading: options.loading,
    // A created value isn't an item once the text is gone, so the machine
    // must not revert the input to the last item's label on blur.
    allowCustomValue: options.allowCustom || options.allowCreate,
    collection: createCollection(items),
    // Always controlled: the options' value, else the adapter's own state
    // (`local`), so a refused change (past `max`) leaves the machine where it
    // was instead of keeping the extra value.
    value: currentValue(options, local),
    defaultValue:
      local || options.defaultValue === undefined ? undefined : toValueArray(options.defaultValue),
    open: options.open,
    defaultOpen: options.defaultOpen,
    inputValue: options.inputValue,
    defaultInputValue: options.defaultInputValue,
    inputBehavior: 'autohighlight',
    openOnClick: true,
    selectionBehavior: multiple ? 'clear' : 'replace',
    positioning: zagPositioning(null, {
      sameWidth: true,
      ...options.positioning,
      dir: direction(options),
    }),
    onValueChange: ({ value }) => {
      const previous = currentValue(options, local) ?? [];
      const review = reviewValueChange(options, previous, value, items);
      if (!review.allowed) return;
      if (options.value === undefined) local?.set(value);
      options.onValueChange?.({ value: fromValueArray(value, multiple) });
      if (review.created !== null) options.onCreate?.({ value: review.created });
    },
    onInputValueChange: ({ inputValue, reason }) => {
      if (!options.remote) setQuery(reason === 'input-change' ? inputValue : '');
      options.onInputValueChange?.({ inputValue, reason });
    },
    onOpenChange: ({ open }) => {
      if (!open && !options.remote) setQuery('');
      options.onOpenChange?.({ open });
    },
  };
}

/**
 * The value an adapter keeps for an uncontrolled combobox, seeded from
 * `defaultValue`. React keeps it in state, Vue in a ref.
 */
export interface ComboboxLocalValue {
  value: string[];
  set(value: string[]): void;
}

/** The value the machine shows: the options' when controlled, else the adapter's own. */
export function currentValue(
  options: Pick<ComboboxOptions, 'value'>,
  local?: ComboboxLocalValue,
): string[] | undefined {
  if (options.value !== undefined) return toValueArray(options.value);
  return local?.value;
}

/**
 * Props for the `empty` part, shown when no item matches. It isn't a machine
 * part, so it's the same here as in the Alpine adapter. It isn't a live
 * region: the machine announces the result count itself.
 */
export function emptyProps(items: ComboboxItem[]): Attrs {
  return {
    'data-scope': 'combobox',
    'data-part': 'empty',
    hidden: items.length ? true : undefined,
  };
}

// ---------------------------------------------------------------------------
// DropdownMenu

/** Where the menu lines up with its trigger, along the inline axis. */
export type MenuAlign = 'start' | 'center' | 'end';

export interface DropdownMenuOptions extends Pick<
  DropdownMenuProps,
  'closeOnSelect' | 'loopFocus' | 'typeahead' | 'ids' | 'dir'
> {
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes itself (trigger, Escape, outside click, a selection). */
  onOpenChange?: (details: { open: boolean }) => void;
  /** Called when an item is chosen, with its value. */
  onSelect?: (details: { value: string }) => void;
  /** The menu's edge that lines up with the trigger's. Default `start`. */
  align?: MenuAlign;
  /** Overrides the placement `align` sets, the gap and flipping. */
  positioning?: PositionOptions;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
}

/** The logical placement for an alignment: below the trigger, at its start, center or end. */
export function menuPlacement(align: MenuAlign = 'start'): LogicalPlacement {
  return align === 'center' ? 'bottom' : `bottom-${align}`;
}

/** The menu machine's props for `options`. */
export function toDropdownMenuProps(
  options: DropdownMenuOptions,
  id: string,
): Partial<DropdownMenuProps> {
  return {
    id,
    ids: options.ids,
    dir: options.dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    closeOnSelect: options.closeOnSelect,
    loopFocus: options.loopFocus,
    typeahead: options.typeahead,
    positioning: zagPositioning(null, {
      placement: menuPlacement(options.align),
      ...options.positioning,
      dir: direction(options),
    }),
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
    onSelect: ({ value }) => options.onSelect?.({ value }),
  };
}

// ---------------------------------------------------------------------------
// Toast

export interface ToastGroupOptions {
  /** The toaster whose toasts the region renders. */
  toaster: Toaster;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  dir?: Direction;
}

/** The toast group machine's props for `options`. */
export function toToastGroupProps(
  options: ToastGroupOptions,
  id: string,
): Partial<ToastGroupProps> {
  // Zag maps `-end` to a physical side from `dir`, so without it the region
  // stays on the right in RTL.
  return { id, store: options.toaster.store, dir: direction(options) };
}

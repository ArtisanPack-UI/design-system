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

/** The items to render: every item when remote, otherwise those whose label matches `query`. */
export function visibleItems(options: ComboboxOptions, query: string): ComboboxItem[] {
  return options.remote ? options.items : filterItems(options.items, query);
}

/**
 * The text direction for logical placements. React and Vue compute props
 * before the elements exist, so it's read from `dir` on `<html>`, unless the
 * options say. The attribute, not the computed style: props are computed on
 * every render, and reading computed style there would force a style
 * recalculation per keystroke.
 */
function direction(options: {
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
    name: options.name,
    translations: options.translations,
    closeOnSelect: options.closeOnSelect,
    allowCustomValue: options.allowCustom,
    collection: createCollection(items),
    value: options.value === undefined ? undefined : toValueArray(options.value),
    defaultValue:
      options.defaultValue === undefined ? undefined : toValueArray(options.defaultValue),
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
    onValueChange: ({ value }) =>
      options.onValueChange?.({ value: fromValueArray(value, multiple) }),
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

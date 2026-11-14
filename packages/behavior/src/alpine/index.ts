/**
 * The Alpine adapter (#34, #35), for Livewire and plain Alpine pages.
 *
 *   Alpine.plugin(apuiBehavior)
 *
 * A widget is an `x-data` component and its parts are `x-apui:<part>`
 * directives, named after the machine's parts in kebab-case:
 *
 *   <div x-data="apuiDialog({ open: $wire.entangle('showDialog') })">
 *     <button x-apui:trigger>Edit</button>
 *     <template x-teleport="body">
 *       <div x-apui:backdrop></div>
 *       <div x-apui:positioner>
 *         <div x-apui:content>
 *           <h2 x-apui:title>Edit profile</h2>
 *           <button x-apui:close-trigger>Close</button>
 *         </div>
 *       </div>
 *     </template>
 *   </div>
 *
 * The machine owns every attribute it writes on a part. A server re-render
 * (Livewire's morph) resets those to the server's HTML, and the widget writes
 * them back before the next paint, so the open state, focus trap and ARIA
 * survive it. `open` and `value` are plain Alpine state, so `$wire.entangle()`
 * binds them to Livewire properties, which is what `wire:model` on the Blade
 * components compiles to.
 */
import type AlpineGlobal from 'alpinejs';

import { keepClientStateInLivewire } from '../core/morph';
import type { Attrs } from '../core/props';
import { createWidget, type Widget } from '../core/widget';
import {
  combobox,
  COMBOBOX_LABELS,
  type ComboboxApi,
  type ComboboxItem,
  type ComboboxProps,
  createCollection,
  createItem,
  filterItems,
  formatLabel,
  highlight,
} from '../widgets/combobox';
import { dialog, type DialogApi, type DialogProps } from '../widgets/dialog';
import {
  dropdownMenu,
  type DropdownMenuApi,
  type DropdownMenuProps,
} from '../widgets/dropdown-menu';
import {
  createToaster,
  TOAST_ICONS,
  toast,
  type ToastApi,
  type Toaster,
  type ToasterOptions,
  toastGroup,
  type ToastGroupApi,
  type ToastGroupProps,
  type ToastOptions,
  type ToastProps,
} from '../widgets/toast';
import { datePickerComponent } from './date-picker';
import { colorPickerComponent } from './color-picker';
import { tabsComponent } from './tabs';
import { accordionComponent, collapseComponent } from './disclosure';
import { drawerComponent, popoverComponent, tooltipComponent } from './overlays';
import { menuPlacement, type MenuAlign } from '../core/options';
import { iconSvg } from '../icons';
import { spotlightComponent } from './spotlight';
import { calendarComponent } from './calendar';
import { carouselComponent, lightboxComponent } from './images';
import { imageLibraryComponent } from './image-library';
import { chartComponent } from './chart';
import { codeEditorComponent, richTextEditorComponent, signatureComponent } from './form';
import { themeToggleComponent } from './theme';
import { clipboardComponent, kbdComponent } from './clipboard';
import { markdownComponent } from './markdown';
import { directionOf, type PositionOptions, zagPositioning } from '../positioning';

type Alpine = AlpineGlobal.Alpine;
type PartArgs = Record<string, unknown> | undefined;

/** What a component exposes to its `x-apui:*` directives. */
interface PartHost {
  apuiPart(part: string, el: Element, args: () => PartArgs): () => void;
}

/** `close-trigger` → `closeTrigger`. */
const camel = (part: string) => part.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
/** `close-trigger` → `CloseTrigger`. */
const pascal = (part: string) => camel(part).replace(/^./, (c) => c.toUpperCase());

/** The machine's props for a part, from `api.get<Part>Props(args)`. */
function partProps(api: Record<string, unknown>, scope: string, part: string, args: PartArgs) {
  const getter = api[`get${pascal(part)}Props`];
  if (typeof getter !== 'function') {
    throw new Error(`[apui] ${scope} has no part "${part}"`);
  }
  return getter(args) as Attrs;
}

/**
 * The author's `id`s on this component's parts, as the machine's `ids` prop.
 * Machines name parts by their own scheme (`dialog:<id>:content`) and read
 * `ids` only when they're created, so the ids are collected from the markup
 * first, including parts in `x-teleport` templates. Parts of a nested widget
 * are left to that widget. Items are named per value, so they keep the
 * machine's ids.
 */
function authoredIds(root: Element): Record<string, string> {
  const ids: Record<string, string> = {};
  const visit = (scope: ParentNode, nested: (el: Element) => boolean) => {
    for (const el of Array.from(scope.querySelectorAll('*'))) {
      if (nested(el)) continue;
      if (el instanceof HTMLTemplateElement) {
        visit(el.content, (inner) => inner.closest('[x-data]') !== null);
        continue;
      }
      collect(el);
    }
  };
  const collect = (el: Element) => {
    if (!el.id) return;
    for (const { name } of Array.from(el.attributes)) {
      if (!name.startsWith('x-apui:')) continue;
      const part = name.slice('x-apui:'.length);
      if (part !== 'item' && !part.startsWith('item-')) ids[camel(part)] = el.id;
    }
  };
  // The component's own element can be a part too (x-apui:root).
  collect(root);
  visit(root, (el) => el.closest('[x-data]') !== root);
  return ids;
}

const warned = new WeakSet<Element>();

/**
 * Livewire keys morphed elements by `wire:key`, then by `id`. A part the server
 * renders without an id gets one from the machine, so its key no longer
 * matches the server's and the morph replaces the element, leaving the
 * machine's focus trap and listeners on a detached node. Parts inside a
 * Livewire component need a stable, server-rendered id; the Blade components
 * render one for every part.
 */
function warnMissingId(el: Element, part: string): void {
  if (el.id || part === 'item' || part.startsWith('item-') || warned.has(el)) return;
  // The morph skips a wire:ignore subtree, so client-rendered parts there
  // (a date picker's day cells) can keep the machine's ids.
  if (el.closest('[wire\\:ignore]')) return;
  // Teleported parts live outside the component; follow them back to it.
  const teleported = el.closest('[data-teleport-target]') as { _x_teleportBack?: Element } | null;
  const origin = teleported?._x_teleportBack ?? el;
  if (!origin.closest('[wire\\:id]')) return;
  warned.add(el);
  console.warn(
    `[apui] x-apui:${part} has no id. Inside a Livewire component every part needs a stable id, or the morph replaces it.`,
    el,
  );
}

/** Dispatches a bubbling custom event, as the vocabulary names Livewire and Alpine events. */
function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** Whether two values (strings or arrays) are equal, treating null and undefined alike. */
const sameValue = (a: unknown, b: unknown) =>
  JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

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
> {
  /** Initial or entangled open state. */
  open?: boolean;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
  /** Accessible name when there's no `title` part. */
  label?: string;
}

/** The `apuiDialog` Alpine component. `open` is plain state, so it can be entangled with Livewire. */
function dialogComponent(options: DialogOptions = {}) {
  let widget: Widget<DialogProps, DialogApi> | undefined;

  return {
    open: options.open ?? false,

    init(this: AlpineMagics & { open: boolean }) {
      const el = this.$el;
      widget = createWidget(dialog, {
        id: options.id ?? this.$id('apui-dialog'),
        ids: authoredIds(el),
        open: Boolean(this.open),
        role: options.role,
        modal: options.modal,
        closeOnEscape: options.closeOnEscape,
        closeOnInteractOutside: options.closeOnInteractOutside,
        preventScroll: options.preventScroll,
        trapFocus: options.trapFocus,
        restoreFocus: options.restoreFocus,
        'aria-label': options.label,
        onOpenChange: ({ open }) => {
          if (this.open !== open) this.open = open;
          dispatch(el, 'open-change', { open });
        },
      });
      widget.start();
      this.$watch('open', (open: unknown) => widget?.setProps({ open: Boolean(open) }));
    },

    destroy() {
      widget?.stop();
      widget = undefined;
    },

    show(this: { open: boolean }) {
      this.open = true;
    },

    hide(this: { open: boolean }) {
      this.open = false;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      return widget.bind(el, (api) =>
        partProps(api as unknown as Record<string, unknown>, 'dialog', part, args()),
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Combobox

/** The combobox's built-in labels. Livewire passes them through `__()`. */
export type ComboboxLabels = Partial<Record<keyof typeof COMBOBOX_LABELS, string>>;

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
> {
  /**
   * Initial or entangled value: a string, or an array with `multiple`. An
   * item given a number value (a Livewire integer id) is bound as that number.
   */
  value?: string | number | (string | number)[] | null;
  /**
   * Entangled search text. With `remote`, the server filters: typing updates
   * this (after `debounce`) and the server renders the matching items.
   */
  search?: string;
  /** The server filters the items. Without it, items are filtered by label here. */
  remote?: boolean;
  /** Milliseconds between the last keystroke and updating `search`, with `remote`. Default 0. */
  debounce?: number;
  /** Accept a typed value that isn't an item. */
  allowCustom?: boolean;
  /**
   * Offer a create option for typed text that names no item or chosen value.
   * The view renders it as `x-apui:item="createOption"`; choosing it
   * dispatches `create`.
   */
  allowCreate?: boolean;
  /** With `multiple`, the most values that can be chosen. */
  max?: number;
  /** Initial loading state: a spinner and the loading text. Plain state the view can set. */
  loading?: boolean;
  /** Initial open state of the listbox. */
  open?: boolean;
  /** Built-in labels, translated. */
  labels?: ComboboxLabels;
  /** Where the listbox opens. Default `bottom-start`, as wide as the control. */
  positioning?: PositionOptions;
  id?: string;
}

/** Escapes text for `x-html`. */
const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  );

/** A combobox chip: one chosen value with its label and color. */
interface ComboboxChip {
  value: string;
  label: string;
  color?: string;
}

/**
 * The `apuiCombobox` Alpine component. `value` and `search` are plain state,
 * so they can be entangled with Livewire. Besides the machine's parts, the
 * view uses `chips`, `remove()`, `itemHtml()`, `createOption`, `createText`,
 * `emptyText`, `loading` and `status`.
 */
function comboboxComponent(options: ComboboxOptions = {}) {
  const multiple = Boolean(options.multiple);
  const labels = { ...COMBOBOX_LABELS, ...options.labels };
  let widget: Widget<ComboboxProps, ComboboxApi> | undefined;
  const items = new Map<Element, ComboboxItem>();
  let visible: ComboboxItem[] = [];
  let shown = new Map<string, ComboboxItem>();
  let scheduled = false;
  let root: HTMLElement | undefined;
  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  /** Labels and colors of values seen, so chips keep them after their item is filtered or gone. */
  const known = new Map<string, ComboboxItem>();
  /**
   * Items' values as the server gave them (a Livewire integer id stays an
   * integer), by their string form, so the bound value keeps their type.
   */
  const originals = new Map<string, number>();
  const original = (values: string[]) => values.map((entry) => originals.get(entry) ?? entry);
  /** The listed items' values and labels at the last refresh, to tell when they change. */
  let signature = '';
  /** The component's reactive state, once it inits. */
  let state: { query: string; value: unknown; revision: number; remove(value: string): void };

  const toArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map(String) : value == null || value === '' ? [] : [String(value)];

  return {
    value: options.value ?? (multiple ? [] : null),
    search: options.search ?? '',
    inputValue: options.search ?? '',
    /** The typed text the items are filtered and marked by; empty after a choice. */
    query: options.search ?? '',
    open: Boolean(options.open),
    loading: Boolean(options.loading),
    /** The status region's text: the last removed chip. */
    status: '',
    /** Bumped when the items change, so getters that read them re-run. */
    revision: 0,

    init(
      this: AlpineMagics & {
        value: string | number | (string | number)[] | null;
        search: string;
        inputValue: string;
        query: string;
        open: boolean;
        loading: boolean;
        revision: number;
        remove(value: string): void;
      },
    ) {
      const el = this.$el;
      root = el;
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- helpers outside the component object need Alpine's reactive proxy
      state = this;

      widget = createWidget(combobox, {
        id: options.id ?? this.$id('apui-combobox'),
        ids: authoredIds(el),
        multiple,
        disabled: options.disabled,
        readOnly: options.readOnly,
        invalid: options.invalid,
        required: options.required,
        loading: this.loading,
        placeholder: options.placeholder,
        // No `name` on the text input: it holds a label. The view renders
        // hidden inputs for `formValues` instead.
        translations: options.translations,
        closeOnSelect: options.closeOnSelect,
        // A created value isn't an item once the text is gone, so the machine
        // must not revert the input to the last item's label on blur.
        allowCustomValue: options.allowCustom || options.allowCreate,
        collection: createCollection([]),
        value: toArray(this.value),
        defaultOpen: this.open,
        defaultInputValue: this.inputValue,
        inputBehavior: 'autohighlight',
        openOnClick: true,
        selectionBehavior: multiple ? 'clear' : 'replace',
        // The listbox is as wide as the control unless the options say otherwise.
        positioning: zagPositioning(el, { sameWidth: true, ...options.positioning }),
        onValueChange: ({ value }) => {
          const previous = toArray(this.value);
          const added = value.find((entry) => !previous.includes(entry));
          if (multiple && options.max && value.length > options.max && added !== undefined) {
            // Past max: put the machine back.
            widget?.setProps({ value: previous });
            return;
          }
          const created = added === undefined ? undefined : shown.get(added);
          if (created) known.set(created.value, { ...created, create: false });
          const next = multiple ? original(value) : (original(value)[0] ?? null);
          if (!sameValue(this.value, next)) this.value = next;
          dispatch(el, 'value-change', { value: next });
          if (created?.create) dispatch(el, 'create', { value: created.value });
        },
        onInputValueChange: ({ inputValue, reason }) => {
          this.inputValue = inputValue;
          // Filter and mark only on typing. After a choice the input shows the
          // label, and the next open should list everything again.
          this.query = reason === 'input-change' ? inputValue : '';
          if (reason === 'input-change') {
            dispatch(el, 'search-change', { search: inputValue });
            if (options.remote) {
              clearTimeout(searchTimer);
              const update = () => {
                if (this.search !== inputValue) this.search = inputValue;
              };
              if (options.debounce) searchTimer = setTimeout(update, options.debounce);
              else update();
            }
          }
          refresh();
        },
        onOpenChange: ({ open }) => {
          this.open = open;
          if (!open) {
            this.query = '';
            refresh();
          }
          dispatch(el, 'open-change', { open });
        },
      });
      widget.start();
      this.$watch('value', (value: unknown) => {
        widget?.setProps({ value: toArray(value) });
        refresh();
        queueMicrotask(showLabel);
      });
      this.$watch('loading', (loading: unknown) => widget?.setProps({ loading: Boolean(loading) }));
    },

    destroy() {
      clearTimeout(searchTimer);
      widget?.stop();
      widget = undefined;
      items.clear();
    },

    /** The values a form submits: one hidden input each, under the view's `name`. */
    get formValues(): string[] {
      return toArray((this as unknown as { value: unknown }).value);
    },

    /** With multiple, the chosen values as chips, in the order they were chosen. */
    get chips(): ComboboxChip[] {
      const self = this as unknown as { value: unknown; revision: number };
      void self.revision;
      return toArray(self.value).map((value) => {
        const item = known.get(value);
        return { value, label: item?.label ?? value, color: item?.color };
      });
    },

    /** The create option for the typed text, or null. Bind it as `x-apui:item="createOption"`. */
    get createOption(): ComboboxItem | null {
      const self = this as unknown as { query: string; value: unknown; revision: number };
      void self.revision;
      if (!options.allowCreate) return null;
      const listed = [...items.values()].filter((item) => !item.create);
      return createItem(self.query, listed, toArray(self.value));
    },

    /** The create option's text. */
    get createText(): string {
      const self = this as unknown as { query: string };
      return formatLabel(labels.create, { value: self.query.trim() });
    },

    /** The empty part's text: loading, or no matches for the typed text. */
    get emptyText(): string {
      const self = this as unknown as { query: string; loading: boolean };
      return self.loading ? labels.loading : formatLabel(labels.empty, { search: self.query });
    },

    /** A chip remove button's accessible name. */
    removeLabel(label: string) {
      return formatLabel(labels.remove, { label });
    },

    /** An item's label as HTML, the typed text marked, then its description. */
    itemHtml(this: { query: string }, label: string, description?: string | null) {
      const marked = highlight(label, this.query)
        .map(({ text, match }) =>
          match
            ? `<mark data-scope="combobox" data-part="mark">${escapeHtml(text)}</mark>`
            : escapeHtml(text),
        )
        .join('');
      return description
        ? `${marked}<span data-scope="combobox" data-part="item-description">${escapeHtml(description)}</span>`
        : marked;
    },

    /** Removes one chosen value (a chip's remove button) and announces it. */
    remove(this: { value: unknown; status: string }, value: string) {
      if (options.disabled || options.readOnly) return;
      const current = toArray(this.value);
      if (!current.includes(value)) return;
      const next = current.filter((entry) => entry !== value);
      this.value = multiple ? original(next) : null;
      this.status = formatLabel(labels.removed, { label: known.get(value)?.label ?? value });
      if (root) dispatch(root, 'value-change', { value: this.value });
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      if (part === 'item') {
        const given = args();
        // `x-apui:item="createOption"` is null while there's nothing to create.
        if (given === null) {
          return widget.bind(el, () => ({ hidden: true }));
        }
        const item = toItem(el, given);
        items.set(el, item);
        if (!item.create) {
          known.set(item.value, item);
          const raw = (given as Record<string, unknown> | undefined)?.value;
          if (typeof raw === 'number') originals.set(item.value, raw);
        }
        schedule();
        const unbind = widget.bind(el, (api) => {
          const current = shown.get(item.value);
          return {
            ...api.getItemProps({ item: current ?? item }),
            hidden: current ? undefined : true,
          };
        });
        return () => {
          unbind();
          items.delete(el);
          schedule();
        };
      }
      if (part === 'item-text' || part === 'item-indicator') {
        const owner = el.closest('[x-apui\\:item]');
        if (!owner) return () => {};
        // Looked up on every apply: the item changes when its expression does.
        return widget.bind(el, (api) => {
          const item = items.get(owner);
          return item
            ? partProps(api as unknown as Record<string, unknown>, 'combobox', part, {
                item: shown.get(item.value) ?? item,
              })
            : {};
        });
      }
      if (part === 'empty') {
        // Not a machine part: shown when no item matches. Screen readers hear
        // the machine's own results announcement (`translations.noResults`),
        // so this isn't a live region.
        return widget.bind(el, () => ({
          'data-scope': 'combobox',
          'data-part': 'empty',
          hidden: visible.length ? true : undefined,
        }));
      }
      if (part === 'input') {
        // Backspace in the empty input removes the last chip.
        const onKeydown = (event: Event) => {
          const key = event as KeyboardEvent;
          if (!multiple || key.key !== 'Backspace' || (el as HTMLInputElement).value !== '') return;
          const last = toArray(state.value).at(-1);
          if (last !== undefined) state.remove(last);
        };
        el.addEventListener('keydown', onKeydown);
        const unbind = widget.bind(el, (api) => api.getInputProps());
        return () => {
          el.removeEventListener('keydown', onKeydown);
          unbind();
        };
      }
      return widget.bind(el, (api) =>
        partProps(api as unknown as Record<string, unknown>, 'combobox', part, args()),
      );
    },
  };

  /** Rebuilds the collection after items change, once per tick. */
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      refresh();
      showLabel();
    });
  }

  /**
   * Rebuilds the collection from the registered items in DOM order: filtered
   * by the typed query unless remote, and with the items not chosen disabled
   * once `max` is reached.
   */
  function refresh() {
    if (!widget) return;
    const query = state?.query ?? '';
    const values = toArray(state?.value);
    // A morph removes items before Alpine runs their cleanup, so drop
    // detached ones here rather than wait for it.
    for (const el of [...items.keys()]) if (!el.isConnected) items.delete(el);
    const ordered = [...items]
      .sort(([a], [b]) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )
      .map(([, item]) => item);
    const listed = ordered.filter((item) => !item.create);
    const created = ordered.filter((item) => item.create);
    visible = [...(options.remote ? listed : filterItems(listed, query)), ...created];
    if (multiple && options.max && values.length >= options.max) {
      visible = visible.map((item) =>
        values.includes(item.value) || item.disabled ? item : { ...item, disabled: true },
      );
    }
    shown = new Map(visible.map((item) => [item.value, item]));
    widget.setProps({ collection: createCollection(visible) });
    // Getters that read the listed items (chips, createOption) re-run when
    // they change. Not for the create option itself, which they produce.
    const next = JSON.stringify(listed.map((item) => [item.value, item.label]));
    if (state && next !== signature) {
      signature = next;
      state.revision++;
    }
  }

  /**
   * Puts the selected item's label in the input while the list is closed.
   * The machine only does that when an item is picked, so a value from the
   * server (the initial render, or $wire setting it) would leave the input
   * empty.
   */
  function showLabel() {
    // Not while the server's search text is in the input.
    if (!widget || multiple || state?.query) return;
    const api = widget.api();
    // Never while someone is typing in it.
    const input = root?.querySelector('[data-scope="combobox"][data-part="control"]');
    if (api.open || input === document.activeElement) return;
    const selected = api.value[0];
    const item = selected === undefined ? undefined : known.get(selected);
    if (selected !== undefined && !item) return;
    const label = item?.label ?? '';
    if (api.inputValue !== label) api.setInputValue(label, 'script');
  }
}

/**
 * An item from its directive's expression. The label defaults to the
 * `item-text` part's text, or the item's own text when it has none, so an
 * indicator (a checkmark) never ends up in the label.
 */
function toItem(el: Element, args: PartArgs): ComboboxItem {
  const text = (el.querySelector('[x-apui\\:item-text]') ?? el).textContent?.trim();
  const value = args?.value ?? el.getAttribute('data-value') ?? text ?? '';
  const optional = (key: string) =>
    typeof args?.[key] === 'string' ? (args[key] as string) : undefined;
  return {
    value: String(value),
    label: String(args?.label ?? text ?? value),
    disabled: Boolean(args?.disabled),
    description: optional('description'),
    icon: optional('icon'),
    color: optional('color'),
    create: Boolean(args?.create) || undefined,
  };
}

// ---------------------------------------------------------------------------
// DropdownMenu

export interface DropdownMenuOptions extends Pick<
  DropdownMenuProps,
  'closeOnSelect' | 'loopFocus' | 'typeahead'
> {
  /** Initial or entangled open state. */
  open?: boolean;
  /** The menu's edge that lines up with the trigger's. Default `start`. */
  align?: MenuAlign;
  /** Overrides the placement `align` sets, the gap and flipping. */
  positioning?: PositionOptions;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/**
 * The `apuiDropdownMenu` Alpine component. `open` is plain state, so it can be
 * entangled with Livewire. Items are `x-apui:item="{ value }"`; choosing one
 * clicks it (so `wire:click` on an item runs from the keyboard too) and
 * dispatches `select`. Checkbox and radio items are
 * `x-apui:option-item="{ type, value, checked }"` and dispatch
 * `checked-change` from the item; their `checked` stays the page's to set.
 */
function dropdownMenuComponent(options: DropdownMenuOptions = {}) {
  let widget: Widget<DropdownMenuProps, DropdownMenuApi> | undefined;
  // The machine names groups and their labels by group id. Livewire keys
  // them by their server-rendered ids, so those are kept (rule 1).
  const groupIds = new Map<string, string>();
  const labelIds = new Map<string, string>();

  return {
    open: options.open ?? false,

    init(this: AlpineMagics & { open: boolean }) {
      const el = this.$el;
      const id = options.id ?? this.$id('apui-dropdown-menu');
      widget = createWidget(dropdownMenu, {
        id,
        ids: {
          ...authoredIds(el),
          group: (group: string) => groupIds.get(group) ?? `menu:${id}:group:${group}`,
          groupLabel: (group: string) => labelIds.get(group) ?? `menu:${id}:group-label:${group}`,
        },
        open: Boolean(this.open),
        closeOnSelect: options.closeOnSelect,
        loopFocus: options.loopFocus,
        typeahead: options.typeahead,
        positioning: zagPositioning(el, {
          placement: menuPlacement(options.align),
          ...options.positioning,
        }),
        onOpenChange: ({ open }) => {
          if (this.open !== open) this.open = open;
          dispatch(el, 'open-change', { open });
        },
        onSelect: ({ value }) => dispatch(el, 'select', { value }),
      });
      widget.start();
      this.$watch('open', (open: unknown) => widget?.setProps({ open: Boolean(open) }));
    },

    destroy() {
      widget?.stop();
      widget = undefined;
    },

    show(this: { open: boolean }) {
      this.open = true;
    },

    hide(this: { open: boolean }) {
      this.open = false;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      if (part === 'item-group') {
        const group = String(args()?.id ?? '');
        if (el.id) groupIds.set(group, el.id);
        // The group binds before its label and points aria-labelledby at it.
        const label = el.querySelector('[x-apui\\:item-group-label]');
        if (label?.id) labelIds.set(group, label.id);
      }
      if (el.id && part === 'item-group-label') {
        labelIds.set(String(args()?.htmlFor ?? ''), el.id);
      }
      if (part === 'option-item') {
        return widget.bind(el, (api) => {
          const option = (args() ?? {}) as { type?: 'checkbox' | 'radio'; value?: string };
          return api.getOptionItemProps({
            ...(args() as object),
            type: option.type ?? 'checkbox',
            value: String(option.value ?? ''),
            checked: Boolean((args() as { checked?: unknown } | undefined)?.checked),
            onCheckedChange: (checked: boolean) =>
              dispatch(el, 'checked-change', { value: String(option.value ?? ''), checked }),
          } as never) as Attrs;
        });
      }
      return widget.bind(el, (api) =>
        partProps(api as unknown as Record<string, unknown>, 'dropdown-menu', part, args()),
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Toast

export interface ToasterAlpineOptions extends ToasterOptions {
  /** The region's accessible name. Default `Notifications`. */
  label?: string;
  /** The close button's accessible name. Default `Dismiss notification`. */
  closeLabel?: string;
  /** Toasts to show on load, such as ones flashed to the session before a redirect. */
  toasts?: ToastOptions[];
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/** Toasters on the page, newest last. `toast` events and `ApuiBehavior.toast()` go to the newest. */
const toasters: Toaster[] = [];

/** Shows a toast in the page's toaster. Returns its id, or undefined when there's no toaster yet. */
export function showToast(options: ToastOptions): string | undefined {
  return toasters.at(-1)?.create(options);
}

/**
 * The `apuiToaster` Alpine component: the region (`x-apui:group`) that
 * renders the page's toasts, newest first, with `apuiToast` for each.
 * A `toast` browser event adds one, so a Livewire component shows one with
 * `$this->dispatch('toast', title: …)`.
 */
function toasterComponent(Alpine: Alpine, options: ToasterAlpineOptions = {}) {
  let widget: Widget<ToastGroupProps, ToastGroupApi> | undefined;
  let toaster: Toaster | undefined;
  let stopListening: (() => void) | undefined;
  /** The machines of the toasts inside, by toast id. */
  const children = new Map<string, Widget<ToastProps, ToastApi>>();

  return {
    toasts: [] as ToastProps[],

    init(this: AlpineMagics & { toasts: ToastProps[] }) {
      toaster = createToaster(options);
      toasters.push(toaster);
      widget = createWidget(toastGroup, {
        id: options.id ?? this.$id('apui-toaster'),
        store: toaster.store,
        // Zag maps `-end` to a physical side from `dir`: follow the page's.
        dir: directionOf(this.$el),
      });
      // The group re-renders on every height measurement; only a different
      // list of toasts (added, removed or updated) re-renders the template.
      widget.subscribe((api) => {
        const next = api.getToasts() as ToastProps[];
        const current = Alpine.raw(this.toasts) as ToastProps[];
        // Each toast's position reads the region's measured heights, which
        // change without the list changing: re-render every toast, as a
        // React or Vue parent re-render does.
        for (const child of children.values()) child.refresh();
        if (next.length === current.length && next.every((t, i) => t === current[i])) return;
        // The store publishes a toast's changes (pausing on hover, an update)
        // as a new object: hand them to its machine, as a React re-render would.
        next.forEach((entry, index) => {
          if (entry !== current[index])
            children.get(String(entry.id))?.setProps({ ...entry, index });
        });
        this.toasts = [...next];
      });
      widget.start();
      const onToast = (event: Event) => {
        const detail = (event as CustomEvent<ToastOptions | ToastOptions[]>).detail;
        // Livewire 3 sends dispatch()'s named arguments as the detail; some
        // versions wrap them in an array.
        const toastOptions = Array.isArray(detail) ? detail[0] : detail;
        // Like ApuiBehavior.toast(), an event goes to the newest toaster only.
        if (toasters.at(-1) !== toaster) return;
        // Another library's `toast` event (a different shape) isn't ours.
        if (!toastOptions || typeof toastOptions !== 'object') return;
        if (
          typeof toastOptions.title !== 'string' &&
          typeof toastOptions.description !== 'string'
        ) {
          return;
        }
        toaster?.create(toastOptions);
      };
      window.addEventListener('toast', onToast);
      stopListening = () => window.removeEventListener('toast', onToast);
      for (const initial of options.toasts ?? []) toaster.create(initial);
    },

    destroy() {
      stopListening?.();
      if (toaster) toasters.splice(toasters.indexOf(toaster), 1);
      widget?.stop();
      widget = undefined;
      toaster = undefined;
    },

    /** Adds a toast. Returns its id. */
    create(toastOptions: ToastOptions) {
      return toaster?.create(toastOptions);
    },

    /** Dismisses one toast, or all of them. */
    dismiss(id?: string) {
      toaster?.dismiss(id);
    },

    /** The region's service, for the toasts inside it. */
    apuiToasterService() {
      return widget?.service;
    },

    /** Registers a toast's machine, so it gets the store's changes. Returns an unregister function. */
    apuiAdoptToast(id: string, child: Widget<ToastProps, ToastApi>) {
      children.set(id, child);
      return () => {
        if (children.get(id) === child) children.delete(id);
      };
    },

    /** The close button's accessible name, for the toasts inside it. */
    apuiCloseLabel() {
      return options.closeLabel;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      if (part !== 'group') throw new Error(`[apui] a toaster has no part "${part}"`);
      return widget.bind(el, (api) =>
        api.getGroupProps({ label: options.label ?? 'Notifications', ...(args() ?? {}) }),
      ) as () => void;
    },
  };
}

/**
 * The `apuiToast` Alpine component: one toast inside `apuiToaster`, driven
 * by the toast's machine. Its parts are `x-apui:root`, `icon`, `title`,
 * `description`, `actions`, `action-trigger` and `close-trigger`. `icon` is
 * the status icon's SVG, for `x-html`.
 */
function toastComponent(Alpine: Alpine, proxied: ToastProps, index = 0) {
  // The machine reads the entry, so give it the store's object, not Alpine's
  // reactive proxy of it: reads through the proxy would track Alpine effects.
  const entry = Alpine.raw(proxied) as ToastProps;
  let widget: Widget<ToastProps, ToastApi> | undefined;
  let release: (() => void) | undefined;

  return {
    toast: entry,
    icon: '',

    init(
      this: AlpineMagics & {
        toast: ToastProps;
        icon: string;
        apuiToasterService?: () => unknown;
        apuiCloseLabel?: () => string | undefined;
        apuiAdoptToast?: (id: string, child: Widget<ToastProps, ToastApi>) => () => void;
      },
    ) {
      const parent = this.apuiToasterService?.();
      if (!parent) throw new Error('[apui] apuiToast must be inside an apuiToaster');
      const iconFor = (meta: { color?: keyof typeof TOAST_ICONS; icon?: string } = {}) =>
        iconSvg(meta.icon ?? TOAST_ICONS[meta.color ?? 'neutral'] ?? 'info') ?? '';
      this.icon = iconFor(entry.meta as never);
      const closeTriggerLabel = this.apuiCloseLabel?.();
      widget = createWidget(toast, {
        ...entry,
        id: entry.id,
        index,
        parent: parent as never,
        translations: closeTriggerLabel ? { closeTriggerLabel } : undefined,
      } as ToastProps & { id: string });
      widget.start();
      // An update by id can change the color or icon.
      widget.subscribe((api) => {
        const icon = iconFor(api.meta);
        if (this.icon !== icon) this.icon = icon;
      });
      release = this.apuiAdoptToast?.(String(entry.id), widget);
    },

    destroy() {
      release?.();
      widget?.stop();
      widget = undefined;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      return widget.bind(el, (api) =>
        partProps(api as unknown as Record<string, unknown>, 'toast', part, args()),
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin

/** The magics a component's methods use. */
interface AlpineMagics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

/**
 * Registers `apuiDialog`, `apuiCombobox`, `apuiDropdownMenu`, `apuiToaster`,
 * `apuiToast` and the `x-apui:<part>` directive.
 */
export default function apuiBehavior(Alpine: Alpine): void {
  // Keep machine state that lives outside part props (aria-hidden on the page
  // behind a modal, layer styles) through Livewire's morph.
  const page = window as unknown as { Livewire?: unknown };
  if (!keepClientStateInLivewire(page.Livewire)) {
    document.addEventListener('livewire:init', () => keepClientStateInLivewire(page.Livewire), {
      once: true,
    });
  }

  Alpine.data('apuiDialog', dialogComponent as never);
  Alpine.data('apuiDatePicker', datePickerComponent as never);
  Alpine.data('apuiColorPicker', colorPickerComponent as never);
  Alpine.data('apuiCombobox', comboboxComponent as never);
  Alpine.data('apuiDropdownMenu', dropdownMenuComponent as never);
  Alpine.data('apuiTabs', tabsComponent as never);
  Alpine.data('apuiAccordion', accordionComponent as never);
  Alpine.data('apuiCollapse', collapseComponent as never);
  Alpine.data('apuiDrawer', drawerComponent as never);
  Alpine.data('apuiPopover', popoverComponent as never);
  Alpine.data('apuiTooltip', tooltipComponent as never);
  Alpine.data('apuiToaster', ((options?: ToasterAlpineOptions) =>
    toasterComponent(Alpine, options)) as never);
  Alpine.data('apuiToast', ((entry: ToastProps, index?: number) =>
    toastComponent(Alpine, entry, index)) as never);
  Alpine.data('apuiSpotlight', spotlightComponent as never);
  Alpine.data('apuiCalendar', calendarComponent as never);
  Alpine.data('apuiLightbox', lightboxComponent as never);
  Alpine.data('apuiCarousel', carouselComponent as never);
  Alpine.data('apuiImageLibrary', imageLibraryComponent as never);
  Alpine.data('apuiSignature', signatureComponent as never);
  Alpine.data('apuiRichTextEditor', richTextEditorComponent as never);
  Alpine.data('apuiCodeEditor', codeEditorComponent as never);
  Alpine.data('apuiThemeToggle', themeToggleComponent as never);
  Alpine.data('apuiChart', chartComponent as never);
  Alpine.data('apuiClipboard', clipboardComponent as never);
  Alpine.data('apuiKbd', kbdComponent as never);
  Alpine.data('apuiMarkdown', markdownComponent as never);

  Alpine.directive(
    'apui',
    (el, { value: part, expression }, { evaluateLater, effect, cleanup }) => {
      if (!part) throw new Error('[apui] x-apui needs a part, e.g. x-apui:trigger');
      const host = Alpine.$data(el as HTMLElement) as unknown as Partial<PartHost>;
      if (typeof host.apuiPart !== 'function') {
        throw new Error(`[apui] x-apui:${part} must be inside an apui widget (apuiDialog, …)`);
      }
      warnMissingId(el, part);
      let args: PartArgs;
      let unbind: (() => void) | undefined;
      if (expression) {
        const read = evaluateLater(expression);
        effect(() => {
          read((value: unknown) => {
            args = value as PartArgs;
            // A changed expression (an item's label, say) binds the part again.
            unbind?.();
            unbind = host.apuiPart?.(part, el, () => args);
          });
        });
      } else {
        unbind = host.apuiPart(part, el, () => args);
      }
      cleanup(() => unbind?.());
    },
  );
}

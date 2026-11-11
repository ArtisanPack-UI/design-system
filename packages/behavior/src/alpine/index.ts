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
  type ComboboxApi,
  type ComboboxItem,
  type ComboboxProps,
  createCollection,
  filterItems,
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
import { menuPlacement, type MenuAlign } from '../core/options';
import { iconSvg } from '../icons';
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

export interface ComboboxOptions extends Pick<
  ComboboxProps,
  'multiple' | 'disabled' | 'readOnly' | 'placeholder' | 'name' | 'translations' | 'closeOnSelect'
> {
  /** Initial or entangled value: a string, or an array with `multiple`. */
  value?: string | string[] | null;
  /**
   * Entangled search text. With `remote`, the server filters: typing updates
   * this and the server renders the matching items.
   */
  search?: string;
  /** The server filters the items. Without it, items are filtered by label here. */
  remote?: boolean;
  /** Accept a typed value that isn't an item. */
  allowCustom?: boolean;
  /** Where the listbox opens. Default `bottom-start`, as wide as the control. */
  positioning?: PositionOptions;
  id?: string;
}

/** The `apuiCombobox` Alpine component. `value` and `search` are plain state, so they can be entangled with Livewire. */
function comboboxComponent(options: ComboboxOptions = {}) {
  const multiple = Boolean(options.multiple);
  let widget: Widget<ComboboxProps, ComboboxApi> | undefined;
  const items = new Map<Element, ComboboxItem>();
  let visible: ComboboxItem[] = [];
  let shown = new Set<ComboboxItem>();
  let query = '';
  let scheduled = false;
  let root: HTMLElement | undefined;

  return {
    value: options.value ?? (multiple ? [] : null),
    search: options.search ?? '',
    inputValue: '',
    open: false,

    init(
      this: AlpineMagics & {
        value: string | string[] | null;
        search: string;
        inputValue: string;
        open: boolean;
      },
    ) {
      const el = this.$el;
      root = el;
      const toArray = (value: unknown): string[] =>
        Array.isArray(value)
          ? value.map(String)
          : value == null || value === ''
            ? []
            : [String(value)];

      widget = createWidget(combobox, {
        id: options.id ?? this.$id('apui-combobox'),
        ids: authoredIds(el),
        multiple,
        disabled: options.disabled,
        readOnly: options.readOnly,
        placeholder: options.placeholder,
        name: options.name,
        translations: options.translations,
        closeOnSelect: options.closeOnSelect,
        allowCustomValue: options.allowCustom,
        collection: createCollection([]),
        value: toArray(this.value),
        inputBehavior: 'autohighlight',
        openOnClick: true,
        selectionBehavior: multiple ? 'clear' : 'replace',
        // The listbox is as wide as the control unless the options say otherwise.
        positioning: zagPositioning(el, { sameWidth: true, ...options.positioning }),
        onValueChange: ({ value }) => {
          const next = multiple ? value : (value[0] ?? null);
          if (!sameValue(this.value, next)) this.value = next;
          dispatch(el, 'value-change', { value: next });
        },
        onInputValueChange: ({ inputValue, reason }) => {
          this.inputValue = inputValue;
          if (options.remote) {
            if (reason === 'input-change' && this.search !== inputValue) this.search = inputValue;
            return;
          }
          // Filter only on typing. After a selection the input shows the label,
          // and the next open should list everything again.
          query = reason === 'input-change' ? inputValue : '';
          refresh();
        },
        onOpenChange: ({ open }) => {
          this.open = open;
          if (!open && !options.remote) {
            query = '';
            refresh();
          }
          dispatch(el, 'open-change', { open });
        },
      });
      widget.start();
      this.$watch('value', (value: unknown) => {
        widget?.setProps({ value: toArray(value) });
        queueMicrotask(showLabel);
      });
    },

    destroy() {
      widget?.stop();
      widget = undefined;
      items.clear();
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      if (part === 'item') {
        const item = toItem(el, args());
        items.set(el, item);
        schedule();
        const unbind = widget.bind(el, (api) => ({
          ...api.getItemProps({ item }),
          hidden: options.remote || shown.has(item) ? undefined : true,
        }));
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
            ? partProps(api as unknown as Record<string, unknown>, 'combobox', part, { item })
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

  /** Rebuilds the collection from the registered items in DOM order, filtered by the typed query unless remote. */
  function refresh() {
    if (!widget) return;
    // A morph removes items before Alpine runs their cleanup, so drop
    // detached ones here rather than wait for it.
    for (const el of [...items.keys()]) if (!el.isConnected) items.delete(el);
    const ordered = [...items]
      .sort(([a], [b]) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )
      .map(([, item]) => item);
    visible = options.remote ? ordered : filterItems(ordered, query);
    shown = new Set(visible);
    widget.setProps({ collection: createCollection(visible) });
  }

  /**
   * Puts the selected item's label in the input while the list is closed.
   * The machine only does that when an item is picked, so a value from the
   * server (the initial render, or $wire setting it) would leave the input
   * empty.
   */
  function showLabel() {
    if (!widget || multiple) return;
    const api = widget.api();
    // Never while someone is typing in it.
    if (api.open || root?.querySelector('[data-part="input"]') === document.activeElement) return;
    const selected = api.value[0];
    const item =
      selected === undefined ? undefined : [...items.values()].find((i) => i.value === selected);
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
  return {
    value: String(value),
    label: String(args?.label ?? text ?? value),
    disabled: Boolean(args?.disabled),
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
  Alpine.data('apuiCombobox', comboboxComponent as never);
  Alpine.data('apuiDropdownMenu', dropdownMenuComponent as never);
  Alpine.data('apuiToaster', ((options?: ToasterAlpineOptions) =>
    toasterComponent(Alpine, options)) as never);
  Alpine.data('apuiToast', ((entry: ToastProps, index?: number) =>
    toastComponent(Alpine, entry, index)) as never);

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

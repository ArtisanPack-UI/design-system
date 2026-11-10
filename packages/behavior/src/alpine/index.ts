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
import { type PositionOptions, zagPositioning } from '../positioning';

type Alpine = AlpineGlobal.Alpine;
type PartArgs = Record<string, unknown> | undefined;

/** What a component exposes to its `x-apui:*` directives. */
interface PartHost {
  apuiPart(part: string, el: Element, args: () => PartArgs): () => void;
}

const camel = (part: string) => part.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
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
      if (!el.id) continue;
      for (const { name } of Array.from(el.attributes)) {
        if (!name.startsWith('x-apui:')) continue;
        const part = name.slice('x-apui:'.length);
        if (part !== 'item' && !part.startsWith('item-')) ids[camel(part)] = el.id;
      }
    }
  };
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

function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

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

function comboboxComponent(options: ComboboxOptions = {}) {
  const multiple = Boolean(options.multiple);
  let widget: Widget<ComboboxProps, ComboboxApi> | undefined;
  const items = new Map<Element, ComboboxItem>();
  let visible: ComboboxItem[] = [];
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
        positioning: { ...zagPositioning(el, options.positioning), sameWidth: true },
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
          hidden: options.remote || visible.includes(item) ? undefined : true,
        }));
        return () => {
          unbind();
          items.delete(el);
          schedule();
        };
      }
      if (part === 'item-text' || part === 'item-indicator') {
        const owner = el.closest('[data-part="item"]');
        const item = owner && items.get(owner);
        if (!item) return () => {};
        return widget.bind(el, (api) =>
          partProps(api as unknown as Record<string, unknown>, 'combobox', part, { item }),
        );
      }
      if (part === 'empty') {
        // Not a machine part: shown when no item matches.
        return widget.bind(el, () => ({
          'data-scope': 'combobox',
          'data-part': 'empty',
          role: 'status',
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

/** An item from its directive's expression, defaulting the label to the text. */
function toItem(el: Element, args: PartArgs): ComboboxItem {
  const value = args?.value ?? el.getAttribute('data-value') ?? el.textContent?.trim() ?? '';
  return {
    value: String(value),
    label: String(args?.label ?? el.textContent?.trim() ?? value),
    disabled: Boolean(args?.disabled),
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

/** Registers `apuiDialog`, `apuiCombobox` and the `x-apui:<part>` directive. */
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

  Alpine.directive(
    'apui',
    (el, { value: part, expression }, { evaluateLater, effect, cleanup }) => {
      if (!part) throw new Error('[apui] x-apui needs a part, e.g. x-apui:trigger');
      const host = Alpine.$data(el as HTMLElement) as unknown as Partial<PartHost>;
      if (typeof host.apuiPart !== 'function') {
        throw new Error(`[apui] x-apui:${part} must be inside an apuiDialog or apuiCombobox`);
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

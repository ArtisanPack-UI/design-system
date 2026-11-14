/**
 * The `apuiAccordion` and `apuiCollapse` Alpine components (#58), on the
 * shared accordion and collapse definitions.
 *
 *   <div id="faq" x-data="apuiAccordion({ value: $wire.entangle('open') })" x-apui:root class="apui-accordion">
 *     <div id="faq-item-live" x-apui:item="{ value: 'live' }">
 *       <h3 data-scope="accordion" data-part="title">
 *         <button id="faq-trigger-live" x-apui:item-trigger="{ value: 'live' }">
 *           How long does a listing stay live?
 *           <span x-apui:item-indicator="{ value: 'live' }">…</span>
 *         </button>
 *       </h3>
 *       <div id="faq-content-live" x-apui:item-content="{ value: 'live' }">…</div>
 *     </div>
 *   </div>
 *
 *   <div id="advanced" x-data="apuiCollapse({ open: $wire.entangle('advanced') })" x-apui:root class="apui-collapse">
 *     <button id="advanced-trigger" x-apui:trigger>Advanced settings <span x-apui:indicator>…</span></button>
 *     <div id="advanced-content" x-apui:content>…</div>
 *   </div>
 *
 * The directives keep the machines' names (`item-trigger`, `indicator`);
 * the parts render the spec's (`trigger`, `icon`). `value` and `open` are
 * plain Alpine state, so `$wire.entangle()` binds them to Livewire; a change
 * the widget makes dispatches `value-change` or `open-change`. A single
 * accordion bound to a string (or null) writes back a string; otherwise the
 * open items are an array. Authored ids are kept, per value for the
 * accordion's items (rule 1 of the Livewire rules).
 */
import { createWidget, type Widget } from '../core/widget';
import type { Attrs } from '../core/props';
import { directionOf } from '../positioning';
import {
  accordion,
  type AccordionApi,
  type AccordionProps,
  toOpenItems,
} from '../widgets/accordion';
import {
  collapse,
  COLLAPSE_CLAMP_HEIGHT,
  type CollapseApi,
  type CollapseProps,
  type CollapseVariant,
} from '../widgets/collapse';

type PartArgs = Record<string, unknown> | undefined;

interface Magics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

/** `item-trigger` → `ItemTrigger`. */
const pascal = (part: string) =>
  part
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());

/** The first element under `root` with `x-apui:<part>` that belongs to `root`'s component. */
function ownPart(root: HTMLElement, part: string): Element | undefined {
  return [...root.querySelectorAll(`[x-apui\\:${part}]`)].find(
    (el) => el.closest('[x-data]') === root,
  );
}

const sameItems = (a: unknown, b: string[]) => {
  const items = toOpenItems(a);
  return items.length === b.length && items.every((item, i) => item === b[i]);
};

export interface AccordionAlpineOptions {
  /** Initial or entangled value: the open items, or a single item's value. */
  value?: string[] | string | null;
  /** Several items open at once. Default false. */
  multiple?: boolean;
  /** The open item of a single accordion can close. Default true. */
  collapsible?: boolean;
  /** Disables every item. */
  disabled?: boolean;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/** The `apuiAccordion` Alpine component. `value` is plain state, so it can be entangled with Livewire. */
export function accordionComponent(options: AccordionAlpineOptions = {}) {
  let widget: Widget<AccordionProps, AccordionApi> | undefined;
  const itemIds = new Map<string, string>();
  const triggerIds = new Map<string, string>();
  const contentIds = new Map<string, string>();
  let scheduled = false;

  /** Re-applies the parts once this tick's are bound, so aria-controls points at authored ids. */
  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      widget?.refresh();
    });
  };

  return {
    value: (options.value ?? []) as string[] | string | null,

    init(this: Magics & { value: string[] | string | null }) {
      const el = this.$el;
      const id = options.id ?? this.$id('apui-accordion');
      const multiple = options.multiple ?? false;
      widget = createWidget(accordion, {
        id,
        ids: {
          root: el.id && el.hasAttribute('x-apui:root') ? el.id : undefined,
          item: (value: string) => itemIds.get(value) ?? `accordion:${id}:item:${value}`,
          itemTrigger: (value: string) =>
            triggerIds.get(value) ?? `accordion:${id}:trigger:${value}`,
          itemContent: (value: string) =>
            contentIds.get(value) ?? `accordion:${id}:content:${value}`,
        },
        dir: directionOf(el),
        value: toOpenItems(this.value),
        multiple,
        collapsible: options.collapsible ?? true,
        disabled: options.disabled,
        onValueChange: ({ value }) => {
          if (!sameItems(this.value, value)) {
            // A single accordion bound to a string keeps it a string.
            this.value = multiple || Array.isArray(this.value) ? value : (value[0] ?? null);
          }
          el.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true }));
        },
      });
      widget.start();
      this.$watch('value', (value: unknown) => widget?.setProps({ value: toOpenItems(value) }));
    },

    destroy() {
      widget?.stop();
      widget = undefined;
      itemIds.clear();
      triggerIds.clear();
      contentIds.clear();
    },

    /** Opens or closes an item, as a click on its trigger does. */
    toggle(value: string) {
      const api = widget?.api();
      if (!api) return;
      const open = api.value.includes(value);
      if (options.multiple) {
        api.setValue(open ? api.value.filter((item) => item !== value) : [...api.value, value]);
        return;
      }
      // One item open at a time: Zag keeps only value[0], so opening B has to
      // replace A, and a non-collapsible accordion keeps its open item.
      if (open) {
        if (options.collapsible ?? true) api.setValue([]);
        return;
      }
      api.setValue([value]);
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      const ownIds =
        part === 'item'
          ? itemIds
          : part === 'item-trigger'
            ? triggerIds
            : part === 'item-content'
              ? contentIds
              : undefined;
      if (ownIds && el.id) {
        ownIds.set(String(args()?.value ?? ''), el.id);
        refresh();
      }
      return widget.bind(el, (api) => {
        const getter = (api as unknown as Record<string, unknown>)[`get${pascal(part)}Props`];
        if (typeof getter !== 'function') throw new Error(`[apui] accordion has no part "${part}"`);
        const given = args();
        return getter(
          part === 'root'
            ? undefined
            : {
                value: String(given?.value ?? ''),
                disabled: Boolean(given?.disabled) || undefined,
              },
        ) as Attrs;
      });
    },
  };
}

export interface CollapseAlpineOptions {
  /** Initial or entangled open state. */
  open?: boolean;
  /** `read-more` clamps the closed region instead of hiding it. */
  variant?: CollapseVariant;
  disabled?: boolean;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/** The `apuiCollapse` Alpine component. `open` is plain state, so it can be entangled with Livewire. */
export function collapseComponent(options: CollapseAlpineOptions = {}) {
  let widget: Widget<CollapseProps, CollapseApi> | undefined;

  return {
    open: (options.open ?? false) as boolean,

    init(this: Magics & { open: boolean }) {
      const el = this.$el;
      const id = options.id ?? this.$id('apui-collapse');
      widget = createWidget(collapse, {
        id,
        ids: {
          root: el.id && el.hasAttribute('x-apui:root') ? el.id : undefined,
          trigger: ownPart(el, 'trigger')?.id || undefined,
          content: ownPart(el, 'content')?.id || undefined,
        },
        dir: directionOf(el),
        open: Boolean(this.open),
        disabled: options.disabled,
        collapsedHeight: options.variant === 'read-more' ? COLLAPSE_CLAMP_HEIGHT : undefined,
        onOpenChange: ({ open }) => {
          if (Boolean(this.open) !== open) this.open = open;
          el.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true }));
        },
      });
      widget.start();
      this.$watch('open', (open: unknown) => widget?.setProps({ open: Boolean(open) }));
    },

    destroy() {
      widget?.stop();
      widget = undefined;
    },

    /** Opens or closes the region, as a click on the trigger does. */
    toggle(this: { open: boolean }) {
      this.open = !this.open;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      return widget.bind(el, (api) => {
        const getter = (api as unknown as Record<string, unknown>)[`get${pascal(part)}Props`];
        if (typeof getter !== 'function') throw new Error(`[apui] collapse has no part "${part}"`);
        return getter(args()) as Attrs;
      });
    },
  };
}

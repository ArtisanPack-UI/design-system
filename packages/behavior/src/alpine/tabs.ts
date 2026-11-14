/**
 * The `apuiTabs` Alpine component (#56), on the shared tabs definition.
 *
 *   <div id="account" x-data="apuiTabs({ value: $wire.entangle('section') })" x-apui:root>
 *     <div id="account-list" x-apui:list>
 *       <button id="account-trigger-profile" x-apui:trigger="{ value: 'profile' }">Profile</button>
 *       <button id="account-trigger-billing" x-apui:trigger="{ value: 'billing', disabled: true }">Billing</button>
 *     </div>
 *     <div id="account-content-profile" x-apui:content="{ value: 'profile' }">…</div>
 *     <div id="account-content-billing" x-apui:content="{ value: 'billing' }">…</div>
 *   </div>
 *
 * `value` is plain Alpine state, so `$wire.entangle()` binds it to Livewire;
 * a change the tabs make dispatches `value-change`. The machine names
 * triggers and panels per value, so their authored ids are kept per value
 * (rule 1 of the Livewire rules: every part keeps its server-rendered id).
 * The arrow keys follow the text direction the root computes to.
 */
import { createWidget, type Widget } from '../core/widget';
import type { Attrs } from '../core/props';
import { directionOf } from '../positioning';
import {
  type TabsActivationMode,
  type TabsApi,
  type TabsOrientation,
  type TabsProps,
  tabs,
} from '../widgets/tabs';

type PartArgs = Record<string, unknown> | undefined;

export interface TabsAlpineOptions {
  /** Initial or entangled value: the selected tab. */
  value?: string | null;
  /** Default `horizontal`. */
  orientation?: TabsOrientation;
  /** Default `automatic`: the arrow keys select. `manual` only moves focus. */
  activationMode?: TabsActivationMode;
  /** Wrap from the last tab to the first. Default true. */
  loopFocus?: boolean;
  /** Names the tablist (`aria-label`). */
  label?: string;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

interface Magics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

/** `item-text` → `ItemText`. */
const pascal = (part: string) =>
  part
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());

/** The `apuiTabs` Alpine component. `value` is plain state, so it can be entangled with Livewire. */
export function tabsComponent(options: TabsAlpineOptions = {}) {
  let widget: Widget<TabsProps, TabsApi> | undefined;
  const ids: { root?: string; list?: string; indicator?: string } = {};
  const triggerIds = new Map<string, string>();
  const contentIds = new Map<string, string>();
  let scheduled = false;
  let host: (Magics & { value: string | null }) | undefined;

  /**
   * Once the parts bound this tick are known: re-applies them, so
   * aria-controls points at the authored ids, and selects the first enabled
   * tab when nothing is (as the server renders it, D-015).
   */
  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      if (!widget || !host) return;
      if (widget.api().value == null) {
        const first = host.$el.querySelector(
          '[data-scope="tabs"][data-part="trigger"]:not([disabled])',
        );
        const value = first?.getAttribute('data-value');
        if (value) host.value = value;
      }
      widget.refresh();
    });
  };

  return {
    value: options.value ?? null,

    init(this: Magics & { value: string | null }) {
      const el = this.$el;
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- helpers outside the component object need Alpine's reactive proxy
      host = this;
      const id = options.id ?? this.$id('apui-tabs');
      // The root, list and indicator keep their authored ids (rule 1).
      if (el.id && el.hasAttribute('x-apui:root')) ids.root = el.id;
      const list = el.querySelector('[x-apui\\:list]');
      if (list?.id) ids.list = list.id;
      widget = createWidget(tabs, {
        id,
        ids: {
          ...ids,
          trigger: (value: string) => triggerIds.get(value) ?? `tabs:${id}:trigger-${value}`,
          content: (value: string) => contentIds.get(value) ?? `tabs:${id}:content-${value}`,
        },
        dir: directionOf(el),
        value: this.value ?? null,
        orientation: options.orientation ?? 'horizontal',
        activationMode: options.activationMode ?? 'automatic',
        loopFocus: options.loopFocus ?? true,
        translations: options.label ? { listLabel: options.label } : undefined,
        onValueChange: ({ value }) => {
          if (this.value !== value) this.value = value;
          el.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true }));
        },
      });
      widget.start();
      this.$watch('value', (value: unknown) =>
        widget?.setProps({ value: value == null || value === '' ? null : String(value) }),
      );
    },

    destroy() {
      widget?.stop();
      widget = undefined;
      host = undefined;
      triggerIds.clear();
      contentIds.clear();
    },

    /** Selects a tab, as a click on it does. */
    select(this: { value: string | null }, value: string) {
      this.value = value;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      if (part === 'trigger' || part === 'content') {
        const ownIds = part === 'trigger' ? triggerIds : contentIds;
        const value = () => String(args()?.value ?? '');
        if (el.id) ownIds.set(value(), el.id);
        refresh();
        return widget.bind(el, (api) =>
          part === 'trigger'
            ? (api.getTriggerProps({
                value: value(),
                disabled: Boolean(args()?.disabled),
              }) as Attrs)
            : (api.getContentProps({ value: value() }) as Attrs),
        );
      }
      return widget.bind(el, (api) => {
        const getter = (api as unknown as Record<string, unknown>)[`get${pascal(part)}Props`];
        if (typeof getter !== 'function') throw new Error(`[apui] tabs has no part "${part}"`);
        return getter(args()) as Attrs;
      });
    },
  };
}

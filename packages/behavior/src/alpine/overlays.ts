/**
 * The `apuiDrawer`, `apuiPopover` and `apuiTooltip` Alpine components (#58,
 * #59), on the shared drawer, popover and tooltip definitions.
 *
 *   <div x-data="apuiDrawer({ open: $wire.entangle('filters') })">
 *     <button id="f-trigger" x-apui:trigger>Filters</button>
 *     <div id="f-backdrop" x-apui:backdrop></div>
 *     <div id="f-positioner" x-apui:positioner>
 *       <aside id="f-content" class="apui-drawer" x-apui:content>…</aside>
 *     </div>
 *   </div>
 *
 *   <span x-data="apuiTooltip({ placement: 'top' })" style="display: contents">
 *     <button id="t-trigger" x-apui:trigger aria-label="Archive">…</button>
 *     <div id="t-positioner" x-apui:positioner>
 *       <div id="t-content" class="apui-tooltip" x-apui:content>
 *         <span id="t-arrow" x-apui:arrow></span>Archive
 *       </div>
 *     </div>
 *   </span>
 *
 * Drawer and Popover keep `open` as plain Alpine state, as Dialog does, so
 * `$wire.entangle()` binds it and the widget writes its own changes back.
 * A Tooltip without `open` keeps its own state; with `open` it shows exactly
 * that (a forced tooltip, as in React and Vue), and with `bound: true` (an
 * entangled `open`) it writes its changes back too. Every part keeps its
 * server-rendered id (D-015). Popover and Tooltip write the requested,
 * logical placement as `data-placement` on the panel; the machine writes the
 * side it settled on as `data-side`.
 */
import { createWidget, type Widget } from '../core/widget';
import type { Attrs } from '../core/props';
import { directionOf, zagPositioning } from '../positioning';
import { drawer, type DrawerApi, type DrawerProps } from '../widgets/drawer';
import {
  type OverlayPlacement,
  POPOVER_GUTTER,
  popover,
  type PopoverApi,
  popoverPlacement,
  type PopoverProps,
} from '../widgets/popover';
import {
  TOOLTIP_DELAY,
  TOOLTIP_GUTTER,
  tooltip,
  type TooltipApi,
  tooltipPlacement,
  type TooltipProps,
} from '../widgets/tooltip';

type PartArgs = Record<string, unknown> | undefined;

interface Magics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

/** `close-trigger` → `closeTrigger`. */
const camel = (part: string) => part.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
/** `close-trigger` → `CloseTrigger`. */
const pascal = (part: string) => camel(part).replace(/^./, (c) => c.toUpperCase());

/** The machine's props for a part, from `api.get<Part>Props(args)`. */
function partProps(api: unknown, scope: string, part: string, args: PartArgs): Attrs {
  const getter = (api as Record<string, unknown>)[`get${pascal(part)}Props`];
  if (typeof getter !== 'function') throw new Error(`[apui] ${scope} has no part "${part}"`);
  return getter(args) as Attrs;
}

/**
 * The author's `id`s on this component's parts, as the machine's `ids` prop,
 * including parts in `x-teleport` templates and the component's own element.
 * Parts of a nested widget are left to it.
 */
function authoredIds(root: Element): Record<string, string> {
  const ids: Record<string, string> = {};
  const collect = (el: Element) => {
    if (!el.id) return;
    for (const { name } of Array.from(el.attributes)) {
      if (name.startsWith('x-apui:')) ids[camel(name.slice('x-apui:'.length))] = el.id;
    }
  };
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
  collect(root);
  visit(root, (el) => el.closest('[x-data]') !== root);
  return ids;
}

/** Dispatches a bubbling custom event, as the vocabulary names Livewire and Alpine events. */
function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** A positioned panel's props, with the requested placement written over Zag's physical one. */
function withPlacement(attrs: Attrs, placement: OverlayPlacement): Attrs {
  return { ...attrs, 'data-placement': placement };
}

// ---------------------------------------------------------------------------
// Drawer

export interface DrawerAlpineOptions extends Pick<
  DrawerProps,
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

/** The `apuiDrawer` Alpine component: Dialog's, with the parts scoped `drawer`. */
export function drawerComponent(options: DrawerAlpineOptions = {}) {
  let widget: Widget<DrawerProps, DrawerApi> | undefined;

  return {
    open: options.open ?? false,

    init(this: Magics & { open: boolean }) {
      const el = this.$el;
      widget = createWidget(drawer, {
        id: options.id ?? this.$id('apui-drawer'),
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
      return widget.bind(el, (api) => partProps(api, 'drawer', part, args()));
    },
  };
}

// ---------------------------------------------------------------------------
// Popover

export interface PopoverAlpineOptions {
  /** Initial or entangled open state. */
  open?: boolean;
  /** The trigger's side it sits on. Default `bottom`. */
  placement?: OverlayPlacement;
  /** Whether the panel is teleported to the body. Default true. */
  portalled?: boolean;
  /** Moves focus into the panel when it opens. Default true. */
  autoFocus?: boolean;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/** The `apuiPopover` Alpine component. `open` is plain state, so it can be entangled with Livewire. */
export function popoverComponent(options: PopoverAlpineOptions = {}) {
  let widget: Widget<PopoverProps, PopoverApi> | undefined;
  const placement = options.placement ?? 'bottom';

  return {
    open: options.open ?? false,

    init(this: Magics & { open: boolean }) {
      const el = this.$el;
      const dir = directionOf(el);
      widget = createWidget(popover, {
        id: options.id ?? this.$id('apui-popover'),
        ids: authoredIds(el),
        dir,
        open: Boolean(this.open),
        modal: false,
        portalled: options.portalled ?? true,
        autoFocus: options.autoFocus ?? true,
        positioning: zagPositioning(el, {
          placement: popoverPlacement(placement),
          gutter: POPOVER_GUTTER,
          dir,
        }),
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
      return widget.bind(el, (api) => {
        const attrs = partProps(api, 'popover', part, args());
        return part === 'content' ? withPlacement(attrs, placement) : attrs;
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Tooltip

export interface TooltipAlpineOptions {
  /**
   * Leave it out and the tooltip keeps its own state. Set, it shows exactly
   * this (a forced tooltip), unless `bound`.
   */
  open?: boolean | null;
  /** `open` is entangled: the tooltip writes its own changes back to it. */
  bound?: boolean;
  /** The trigger's side it sits on. Default `top`. */
  placement?: OverlayPlacement;
  /** Milliseconds the pointer rests on the trigger before it shows. Default 400. */
  delay?: number;
  /** Milliseconds before it hides once the pointer leaves. Default 150. */
  closeDelay?: number;
  /** Never shows. */
  disabled?: boolean;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/** The `apuiTooltip` Alpine component. */
export function tooltipComponent(options: TooltipAlpineOptions = {}) {
  let widget: Widget<TooltipProps, TooltipApi> | undefined;
  const placement = options.placement ?? 'top';
  const controlled = options.open !== undefined && options.open !== null;

  return {
    // Raw, not coerced: a `$wire.entangle()` interceptor has to reach Alpine
    // intact, or it is read as `true` and never binds.
    open: options.open ?? false,

    init(this: Magics & { open: boolean }) {
      const el = this.$el;
      const dir = directionOf(el);
      widget = createWidget(tooltip, {
        id: options.id ?? this.$id('apui-tooltip'),
        ids: authoredIds(el),
        dir,
        ...(controlled ? { open: Boolean(this.open) } : { defaultOpen: false }),
        openDelay: options.delay ?? TOOLTIP_DELAY,
        closeDelay: options.closeDelay ?? 150,
        disabled: options.disabled ?? false,
        interactive: true,
        positioning: zagPositioning(el, {
          placement: tooltipPlacement(placement),
          gutter: TOOLTIP_GUTTER,
          dir,
        }),
        onOpenChange: ({ open }) => {
          if ((!controlled || options.bound) && this.open !== open) this.open = open;
          dispatch(el, 'open-change', { open });
        },
      });
      widget.start();
      if (controlled) {
        this.$watch('open', (open: unknown) => widget?.setProps({ open: Boolean(open) }));
      }
    },

    destroy() {
      widget?.stop();
      widget = undefined;
    },

    show(this: { open: boolean }) {
      if (controlled) this.open = true;
      else widget?.api().setOpen(true);
    },

    hide(this: { open: boolean }) {
      if (controlled) this.open = false;
      else widget?.api().setOpen(false);
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      return widget.bind(el, (api) => {
        const attrs = partProps(api, 'tooltip', part, args());
        return part === 'content' ? withPlacement(attrs, placement) : attrs;
      });
    },
  };
}

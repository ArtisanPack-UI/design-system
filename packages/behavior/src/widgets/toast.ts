/**
 * Toast and the toast stack (pilot #51) on Zag's toast machines: a store
 * that queues toasts, a group machine for the region (`aria-live`, the
 * hotkey that focuses it, pausing on hover and focus) and a machine per
 * toast (its timer, Escape, the action and close triggers).
 *
 * Toasts are created from data, the same in every stack: `toaster.create({
 * title, description, color })` in React and Vue, a `toast` browser event
 * from Livewire. Zag's `type` drives its queue priority and default timing,
 * so `color` maps onto it, and everything the design system adds (color,
 * variant, surface, icon) travels in `meta`.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/toast';
import type { PropTypes } from '@zag-js/types';

import type { Attrs } from '../core/props';
import type { Normalize, WidgetDefinition } from '../core/widget';

type Schema = zag.Machine extends Machine<infer S> ? S : never;
type GroupSchema = zag.GroupMachine extends Machine<infer S> ? S : never;

/** The semantic colors (vocabulary). A toast's color tints its icon. */
export type ToastColor =
  'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

/** Where the region sits. Logical: `start` and `end` follow the text direction. */
export type ToastPlacement =
  'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';

/** One toast, as `toaster.create()` and Livewire's `toast` event take it. */
export interface ToastOptions {
  /** Reusing an id updates that toast instead of adding one. */
  id?: string;
  title?: string;
  description?: string;
  /** Tints the icon. Default `neutral`. `error` makes the toast an alert. */
  color?: ToastColor;
  /** `inverse` is the dark-on-light (or light-on-dark) treatment. Default `default`. */
  variant?: 'default' | 'inverse';
  /** Default `overlay`. */
  surface?: 'overlay' | 'glass';
  /** An icon name from the registry. Defaults to the color's status icon. */
  icon?: string;
  /** Milliseconds before it dismisses itself, paused on hover and focus. 0 keeps it. Default 5000. */
  duration?: number;
  /** One action button. A toast with an action stays until it's used or closed. */
  action?: { label: string; onClick?: () => void };
  /** Hides the close button. */
  hideClose?: boolean;
}

/** What the design system keeps in a Zag toast's `meta`. */
export interface ToastMeta {
  color: ToastColor;
  variant: 'default' | 'inverse';
  surface: 'overlay' | 'glass';
  icon?: string;
}

/** The region's options, the same in every stack. */
export interface ToasterOptions {
  /** Default `bottom-end`. */
  placement?: ToastPlacement;
  /** At most this many show at once; the rest queue. Default 5. */
  max?: number;
  /** Space between toasts, in px. Default 8. */
  gap?: number;
  /** Distance from the viewport edge. Default `16px`. */
  offsets?: string;
  /** Milliseconds before a toast dismisses itself. Default 5000. */
  duration?: number;
  /** Keys that move focus to the region. Default Alt+T. */
  hotkey?: string[];
}

export type ToastStore = zag.Store<string>;
export type ToastProps = zag.Props<string>;
export type ToastApi = zag.Api<PropTypes> & {
  /** Props for the `icon` part. */
  getIconProps(): Attrs;
  /** Props for the `actions` part, the row that holds the action trigger. */
  getActionsProps(): Attrs;
  /** The design-system options the toast was created with. */
  meta: ToastMeta;
};
export type ToastGroupProps = zag.GroupProps;
export type ToastGroupApi = zag.GroupApi<PropTypes>;

/** The status icon each color shows when a toast names none (registry names, D-017). */
export const TOAST_ICONS: Readonly<Record<ToastColor, string>> = {
  primary: 'info',
  secondary: 'info',
  accent: 'info',
  neutral: 'info',
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-alert',
};

/** Zag's type for a color: it sets the queue priority. */
function typeFor(color: ToastColor): zag.Type {
  return color === 'success' || color === 'warning' || color === 'error' ? color : 'info';
}

/** An action's handler: only a function runs; a string from event JSON never does. */
function actionHandler(action: ToastOptions['action']): () => void {
  const onClick = action?.onClick;
  return typeof onClick === 'function' ? onClick : () => {};
}

/** A toast's meta, with defaults. */
export function toastMeta(options: Pick<ToastOptions, 'color' | 'variant' | 'surface' | 'icon'>) {
  return {
    color: options.color ?? 'neutral',
    variant: options.variant ?? 'default',
    surface: options.surface ?? 'overlay',
    icon: options.icon,
  } satisfies ToastMeta;
}

/**
 * The Zag options for a toast. `duration: 0` and an action both keep it on
 * screen (spec: toasts with actions don't auto-dismiss).
 */
export function toZagToast(options: ToastOptions, fallbackDuration?: number): zag.Options<string> {
  const meta = toastMeta(options);
  const duration = options.duration ?? fallbackDuration;
  const sticky = duration === 0 || options.action !== undefined;
  return {
    // Only when given: the store spreads these over the id it generates.
    ...(options.id === undefined ? {} : { id: options.id }),
    title: options.title,
    description: options.description,
    type: typeFor(meta.color),
    duration: sticky ? Infinity : duration,
    closable: !options.hideClose,
    action: options.action
      ? { label: options.action.label, onClick: actionHandler(options.action) }
      : undefined,
    meta,
  };
}

/**
 * The Zag fields an update changes: only the options given, so updating a
 * title keeps the toast's color, action and timing. Meta merges with the
 * toast's own.
 */
export function toZagToastPatch(
  options: ToastOptions,
  previous: Partial<zag.Props<string>>,
  fallbackDuration?: number,
): Partial<zag.Props<string>> {
  const before = toastMeta((previous.meta as Partial<ToastMeta> | undefined) ?? {});
  const given = <K extends keyof ToastOptions>(key: K) => options[key] !== undefined;
  const meta: ToastMeta = {
    color: options.color ?? before.color,
    variant: options.variant ?? before.variant,
    surface: options.surface ?? before.surface,
    icon: options.icon ?? before.icon,
  };
  const patch: Partial<zag.Props<string>> = { meta };
  if (given('title')) patch.title = options.title;
  if (given('description')) patch.description = options.description;
  if (given('color')) patch.type = typeFor(meta.color);
  if (given('hideClose')) patch.closable = !options.hideClose;
  if (given('action')) {
    patch.action = { label: options.action!.label, onClick: actionHandler(options.action!) };
  }
  if (given('duration') || given('action')) {
    const duration = options.duration ?? fallbackDuration;
    const sticky = duration === 0 || (options.action ?? previous.action) !== undefined;
    patch.duration = sticky ? Infinity : duration;
  }
  return patch;
}

/** A toaster: the store a region renders, with the design system's defaults. */
export interface Toaster {
  readonly store: ToastStore;
  /** Adds a toast, or updates the one with the same id. Returns its id. */
  create(options: ToastOptions): string;
  /** Updates a toast in place: only the options given change. */
  update(id: string, options: ToastOptions): string;
  /** Dismisses one toast, or all of them. */
  dismiss(id?: string): void;
  /** Removes one toast, or all of them, without the exit transition. */
  remove(id?: string): void;
}

/** Creates a toaster. Render its store with a region (`apuiToaster`, `useToaster`). */
export function createToaster(options: ToasterOptions = {}): Toaster {
  const duration = options.duration ?? 5000;
  const store = zag.createStore<string>({
    placement: options.placement ?? 'bottom-end',
    max: options.max ?? 5,
    gap: options.gap ?? 8,
    offsets: options.offsets ?? '16px',
    duration,
    hotkey: options.hotkey,
    overlap: false,
  });
  return {
    store,
    // Reusing an id updates that toast: only the options given change.
    create: (toast) =>
      toast.id !== undefined && store.getVisibleToasts().some((t) => t.id === toast.id)
        ? store.update(toast.id, (previous) => toZagToastPatch(toast, previous, duration))
        : store.create(toZagToast(toast, duration)),
    update: (id, toast) =>
      store.update(id, (previous) => toZagToastPatch(toast, previous, duration)),
    dismiss: (id) => store.dismiss(id),
    remove: (id) => store.remove(id),
  };
}

/** The `data-*` the design system adds to a toast's root. */
function rootAttrs(meta: ToastMeta, type: string | undefined): Attrs {
  return {
    'data-color': meta.color,
    'data-variant': meta.variant,
    'data-surface': meta.surface,
    // The spec: the region is polite, but an error is announced at once.
    ...(type === 'error' || meta.color === 'error' ? { role: 'alert' } : {}),
  };
}

export const toast: WidgetDefinition<Schema, ToastApi> = {
  scope: 'toast',
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) => {
    const api = zag.connect(service as never, normalize) as zag.Api<PropTypes>;
    const meta = toastMeta((service.prop('meta') as Partial<ToastMeta> | undefined) ?? {});
    return {
      ...api,
      meta,
      getRootProps: () => ({ ...api.getRootProps(), ...rootAttrs(meta, api.type) }),
      // Zag reports closable but still renders the trigger: hide it (hideClose).
      getCloseTriggerProps: () =>
        api.closable ? api.getCloseTriggerProps() : { ...api.getCloseTriggerProps(), hidden: true },
      getIconProps: () =>
        normalize.element({ 'data-scope': 'toast', 'data-part': 'icon', 'aria-hidden': 'true' }),
      getActionsProps: () => normalize.element({ 'data-scope': 'toast', 'data-part': 'actions' }),
    } as ToastApi;
  },
};

/**
 * Zag places the region by mapping `-start`/`-end` to a physical side from
 * `dir`, then writes it as a logical `inset-inline-*` on an element that
 * carries that `dir`, so RTL flips twice and lands on the wrong side. This
 * undoes the second flip on the group's style: start and end trade places,
 * as do the flex alignments that line the toasts up against that edge.
 */
function mirrorRegion(normalize: Normalize): Normalize {
  const swap: Record<string, string> = { 'flex-start': 'flex-end', 'flex-end': 'flex-start' };
  const fix = (props: unknown) => {
    const attrs = props as Record<string, unknown>;
    const style = attrs.style as Record<string, unknown> | undefined;
    if (attrs['data-part'] !== 'group' || attrs.dir !== 'rtl' || !style) return props;
    const { insetInlineStart, insetInlineEnd, alignItems, ...rest } = style;
    return {
      ...attrs,
      style: {
        ...rest,
        insetInlineStart: insetInlineEnd,
        insetInlineEnd: insetInlineStart,
        alignItems: typeof alignItems === 'string' ? (swap[alignItems] ?? alignItems) : alignItems,
      },
    };
  };
  return new Proxy(normalize, {
    get(target, key) {
      const value = Reflect.get(target, key) as unknown;
      if (typeof value !== 'function' || key === 'style') return value;
      return (props: unknown) => (value as (p: unknown) => unknown)(fix(props));
    },
  });
}

export const toastGroup: WidgetDefinition<GroupSchema, ToastGroupApi> = {
  scope: 'toast',
  machine: zag.group.machine as Machine<GroupSchema>,
  connect: (service, normalize) => zag.group.connect(service as never, mirrorRegion(normalize)),
};

/** Ids of a standalone toast's parts. */
export interface StaticToastIds {
  root: string;
  title: string;
  description: string;
}

/**
 * The parts of a toast rendered outside a region, with no machine: in docs,
 * a page's inline status, and the gate fixtures. The same attributes as a
 * live toast's, less the machine's timing state, so every stack renders a
 * standalone toast alike. Keys are DOM attribute names.
 */
export function staticToastParts(
  options: Pick<ToastOptions, 'color' | 'variant' | 'surface' | 'icon' | 'title' | 'description'>,
  ids: StaticToastIds,
  translations: { closeTriggerLabel?: string } = {},
) {
  const meta = toastMeta(options);
  return {
    meta,
    /** The icon name to render in the `icon` part. */
    iconName: options.icon ?? TOAST_ICONS[meta.color],
    root: {
      'data-scope': 'toast',
      'data-part': 'root',
      id: ids.root,
      'data-state': 'open',
      'data-type': typeFor(meta.color),
      role: 'status',
      'aria-atomic': 'true',
      'aria-labelledby': options.title ? ids.title : undefined,
      'aria-describedby': options.description ? ids.description : undefined,
      ...rootAttrs(meta, undefined),
    } as Attrs,
    icon: { 'data-scope': 'toast', 'data-part': 'icon', 'aria-hidden': 'true' } as Attrs,
    title: { 'data-scope': 'toast', 'data-part': 'title', id: ids.title } as Attrs,
    description: {
      'data-scope': 'toast',
      'data-part': 'description',
      id: ids.description,
    } as Attrs,
    actions: { 'data-scope': 'toast', 'data-part': 'actions' } as Attrs,
    actionTrigger: {
      'data-scope': 'toast',
      'data-part': 'action-trigger',
      type: 'button',
    } as Attrs,
    closeTrigger: {
      'data-scope': 'toast',
      'data-part': 'close-trigger',
      type: 'button',
      'aria-label': translations.closeTriggerLabel ?? 'Dismiss notification',
    } as Attrs,
  };
}

/**
 * Drawer, Popover and Tooltip for the Vue adapter (#58, #59). Each composable
 * runs its widget definition through Zag's Vue adapter, so the parts, ARIA,
 * `data-scope` and `data-part` match the Alpine components exactly. Options
 * are an object, a ref or a getter, so they can follow props.
 *
 *   const tooltip = useTooltip(() => ({ placement: props.placement }));
 *   <button v-bind="tooltip.getTriggerProps()">…</button>
 *
 * `usePopover` and `useTooltip` return the content's props with the
 * requested, logical placement as `data-placement` (Zag's settled side stays
 * in `data-side`), as the Alpine components write it.
 */
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import type { Api as ZagPopoverApi } from '@zag-js/popover';
import type { Api as ZagTooltipApi } from '@zag-js/tooltip';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/vue';
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue, useId } from 'vue';

import { type DialogOptions, toDialogProps } from '../core/options';
import type { Normalize } from '../core/widget';
import { drawer } from '../widgets/drawer';
import { popover, type PopoverOptions, toPopoverProps } from '../widgets/popover';
import { tooltip, type TooltipOptions, toTooltipProps } from '../widgets/tooltip';
import { useDirection } from './direction';

export type { DrawerSide } from '../widgets/drawer';
export type { OverlayPlacement, PopoverIds, PopoverOptions } from '../widgets/popover';
export { tooltipKeys, type TooltipIds, type TooltipOptions } from '../widgets/tooltip';

const normalize = normalizeProps as unknown as Normalize;

/** Options for `useDrawer`: Dialog's. */
export type DrawerOptions = DialogOptions;

/** The drawer's API with Vue props for each part, scoped `drawer`. */
export type DrawerApi = ZagDialogApi<PropTypes>;

/** The popover's API with Vue props for each part. */
export type PopoverApi = ZagPopoverApi<PropTypes>;

/** The tooltip's API with Vue props for each part. */
export type TooltipApi = ZagTooltipApi<PropTypes>;

/** The machine id and the measured direction, shared by the three composables. */
function setup<T extends { id?: string; ids?: unknown; dir?: 'ltr' | 'rtl' }>(
  options: MaybeRefOrGetter<T>,
) {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: current.ids };
  });
  return (current: T) => ({
    options: { ...current, dir: current.dir ?? measured.value },
    id: current.id ?? fallback,
  });
}

/**
 * Drawer: the dialog machine (focus trap, Escape, scroll lock, focus return)
 * with its parts scoped `drawer`. The side is the panel's CSS.
 */
export function useDrawer(options: MaybeRefOrGetter<DrawerOptions> = {}): ComputedRef<DrawerApi> {
  const resolve = setup(options);
  const props = computed(() => {
    const { options: current, id } = resolve(toValue(options));
    return toDialogProps(current, id);
  });
  const service = useMachine(drawer.machine, props);
  return computed(() => drawer.connect(service, normalize) as unknown as DrawerApi);
}

/** Popover: an anchored, non-modal `role=dialog` panel. */
export function usePopover(
  options: MaybeRefOrGetter<PopoverOptions> = {},
): ComputedRef<PopoverApi> {
  const resolve = setup(options);
  const props = computed(() => {
    const { options: current, id } = resolve(toValue(options));
    return toPopoverProps(current, id);
  });
  const service = useMachine(popover.machine, props);
  return computed(() => {
    const api = popover.connect(service, normalize) as unknown as PopoverApi;
    const placement = toValue(options).placement ?? 'bottom';
    return {
      ...api,
      getContentProps: () => ({ ...api.getContentProps(), 'data-placement': placement }) as never,
    };
  });
}

/**
 * Tooltip: shown on hover (after `delay`) and focus, linked to the trigger
 * with `aria-describedby`, hoverable, closed by Escape.
 */
export function useTooltip(
  options: MaybeRefOrGetter<TooltipOptions> = {},
): ComputedRef<TooltipApi> {
  const resolve = setup(options);
  const props = computed(() => {
    const { options: current, id } = resolve(toValue(options));
    return toTooltipProps(current, id);
  });
  const service = useMachine(tooltip.machine, props);
  return computed(() => {
    const api = tooltip.connect(service, normalize) as unknown as TooltipApi;
    const placement = toValue(options).placement ?? 'top';
    return {
      ...api,
      getContentProps: () => ({ ...api.getContentProps(), 'data-placement': placement }) as never,
    };
  });
}

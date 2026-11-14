/**
 * Drawer, Popover and Tooltip for the React adapter (#58, #59). Each hook
 * runs its widget definition through Zag's React adapter, so the parts, ARIA,
 * `data-scope` and `data-part` match the Alpine components exactly.
 *
 *   const tooltip = useTooltip({ placement: 'top' });
 *   <button {...tooltip.getTriggerProps()}>…</button>
 *   <div {...tooltip.getPositionerProps()}>
 *     <div {...tooltip.getContentProps()} className="apui-tooltip">…</div>
 *   </div>
 *
 * `usePopover` and `useTooltip` return the content's props with the
 * requested, logical placement as `data-placement` (Zag's settled side stays
 * in `data-side`), as the Alpine components write it.
 */
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import type { Api as ZagPopoverApi } from '@zag-js/popover';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react';
import type { Api as ZagTooltipApi } from '@zag-js/tooltip';
import { useId } from 'react';

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

/** The drawer's API with React props for each part, scoped `drawer`. */
export type DrawerApi = ZagDialogApi<PropTypes>;

/** The popover's API with React props for each part. */
export type PopoverApi = ZagPopoverApi<PropTypes>;

/** The tooltip's API with React props for each part. */
export type TooltipApi = ZagTooltipApi<PropTypes>;

/**
 * Drawer: the dialog machine (focus trap, Escape, scroll lock, focus return)
 * with its parts scoped `drawer`. The side is the panel's CSS.
 */
export function useDrawer(options: DrawerOptions = {}): DrawerApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    drawer.machine,
    toDialogProps({ ...options, dir }, options.id ?? fallback),
  );
  return drawer.connect(service, normalize) as unknown as DrawerApi;
}

/** Popover: an anchored, non-modal `role=dialog` panel. */
export function usePopover(options: PopoverOptions = {}): PopoverApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    popover.machine,
    toPopoverProps({ ...options, dir }, options.id ?? fallback),
  );
  const api = popover.connect(service, normalize) as unknown as PopoverApi;
  const placement = options.placement ?? 'bottom';
  return {
    ...api,
    getContentProps: () => ({ ...api.getContentProps(), 'data-placement': placement }) as never,
  };
}

/**
 * Tooltip: shown on hover (after `delay`) and focus, linked to the trigger
 * with `aria-describedby`, hoverable, closed by Escape.
 */
export function useTooltip(options: TooltipOptions = {}): TooltipApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    tooltip.machine,
    toTooltipProps({ ...options, dir }, options.id ?? fallback),
  );
  const api = tooltip.connect(service, normalize) as unknown as TooltipApi;
  const placement = options.placement ?? 'top';
  return {
    ...api,
    getContentProps: () => ({ ...api.getContentProps(), 'data-placement': placement }) as never,
  };
}

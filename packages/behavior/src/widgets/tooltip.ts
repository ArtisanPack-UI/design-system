/**
 * Tooltip (#59) on Zag's tooltip machine: a short label shown on hover (after
 * `delay`) and on keyboard focus, linked to the trigger with
 * `aria-describedby` while it shows. Escape closes it. It is hoverable
 * (WCAG 1.4.13): the pointer can move onto it without closing it. Only one
 * tooltip shows at a time on a page.
 *
 * The parts keep Zag's names and scope (`tooltip`, D-019): trigger,
 * positioner, content (carrying `.apui-tooltip`) and arrow; the spec's `kbd`
 * is ours. As in Popover, Zag writes the settled side as `data-side` and
 * positions the arrow inline; the component writes the requested, logical
 * placement as `data-placement`.
 *
 * The trigger is the author's own control (a button, a link), so Livewire,
 * React and Vue put the trigger part's props on it rather than wrapping it.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/tooltip';

import { direction } from '../core/options';
import type { WidgetDefinition } from '../core/widget';
import {
  type Direction,
  type LogicalPlacement,
  type PositionOptions,
  zagPositioning,
} from '../positioning';
import type { OverlayPlacement } from './popover';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type TooltipProps = zag.Props;
export type TooltipApi = zag.Api;

/** The `data-scope` Tooltip's parts carry. */
export const TOOLTIP_SCOPE = 'tooltip';

/** The gap between the trigger and the label, in px: room for the arrow (see `POPOVER_GUTTER`). */
export const TOOLTIP_GUTTER = 8;

/** The spec's default delay before a tooltip shows on hover, in ms. */
export const TOOLTIP_DELAY = 400;

export const tooltip: WidgetDefinition<Schema, TooltipApi> = {
  scope: TOOLTIP_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) => zag.connect(service as never, normalize),
};

/** A tooltip sits centered on its trigger's side. */
export function tooltipPlacement(placement: OverlayPlacement = 'top'): LogicalPlacement {
  return placement;
}

/**
 * A shortcut as the keys a tooltip shows: `⌘+K` → `['⌘', 'K']`. Keys are
 * shown as given; a lone `+` is a key.
 */
export function tooltipKeys(shortcut: string | string[] | null | undefined): string[] {
  if (Array.isArray(shortcut)) return shortcut.map((key) => key.trim()).filter(Boolean);
  if (!shortcut) return [];
  const text = shortcut.trim();
  if (text === '+') return ['+'];
  return text
    .split(/\+(?!$)/)
    .map((key) => key.trim())
    .filter(Boolean);
}

/** Part ids for Tooltip. */
export interface TooltipIds {
  trigger?: string;
  positioner?: string;
  content?: string;
  arrow?: string;
}

/** Options for `useTooltip` in React and Vue. */
export interface TooltipOptions {
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip shows or hides itself (hover, focus, Escape). */
  onOpenChange?: (details: { open: boolean }) => void;
  /** The trigger's side the tooltip sits on. Default `top`. */
  placement?: OverlayPlacement;
  /** Overrides the placement, the gap and flipping. */
  positioning?: PositionOptions;
  /** Milliseconds the pointer rests on the trigger before it shows. Default 400. Focus shows it at once. */
  delay?: number;
  /** Milliseconds before it hides once the pointer leaves. Default 150. */
  closeDelay?: number;
  /** Never shows. */
  disabled?: boolean;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: TooltipIds;
  /** Text direction. Defaults to `<html dir>`. */
  dir?: Direction;
}

/** The tooltip machine's props for `options`. */
export function toTooltipProps(options: TooltipOptions, id: string): Partial<TooltipProps> {
  const dir = direction(options);
  return {
    id,
    ids: options.ids,
    dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    openDelay: options.delay ?? TOOLTIP_DELAY,
    closeDelay: options.closeDelay ?? 150,
    disabled: options.disabled ?? false,
    // Hoverable (WCAG 1.4.13): the pointer can move onto the tooltip.
    interactive: true,
    positioning: zagPositioning(null, {
      placement: tooltipPlacement(options.placement),
      gutter: TOOLTIP_GUTTER,
      ...options.positioning,
      dir,
    }),
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
  };
}

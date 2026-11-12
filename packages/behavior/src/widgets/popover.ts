/**
 * Popover (#58) on Zag's popover machine: an anchored, non-modal
 * `role=dialog` panel. Focus moves in when it opens and returns to the
 * trigger when it closes; Escape and an outside click close it; Tab past the
 * last control leaves it, after the trigger, even when it's portalled.
 *
 * The parts keep Zag's names and scope (`popover`, D-019): trigger,
 * positioner, content (the panel, carrying `.apui-popover`), arrow, title
 * and closeTrigger. The spec's `body` and `actions` are ours. Zag writes the
 * side it settled on (after flipping) as `data-side` on the content and
 * positions the arrow inline; the component writes the requested, logical
 * placement as `data-placement`, which the stylesheet reads before the
 * machine has positioned anything (server markup, no JavaScript).
 *
 * The options for the React and Vue adapters are mapped here, next to the
 * definition, rather than in `core/options.ts`.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/popover';

import { direction } from '../core/options';
import type { WidgetDefinition } from '../core/widget';
import {
  type Direction,
  type LogicalPlacement,
  type PositionOptions,
  type Side,
  zagPositioning,
} from '../positioning';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type PopoverProps = zag.Props;
export type PopoverApi = zag.Api;

/** The `data-scope` Popover's parts carry. */
export const POPOVER_SCOPE = 'popover';

/**
 * The gap between the trigger and the panel, in px: room for the arrow. The
 * stylesheet draws the arrow on a box-less part, so the machine doesn't add
 * its size to the gap itself.
 */
export const POPOVER_GUTTER = 10;

/** Where an overlay sits against its trigger. `start` and `end` follow the text direction. */
export type OverlayPlacement = Side;

export const popover: WidgetDefinition<Schema, PopoverApi> = {
  scope: POPOVER_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) => zag.connect(service as never, normalize),
};

/**
 * The logical placement a popover's side becomes: lined up with the
 * trigger's start edge, as the spec draws it (the arrow still points at the
 * trigger's center).
 */
export function popoverPlacement(placement: OverlayPlacement = 'bottom'): LogicalPlacement {
  return `${placement}-start`;
}

/** Part ids for Popover. */
export interface PopoverIds {
  trigger?: string;
  positioner?: string;
  content?: string;
  arrow?: string;
  title?: string;
  description?: string;
  closeTrigger?: string;
}

/** Options for `usePopover` in React and Vue. */
export interface PopoverOptions {
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes itself (trigger, Escape, outside click, close trigger). */
  onOpenChange?: (details: { open: boolean }) => void;
  /** The trigger's side the popover sits on. Default `bottom`. */
  placement?: OverlayPlacement;
  /** Overrides the placement, the gap and flipping. */
  positioning?: PositionOptions;
  /** Whether the panel renders at the end of the body: Tab past its last control then returns after the trigger. Default true. */
  portalled?: boolean;
  /** Moves focus into the panel when it opens. Default true. */
  autoFocus?: boolean;
  /** Default true. */
  closeOnEscape?: boolean;
  /** Default true. */
  closeOnInteractOutside?: boolean;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: PopoverIds;
  /** Text direction. Defaults to `<html dir>`. */
  dir?: Direction;
}

/** The popover machine's props for `options`. */
export function toPopoverProps(options: PopoverOptions, id: string): Partial<PopoverProps> {
  const dir = direction(options);
  return {
    id,
    ids: options.ids,
    dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: false,
    portalled: options.portalled ?? true,
    autoFocus: options.autoFocus ?? true,
    closeOnEscape: options.closeOnEscape ?? true,
    closeOnInteractOutside: options.closeOnInteractOutside ?? true,
    positioning: zagPositioning(null, {
      placement: popoverPlacement(options.placement),
      gutter: POPOVER_GUTTER,
      ...options.positioning,
      dir,
    }),
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
  };
}

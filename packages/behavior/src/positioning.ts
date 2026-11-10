/**
 * Positioning for floating parts (#33), on Floating UI.
 *
 * Placements are logical (D-004): `start` and `end` sides follow the text
 * direction, so `end` opens to the right in LTR and to the left in RTL. Floating
 * UI already mirrors `-start` and `-end` alignment in RTL; only the sides need
 * mapping.
 */
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
  size,
} from '@floating-ui/dom';

export type Side = 'top' | 'bottom' | 'start' | 'end';
export type LogicalPlacement = Side | `${Side}-start` | `${Side}-end`;
export type Direction = 'ltr' | 'rtl';

export interface PositionOptions {
  /** Where the floating element sits relative to the reference. Default `bottom-start`. */
  placement?: LogicalPlacement;
  /** Gap between them, in px. Default 4. */
  gutter?: number;
  /** Flip to the opposite side when there's no room. Default true. */
  flip?: boolean;
  /** Keep the floating element inside the viewport, with this padding. Default 8. */
  shiftPadding?: number;
  /** Make the floating element as wide as the reference (listboxes). Default false. */
  sameWidth?: boolean;
  /** Text direction. Read from the reference when left out. */
  dir?: Direction;
}

/** The direction an element renders in. */
export function directionOf(element: Element): Direction {
  return getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}

/** A logical placement as Floating UI's physical one. */
export function toPlacement(placement: LogicalPlacement, dir: Direction): Placement {
  const [side, align] = placement.split('-') as [Side, 'start' | 'end' | undefined];
  const physical =
    side === 'start'
      ? dir === 'rtl'
        ? 'right'
        : 'left'
      : side === 'end'
        ? dir === 'rtl'
          ? 'left'
          : 'right'
        : side;
  return (align ? `${physical}-${align}` : physical) as Placement;
}

/**
 * Positions `floating` against `reference` and keeps it there while either
 * moves, resizes or scrolls. Returns a cleanup function.
 */
export function position(
  reference: Element,
  floating: HTMLElement,
  options: PositionOptions = {},
): () => void {
  const {
    placement = 'bottom-start',
    gutter = 4,
    flip: shouldFlip = true,
    shiftPadding = 8,
    sameWidth = false,
  } = options;

  let disposed = false;
  let sequence = 0;
  const update = async () => {
    const run = ++sequence;
    const dir = options.dir ?? directionOf(reference);
    const result = await computePosition(reference, floating, {
      placement: toPlacement(placement, dir),
      strategy: 'fixed',
      middleware: [
        offset(gutter),
        shouldFlip && flip(),
        shift({ padding: shiftPadding }),
        sameWidth &&
          size({
            apply({ rects }) {
              floating.style.setProperty('min-inline-size', `${rects.reference.width}px`);
            },
          }),
      ],
    });
    // A late result after cleanup, or overtaken by a newer one, is dropped.
    if (disposed || run !== sequence) return;
    Object.assign(floating.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      transform: `translate3d(${Math.round(result.x)}px, ${Math.round(result.y)}px, 0)`,
    });
    floating.dataset.placement = result.placement;
  };

  const stop = autoUpdate(reference, floating, update);
  return () => {
    disposed = true;
    stop();
  };
}

/**
 * Zag's positioning options for a logical placement, for widgets whose machine
 * positions its own content (Combobox, Select, Menu, Popover).
 */
export function zagPositioning(reference: Element | null, options: PositionOptions = {}) {
  const dir = options.dir ?? (reference ? directionOf(reference) : 'ltr');
  return {
    placement: toPlacement(options.placement ?? 'bottom-start', dir),
    gutter: options.gutter ?? 4,
    flip: options.flip ?? true,
    overflowPadding: options.shiftPadding ?? 8,
    sameWidth: options.sameWidth ?? false,
  };
}

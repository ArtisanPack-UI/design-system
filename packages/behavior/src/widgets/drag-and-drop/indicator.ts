/**
 * The drop indicator: a line where a dropped item would land (D-057).
 *
 * In an uncontrolled context it's an element placed among the items, as
 * Livewire Drag and Drop always did. A controlled context's DOM belongs to
 * React or Vue, so there the line is an overlay fixed over the page and
 * positioned from the items' boxes, and nothing is inserted into the list.
 *
 * The horizontal line sits on the inline-start edge, so RTL lists draw it on
 * the right. Its color is `--drag-indicator-color`, else the primary color
 * token.
 */
import { contextOptions, getItems, insertAtIndex, isFlowReversed, itemsParent } from './dom';

const COLOR = 'var(--drag-indicator-color, var(--apui-color-primary, #2563eb))';
const THICKNESS = 3;

/** Where the indicator is now. */
export interface IndicatorState {
  element: HTMLElement | null;
  context: Element | null;
  overlay: boolean;
}

export const emptyIndicator = (): IndicatorState => ({
  element: null,
  context: null,
  overlay: false,
});

function createInline(context: Element): HTMLElement {
  const parent = getItems(context)[0]?.parentNode as Element | undefined;
  const tag = parent && ['UL', 'OL'].includes(parent.nodeName) ? 'li' : 'div';
  const indicator = document.createElement(tag);
  indicator.setAttribute('data-drag-indicator', '');
  indicator.setAttribute('aria-hidden', 'true');
  const horizontal = contextOptions(context).orientation === 'horizontal';
  Object.assign(indicator.style, {
    pointerEvents: 'none',
    listStyle: 'none',
    flex: '0 0 auto',
    alignSelf: 'stretch',
    boxSizing: 'border-box',
    ...(horizontal
      ? { width: '0', minHeight: '1.5rem', borderInlineStart: `${THICKNESS}px solid ${COLOR}` }
      : { height: '0', borderTop: `${THICKNESS}px solid ${COLOR}` }),
  });
  return indicator;
}

function createOverlay(): HTMLElement {
  const indicator = document.createElement('div');
  indicator.setAttribute('data-drag-indicator', '');
  indicator.setAttribute('data-drag-indicator-overlay', '');
  indicator.setAttribute('aria-hidden', 'true');
  Object.assign(indicator.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9998',
    background: COLOR,
    borderRadius: `${THICKNESS}px`,
  });
  document.body.appendChild(indicator);
  return indicator;
}

/**
 * The line's box for an insertion at `index` among the context's items,
 * not counting `dragged`.
 */
export function indicatorRect(
  context: Element,
  index: number,
  dragged: Element | null,
): { left: number; top: number; width: number; height: number } {
  const horizontal = contextOptions(context).orientation === 'horizontal';
  const reversed = isFlowReversed(context);
  const items = getItems(context).filter((item) => item !== dragged);
  const half = THICKNESS / 2;

  if (!items.length) {
    const box = itemsParent(context).getBoundingClientRect();
    return horizontal
      ? {
          left: (reversed ? box.right : box.left) - half,
          top: box.top,
          width: THICKNESS,
          height: box.height,
        }
      : {
          left: box.left,
          top: (reversed ? box.bottom : box.top) - half,
          width: box.width,
          height: THICKNESS,
        };
  }
  const before = index < items.length;
  const box = (
    before ? items[Math.max(0, index)] : items[items.length - 1]
  )!.getBoundingClientRect();
  // The line sits on the start edge of the item it precedes, or the end edge
  // of the last item; reversed flow swaps which physical side that is.
  const atStart = before !== reversed;
  return horizontal
    ? {
        left: (atStart ? box.left : box.right) - half,
        top: box.top,
        width: THICKNESS,
        height: box.height,
      }
    : {
        left: box.left,
        top: (atStart ? box.top : box.bottom) - half,
        width: box.width,
        height: THICKNESS,
      };
}

/** Shows the indicator at `index` in `context`, or hides it when `context` is null. */
export function placeIndicator(
  state: IndicatorState,
  context: Element | null,
  index: number,
  dragged: Element | null,
  overlay: boolean,
): void {
  if (!context) {
    removeIndicator(state);
    return;
  }
  if (!state.element || state.context !== context || state.overlay !== overlay) {
    removeIndicator(state);
    state.element = overlay ? createOverlay() : createInline(context);
    state.context = context;
    state.overlay = overlay;
  }
  if (overlay) {
    const rect = indicatorRect(context, index, dragged);
    Object.assign(state.element.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  } else {
    insertAtIndex(context, state.element, index, dragged ? [dragged] : []);
  }
}

export function removeIndicator(state: IndicatorState): void {
  state.element?.remove();
  state.element = null;
  state.context = null;
  state.overlay = false;
}

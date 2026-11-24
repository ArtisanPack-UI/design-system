/**
 * Pointer dragging (mouse, pen and touch) with a ghost, the drop indicator
 * and edge auto-scroll (D-057). A mouse or pen drag starts once the pointer
 * passes a small threshold; a touch drag after a press-and-hold, so swipes
 * still scroll.
 *
 * Hit-testing follows the list's flow: in an RTL (or `row-reverse`)
 * horizontal list the item before the pointer is the one to its right.
 */
import { dragSettings } from './config';
import {
  CONTEXT_SELECTOR,
  ITEM_SELECTOR,
  contextOptions,
  getItems,
  isFlowReversed,
  ownerContext,
} from './dom';
import {
  cancelDrag,
  currentSession,
  dropDrag,
  isEligible,
  startDrag,
  updateTarget,
  type DragSession,
} from './engine';
import { placeIndicator, removeIndicator } from './indicator';

const IGNORED_TARGETS =
  'input, textarea, select, option, [contenteditable=""], [contenteditable="true"], [data-drag-ignore]';

interface Pending {
  item: HTMLElement;
  pointerId: number;
  pointerType: string;
  x: number;
  y: number;
  timer: ReturnType<typeof setTimeout> | null;
}

let pending: Pending | null = null;
let suppressNextClick = false;

const raf = (callback: () => void) =>
  typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame(callback)
    : setTimeout(callback, 16);

/** The insertion index for a point among a context's items, not counting `dragged`. */
export function indexAtPoint(
  context: Element,
  x: number,
  y: number,
  dragged: Element | null,
): number {
  const horizontal = contextOptions(context).orientation === 'horizontal';
  const reversed = isFlowReversed(context);
  const items = getItems(context).filter((item) => item !== dragged);
  const index = items.findIndex((item) => {
    const rect = item.getBoundingClientRect();
    if (horizontal) {
      const center = rect.left + rect.width / 2;
      return reversed ? x > center : x < center;
    }
    const middle = rect.top + rect.height / 2;
    return reversed ? y > middle : y < middle;
  });
  return index === -1 ? items.length : index;
}

/** The nearest eligible context at or above an element. */
export function resolveTargetContext(
  element: Element | null,
  current: DragSession,
): HTMLElement | null {
  let context = element?.closest ? (element.closest(CONTEXT_SELECTOR) as HTMLElement | null) : null;
  while (context && !isEligible(context, current)) {
    context = context.parentElement
      ? (context.parentElement.closest(CONTEXT_SELECTOR) as HTMLElement | null)
      : null;
  }
  return context;
}

function createGhost(item: HTMLElement, x: number, y: number): NonNullable<DragSession['ghost']> {
  const rect = item.getBoundingClientRect();
  const ghost = item.cloneNode(true) as HTMLElement;
  [ghost, ...Array.from(ghost.querySelectorAll('*'))].forEach((el) => {
    Array.from(el.attributes).forEach(({ name }) => {
      if (
        name === 'id' ||
        name.startsWith('x-') ||
        name.startsWith('@') ||
        name.startsWith(':') ||
        name.startsWith('wire:')
      ) {
        el.removeAttribute(name);
      }
    });
  });
  ghost.setAttribute('aria-hidden', 'true');
  ghost.setAttribute('data-drag-ghost', '');
  ghost.removeAttribute('tabindex');
  ghost.removeAttribute('data-dragging');
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    boxSizing: 'border-box',
    pointerEvents: 'none',
    zIndex: '9999',
    opacity: '0.85',
    willChange: 'transform',
  });
  document.body.appendChild(ghost);
  return {
    element: ghost,
    offsetX: x - rect.left,
    offsetY: y - rect.top,
    left: rect.left,
    top: rect.top,
  };
}

function scrollableAxis(el: Element, axis: 'x' | 'y'): boolean {
  const style = window.getComputedStyle(el);
  const overflow = axis === 'x' ? style.overflowX : style.overflowY;
  const scrollSize =
    axis === 'x' ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
  return /(auto|scroll|overlay)/.test(overflow) && scrollSize > 0;
}

function edgeDelta(position: number, start: number, end: number): number {
  const { edge, speed } = dragSettings.autoScroll;
  if (position < start + edge)
    return -Math.ceil(speed * (1 - Math.max(0, position - start) / edge));
  if (position > end - edge) return Math.ceil(speed * (1 - Math.max(0, end - position) / edge));
  return 0;
}

/**
 * Scrolls the nearest scrollable ancestor of the point on each axis, then the
 * window, when the point is near an edge. Returns whether anything scrolled.
 */
export function autoScrollAt(x: number, y: number): boolean {
  let scrolled = false;
  const done = { x: false, y: false };
  let el: Element | null = document.elementFromPoint ? document.elementFromPoint(x, y) : null;

  while (el && el !== document.body && el !== document.documentElement && !(done.x && done.y)) {
    for (const axis of ['x', 'y'] as const) {
      if (done[axis] || !scrollableAxis(el, axis)) continue;
      const rect = el.getBoundingClientRect();
      const delta =
        axis === 'x' ? edgeDelta(x, rect.left, rect.right) : edgeDelta(y, rect.top, rect.bottom);
      done[axis] = true;
      if (delta) {
        const before = axis === 'x' ? el.scrollLeft : el.scrollTop;
        if (axis === 'x') el.scrollLeft += delta;
        else el.scrollTop += delta;
        scrolled = scrolled || (axis === 'x' ? el.scrollLeft : el.scrollTop) !== before;
      }
    }
    el = el.parentElement;
  }

  const page = document.scrollingElement || document.documentElement;
  const dx =
    done.x || page.scrollWidth <= window.innerWidth ? 0 : edgeDelta(x, 0, window.innerWidth);
  const dy =
    done.y || page.scrollHeight <= window.innerHeight ? 0 : edgeDelta(y, 0, window.innerHeight);
  if ((dx || dy) && typeof window.scrollBy === 'function') {
    const beforeX = window.scrollX;
    const beforeY = window.scrollY;
    window.scrollBy(dx, dy);
    scrolled = scrolled || window.scrollX !== beforeX || window.scrollY !== beforeY;
  }
  return scrolled;
}

function updatePointer(current: DragSession, x: number, y: number): void {
  current.point = { x, y };
  window.getSelection?.()?.removeAllRanges?.();
  if (current.ghost) {
    const { element, offsetX, offsetY, left, top } = current.ghost;
    element.style.transform = `translate(${x - offsetX - left}px, ${y - offsetY - top}px)`;
  }
  const element = document.elementFromPoint ? document.elementFromPoint(x, y) : null;
  const context = resolveTargetContext(element, current);
  updateTarget(context, context ? indexAtPoint(context, x, y, current.item) : null);
  document.body.style.cursor =
    current.target && !current.target.allowed ? 'not-allowed' : 'grabbing';
  const target = current.target;
  if (target && target.allowed) {
    placeIndicator(
      current.indicator,
      target.context,
      target.index,
      current.item,
      current.controlled,
    );
  } else {
    removeIndicator(current.indicator);
  }
}

function autoScrollLoop(current: DragSession): void {
  if (currentSession() !== current) return;
  if (current.point && autoScrollAt(current.point.x, current.point.y)) {
    updatePointer(current, current.point.x, current.point.y);
  }
  raf(() => autoScrollLoop(current));
}

function beginDrag(start: Pending, x: number, y: number): void {
  const current = startDrag(start.item, 'pointer');
  pending = null;
  if (!current) return;
  current.pointerId = start.pointerId;
  const previousUserSelect = document.body.style.userSelect;
  current.ghost = createGhost(start.item, start.x, start.y);
  document.body.style.userSelect = 'none';
  current.cleanup = () => {
    current.ghost?.element.remove();
    document.body.style.userSelect = previousUserSelect;
    document.body.style.cursor = '';
  };
  window.getSelection?.()?.removeAllRanges?.();
  updatePointer(current, x, y);
  raf(() => autoScrollLoop(current));
}

/** Whether an event comes from another pointer than the one that started the drag or press. */
const isOtherPointer = (event: PointerEvent, pointerId: number | undefined) =>
  pointerId !== undefined && event.pointerId !== pointerId;

function clearPending(): void {
  if (pending?.timer) clearTimeout(pending.timer);
  pending = null;
}

function onPointerDown(event: PointerEvent): void {
  if (currentSession() || (event.pointerType !== 'touch' && event.button !== 0)) return;
  const target = event.target as Element | null;
  const item = target?.closest ? (target.closest(ITEM_SELECTOR) as HTMLElement | null) : null;
  if (!item || !ownerContext(item) || target!.closest(IGNORED_TARGETS)) return;
  clearPending();
  pending = {
    item,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    x: event.clientX,
    y: event.clientY,
    timer: null,
  };
  if (event.pointerType === 'touch') {
    const start = pending;
    start.timer = setTimeout(() => {
      start.timer = null;
      if (pending === start) beginDrag(start, start.x, start.y);
    }, dragSettings.touchDelay);
  }
}

function onPointerMove(event: PointerEvent): void {
  const current = currentSession();
  if (current && current.mode === 'pointer') {
    if (!isOtherPointer(event, current.pointerId))
      updatePointer(current, event.clientX, event.clientY);
    return;
  }
  if (!pending || event.pointerId !== pending.pointerId) return;
  const distance = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
  if (distance < dragSettings.dragThreshold) return;
  if (pending.pointerType === 'touch') {
    if (pending.timer) clearPending();
    return;
  }
  beginDrag(pending, event.clientX, event.clientY);
}

function onPointerUp(event: PointerEvent): void {
  const current = currentSession();
  if (pending && !isOtherPointer(event, pending.pointerId)) clearPending();
  if (current && current.mode === 'pointer' && !isOtherPointer(event, current.pointerId)) {
    updatePointer(current, event.clientX, event.clientY);
    suppressNextClick = true;
    setTimeout(() => {
      suppressNextClick = false;
    }, 0);
    dropDrag();
  }
}

function onPointerCancel(event: PointerEvent): void {
  const current = currentSession();
  if (pending && !isOtherPointer(event, pending.pointerId)) clearPending();
  if (current && current.mode === 'pointer' && !isOtherPointer(event, current.pointerId))
    cancelDrag('pointercancel');
}

function onTouchMove(event: TouchEvent): void {
  const current = currentSession();
  if (
    (current && current.mode === 'pointer') ||
    (pending && pending.pointerType === 'touch' && !pending.timer)
  ) {
    event.preventDefault();
  }
}

function onClick(event: MouseEvent): void {
  if (suppressNextClick) {
    suppressNextClick = false;
    event.preventDefault();
    event.stopPropagation();
  }
}

function onDragStart(event: DragEvent): void {
  const target = event.target as Element | null;
  if (target?.closest && target.closest(ITEM_SELECTOR)) event.preventDefault();
}

function onSelectStart(event: Event): void {
  const current = currentSession();
  if (pending || (current && current.mode === 'pointer')) event.preventDefault();
}

function onContextMenu(event: MouseEvent): void {
  if (currentSession() || (pending && pending.pointerType === 'touch')) event.preventDefault();
}

export function installPointerListeners(): () => void {
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerCancel);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('click', onClick, true);
  document.addEventListener('dragstart', onDragStart);
  document.addEventListener('selectstart', onSelectStart);
  document.addEventListener('contextmenu', onContextMenu);
  return () => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerCancel);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('dragstart', onDragStart);
    document.removeEventListener('selectstart', onSelectStart);
    document.removeEventListener('contextmenu', onContextMenu);
  };
}

export function resetPointer(): void {
  clearPending();
  suppressNextClick = false;
}

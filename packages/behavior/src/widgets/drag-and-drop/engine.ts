/**
 * The drag session shared by pointer and keyboard input (D-057).
 *
 * A session runs `drag:start` → `drag:over`* → `drag:drop` (cancelable) →
 * `drag:end`, or ends with `drag:cancel`. Events fire on the contexts and
 * don't bubble. Committed moves are kept, so `revertDragMove()` can undo one
 * and fire `drag:revert`.
 *
 * Uncontrolled (Alpine and Livewire), the engine moves the item in the DOM:
 * live while a keyboard user moves it, and on drop for a pointer. Controlled
 * (React and Vue, `controlled: true` on a context), it never moves anything:
 * a keyboard move only changes where the session says the item is, the
 * indicator shows it, and `drag:drop`, `drag:end` and `drag:revert` carry
 * the move (`toContext`, `toIndex` and the resulting `fromOrderedIds` and
 * `toOrderedIds`) for the framework to render. Cancelling a controlled drag
 * restores nothing, because nothing moved.
 */
import { formatDragMessage } from './config';
import {
  CONTEXT_SELECTOR,
  announce,
  announceDescribed,
  announceFor,
  contextId,
  contextOptions,
  contextsInGroup,
  describe,
  describeAt,
  findContextById,
  findItemById,
  getItems,
  insertAtIndex,
  itemId,
  messagesFor,
  orderedIds,
  ownerContext,
  type DragAcceptDetail,
  type DragId,
} from './dom';
import { emptyIndicator, removeIndicator, type IndicatorState } from './indicator';

const MAX_RECORDED_MOVES = 100;

/** Why a drag was cancelled. */
export type DragCancelReason =
  'escape' | 'blur' | 'outside' | 'not-allowed' | 'rejected' | 'pointercancel' | 'removed';

/** Where a dragged item would land. */
export interface DragTarget {
  context: HTMLElement;
  index: number;
  allowed: boolean;
}

/** The drag in progress. */
export interface DragSession {
  moveId: string;
  mode: 'pointer' | 'keyboard';
  item: HTMLElement;
  itemId: DragId | null;
  fromContext: HTMLElement;
  fromIndex: number;
  group: string | null;
  /** Whether the framework owns the DOM for this drag. */
  controlled: boolean;
  /** The pointer's current target, or the keyboard's position in a controlled drag. */
  target: DragTarget | null;
  indicator: IndicatorState;
  pointerId?: number;
  point?: { x: number; y: number };
  ghost?: { element: HTMLElement; offsetX: number; offsetY: number; left: number; top: number };
  cleanup?: () => void;
}

interface RecordedMove {
  moveId: string;
  itemId: DragId | null;
  item: HTMLElement;
  fromContext: HTMLElement;
  fromContextId: DragId | null;
  fromIndex: number;
  toContext: HTMLElement;
  toIndex: number;
  controlled: boolean;
}

let session: DragSession | null = null;
let moveCounter = 0;
const moves = new Map<string, RecordedMove>();
let lastKeyboardDrop: { itemId: DragId | null; wireKey: string | null; at: number } | null = null;

/** The drag in progress, if any. */
export function currentSession(): DragSession | null {
  return session;
}

/** A JSON-safe event detail: elements and functions are not enumerable. */
function makeDetail<T extends object>(data: T, extras: Record<string, unknown> = {}): T {
  const detail = { ...data };
  for (const [key, value] of Object.entries(extras)) {
    Object.defineProperty(detail, key, {
      value,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
  return detail;
}

function dispatch(context: Element, name: string, detail: object, cancelable = false): CustomEvent {
  const event = new CustomEvent(name, { bubbles: false, cancelable, detail });
  context.dispatchEvent(event);
  return event;
}

function baseDetail(current: DragSession) {
  return {
    moveId: current.moveId,
    itemId: current.itemId,
    group: current.group,
    fromContext: contextId(current.fromContext),
    fromIndex: current.fromIndex,
  };
}

const baseElements = (current: DragSession) => ({
  itemElement: current.item,
  fromElement: current.fromContext,
});

/** Whether a context takes part in the drag at all: the same context, or one in the same group. */
export function isEligible(
  context: Element | null,
  current: DragSession | null = session,
): boolean {
  if (!current || !context || current.item.contains(context)) return false;
  if (context === current.fromContext) return true;
  return current.group !== null && contextOptions(context).group === current.group;
}

/** Whether an eligible context accepts the dragged item now. */
export function isAllowed(context: Element | null, current: DragSession | null = session): boolean {
  if (!current || !isEligible(context, current)) return false;
  const options = contextOptions(context!);
  if (options.disabled) return false;
  if (!options.accepts) return true;
  try {
    const detail = makeDetail<DragAcceptDetail>(
      { ...baseDetail(current), toContext: options.id },
      { ...baseElements(current), toElement: context },
    );
    return options.accepts(detail) !== false;
  } catch (error) {
    console.error('[drag-and-drop] accepts callback threw; refusing the drop.', error);
    return false;
  }
}

function markContexts(current: DragSession): void {
  document.querySelectorAll(CONTEXT_SELECTOR).forEach((context) => {
    if (!isEligible(context, current)) return;
    context.setAttribute(
      isAllowed(context, current) ? 'data-drag-active' : 'data-drag-disallowed',
      '',
    );
  });
}

function clearMarks(): void {
  document
    .querySelectorAll('[data-drag-active], [data-drag-disallowed], [data-drag-over]')
    .forEach((el) => {
      el.removeAttribute('data-drag-active');
      el.removeAttribute('data-drag-disallowed');
      el.removeAttribute('data-drag-over');
    });
}

/**
 * Whether a drag from `context` is controlled: the context is, or any
 * context it could move the item to is.
 */
function controlledFrom(context: HTMLElement, group: string | null): boolean {
  if (contextOptions(context).controlled) return true;
  return group !== null && contextsInGroup(group).some((other) => contextOptions(other).controlled);
}

/** Starts a drag. Returns null without a context, during another drag, or when `drag:start` is prevented. */
export function startDrag(item: HTMLElement, mode: 'pointer' | 'keyboard'): DragSession | null {
  const fromContext = ownerContext(item);
  if (session || !fromContext) return null;
  const group = contextOptions(fromContext).group;
  const fromIndex = getItems(fromContext).indexOf(item);
  const candidate: DragSession = {
    moveId: `move-${++moveCounter}`,
    mode,
    item,
    itemId: itemId(item),
    fromContext,
    fromIndex,
    group,
    controlled: controlledFrom(fromContext, group),
    target: null,
    indicator: emptyIndicator(),
  };

  const event = dispatch(
    fromContext,
    'drag:start',
    makeDetail(baseDetail(candidate), baseElements(candidate)),
    true,
  );
  if (event.defaultPrevented) return null;

  session = candidate;
  if (mode === 'keyboard' && candidate.controlled) {
    candidate.target = {
      context: fromContext,
      index: fromIndex,
      allowed: isAllowed(fromContext, candidate),
    };
  }
  item.setAttribute('data-dragging', '');
  document.body.setAttribute('data-drag-in-progress', mode);
  markContexts(session);
  return session;
}

/**
 * Records the drop target and fires `drag:over` when it changes. `index`
 * counts the target's items without the dragged one.
 */
export function updateTarget(context: HTMLElement | null, index: number | null): void {
  if (!session) return;
  const previous = session.target;
  if (previous && previous.context === context && previous.index === index) return;
  if (previous && previous.context !== context) previous.context.removeAttribute('data-drag-over');
  if (!context || index === null) {
    session.target = null;
    return;
  }
  const allowed = isAllowed(context);
  session.target = { context, index, allowed };
  context.setAttribute('data-drag-over', '');
  dispatch(
    context,
    'drag:over',
    makeDetail(
      { ...baseDetail(session), toContext: contextId(context), toIndex: index, allowed },
      { ...baseElements(session), toElement: context },
    ),
  );
}

/** Where the dragged item is now: its DOM place, or the controlled keyboard position. */
export function sessionPosition(current: DragSession): { context: HTMLElement; index: number } {
  if (current.controlled && current.mode === 'keyboard' && current.target) {
    return { context: current.target.context, index: current.target.index };
  }
  const context = ownerContext(current.item) ?? current.fromContext;
  return { context, index: getItems(context).indexOf(current.item) };
}

function restoreOrigin(current: DragSession): void {
  if (
    current.mode === 'keyboard' &&
    !current.controlled &&
    current.item.isConnected &&
    current.fromContext.isConnected
  ) {
    insertAtIndex(current.fromContext, current.item, current.fromIndex);
    current.item.focus();
  }
}

function finish(current: DragSession): void {
  current.cleanup?.();
  removeIndicator(current.indicator);
  current.item.removeAttribute('data-dragging');
  document.body.removeAttribute('data-drag-in-progress');
  clearMarks();
  if (session === current) session = null;
}

/**
 * Cancels the drag. An uncontrolled keyboard drag puts the item back where
 * it started; a controlled one never moved it.
 */
export function cancelDrag(reason: DragCancelReason, message: string | null = null): void {
  const current = session;
  if (!current) return;
  restoreOrigin(current);
  finish(current);

  if (current.fromContext.isConnected) {
    dispatch(
      current.fromContext,
      'drag:cancel',
      makeDetail({ ...baseDetail(current), reason }, baseElements(current)),
    );
  }
  if (reason === 'removed') return;
  if (message) announce(message, 'assertive');
  else
    announceDescribed(
      'cancelled',
      current.fromContext,
      describeAt(current.item, current.fromContext, current.fromIndex),
    );
}

function recordMove(move: RecordedMove): void {
  moves.set(move.moveId, move);
  while (moves.size > MAX_RECORDED_MOVES) moves.delete(moves.keys().next().value!);
}

/**
 * The ids of both contexts after moving `item` to `toIndex` in `to`,
 * computed without touching the DOM.
 */
export function plannedOrder(
  item: HTMLElement,
  from: HTMLElement,
  to: HTMLElement,
  toIndex: number,
): { fromOrderedIds: (DragId | null)[]; toOrderedIds: (DragId | null)[] } {
  const id = itemId(item);
  const fromItems = getItems(from).filter((other) => other !== item);
  const toItems = to === from ? fromItems : getItems(to).filter((other) => other !== item);
  const placed = [...toItems.map(itemId)];
  placed.splice(Math.min(Math.max(toIndex, 0), placed.length), 0, id);
  return {
    fromOrderedIds: to === from ? placed : fromItems.map(itemId),
    toOrderedIds: placed,
  };
}

/**
 * Focuses a controlled drag's item again once the framework has rendered the
 * move. Moving or re-creating a node drops focus to the body, and React and
 * Vue commit on their own schedule, so this checks for a few frames: it
 * focuses the item (found by id, as the element may be new) when focus is
 * lost, and stops as soon as focus lands anywhere else.
 */
function refocusAfterRender(id: DragId | null, previous: HTMLElement): void {
  const frame = (callback: () => void) =>
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame(callback)
      : setTimeout(callback, 16);
  let frames = 0;
  const check = () => {
    const active = document.activeElement;
    if (!active || active === document.body || !active.isConnected) {
      const item = findItemById(id);
      if (item) {
        item.focus();
        return;
      }
    } else if (active !== previous) {
      return;
    }
    if (++frames < 30) frame(check);
  };
  frame(check);
}

/**
 * Drops the item on the target: fires the cancelable `drag:drop` on both
 * contexts, moves the item when uncontrolled, then fires `drag:end`.
 * Returns whether the move was committed.
 */
export function dropDrag(): boolean {
  const current = session;
  if (!current) return false;
  if (!current.item.isConnected) {
    cancelDrag('removed');
    return false;
  }
  const { item, fromContext } = current;
  let target: DragTarget | null = current.target;
  if (current.mode === 'keyboard' && !current.controlled) {
    const context = ownerContext(item)!;
    target = { context, index: getItems(context).indexOf(item), allowed: isAllowed(context) };
  }
  if (!target) {
    cancelDrag('outside');
    return false;
  }
  const toContext = target.context;
  if (!target.allowed) {
    cancelDrag(
      'not-allowed',
      formatDragMessage(
        messagesFor(toContext).rejected,
        describe(item, toContext) as unknown as Record<string, unknown>,
      ),
    );
    return false;
  }

  const planned = plannedOrder(item, fromContext, toContext, target.index);
  let rejectMessage: string | null = null;
  const dropEvents: CustomEvent[] = [];
  const dropDetail = makeDetail(
    { ...baseDetail(current), toContext: contextId(toContext), toIndex: target.index, ...planned },
    {
      ...baseElements(current),
      toElement: toContext,
      reject(message?: string) {
        rejectMessage = message ?? rejectMessage;
        dropEvents.forEach((event) => event.preventDefault());
      },
    },
  ) as ReturnType<typeof baseDetail> & { message?: string };
  [toContext, fromContext]
    .filter((context, index, list) => list.indexOf(context) === index)
    .forEach((context) => {
      const event = new CustomEvent('drag:drop', {
        bubbles: false,
        cancelable: true,
        detail: dropDetail,
      });
      dropEvents.push(event);
      context.dispatchEvent(event);
    });

  if (dropEvents.some((event) => event.defaultPrevented)) {
    const message =
      rejectMessage ??
      dropDetail.message ??
      formatDragMessage(
        messagesFor(toContext).rejected,
        describe(item, toContext) as unknown as Record<string, unknown>,
      );
    cancelDrag('rejected', message);
    return false;
  }

  if (current.mode === 'pointer' && !current.controlled)
    insertAtIndex(toContext, item, target.index);
  finish(current);

  const toIndex = current.controlled ? target.index : getItems(toContext).indexOf(item);
  recordMove({
    moveId: current.moveId,
    itemId: current.itemId,
    item,
    fromContext,
    fromContextId: contextId(fromContext),
    fromIndex: current.fromIndex,
    toContext,
    toIndex,
    controlled: current.controlled,
  });
  if (current.mode === 'keyboard') {
    lastKeyboardDrop = {
      itemId: current.itemId,
      wireKey: item.getAttribute('wire:key'),
      at: Date.now(),
    };
    if (current.controlled) refocusAfterRender(current.itemId, item);
  }

  dispatchEnd(
    'drag:end',
    { ...baseDetail(current), toContext: contextId(toContext), toIndex },
    item,
    fromContext,
    toContext,
    current.controlled ? planned : null,
  );

  if (current.controlled)
    announceDescribed('dropped', toContext, describeAt(item, toContext, toIndex));
  else announceFor('dropped', item, toContext);
  return true;
}

function dispatchEnd(
  name: string,
  data: object,
  item: HTMLElement,
  fromContext: HTMLElement,
  toContext: HTMLElement,
  planned: { fromOrderedIds: (DragId | null)[]; toOrderedIds: (DragId | null)[] } | null,
): void {
  const fromOrderedIds = planned ? planned.fromOrderedIds : orderedIds(fromContext);
  const toOrderedIds = planned
    ? planned.toOrderedIds
    : toContext === fromContext
      ? fromOrderedIds
      : orderedIds(toContext);
  const elements = { itemElement: item, fromElement: fromContext, toElement: toContext };

  dispatch(
    toContext,
    name,
    makeDetail({ ...data, orderedIds: toOrderedIds, fromOrderedIds, toOrderedIds }, elements),
  );
  if (toContext !== fromContext) {
    dispatch(
      fromContext,
      name,
      makeDetail({ ...data, orderedIds: fromOrderedIds, fromOrderedIds, toOrderedIds }, elements),
    );
  }
}

/**
 * Undoes a committed move and announces it. Later recorded moves of the same
 * item are dropped. Fires `drag:revert` on both contexts (`fromContext` and
 * `toContext` describe the original move). Controlled, the item isn't moved:
 * `fromOrderedIds` and `toOrderedIds` carry the order to render.
 */
export function revertDragMove(moveId: string): boolean {
  const move = moves.get(moveId);
  if (!move) return false;
  if (session && session.item === move.item) cancelDrag('removed');
  const item = move.item.isConnected ? move.item : findItemById(move.itemId);
  const fromContext = move.fromContext.isConnected
    ? move.fromContext
    : findContextById(move.fromContextId);
  if (!item || !fromContext) {
    moves.delete(moveId);
    return false;
  }
  const currentContext = ownerContext(item) ?? move.toContext;
  const hadFocus = document.activeElement === item;

  let discard = false;
  for (const entry of Array.from(moves.values())) {
    discard = discard || entry === move;
    if (discard && String(entry.itemId) === String(move.itemId)) moves.delete(entry.moveId);
  }

  const controlled = move.controlled || contextOptions(fromContext).controlled;
  let planned: ReturnType<typeof plannedOrder> | null = null;
  if (controlled) {
    // `plannedOrder` reads the item's current place from the DOM; swap the
    // roles so "from" is where it is now and "to" is where it goes back to.
    const back = plannedOrder(item, currentContext, fromContext, move.fromIndex);
    planned = { fromOrderedIds: back.toOrderedIds, toOrderedIds: back.fromOrderedIds };
    if (hadFocus) refocusAfterRender(move.itemId, item);
  } else {
    insertAtIndex(fromContext, item, move.fromIndex);
    if (hadFocus) item.focus();
  }

  dispatchEnd(
    'drag:revert',
    {
      moveId: move.moveId,
      itemId: move.itemId,
      group: contextOptions(fromContext).group,
      fromContext: contextId(fromContext),
      fromIndex: move.fromIndex,
      toContext: contextId(currentContext),
      toIndex: move.toIndex,
    },
    item,
    fromContext,
    currentContext,
    planned,
  );

  if (controlled)
    announceDescribed(
      'reverted',
      fromContext,
      describeAt(item, fromContext, move.fromIndex),
      'assertive',
    );
  else announceFor('reverted', item, fromContext, 'assertive');
  return true;
}

/** Undoes the most recent recorded move of an item. */
export function revertDragItem(id: DragId): boolean {
  const latest = Array.from(moves.values())
    .reverse()
    .find((move) => String(move.itemId) === String(id));
  return latest ? revertDragMove(latest.moveId) : false;
}

/** The last keyboard drop, so the Livewire adapter can restore focus after a morph. */
export function takeLastKeyboardDrop(): typeof lastKeyboardDrop {
  return lastKeyboardDrop;
}

export function resetEngine(): void {
  if (session) finish(session);
  session = null;
  moves.clear();
  lastKeyboardDrop = null;
}

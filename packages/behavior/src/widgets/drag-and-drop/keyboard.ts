/**
 * Keyboard dragging (D-057): pick up, move within a context, move between a
 * group's contexts, drop and cancel. An uncontrolled drag moves the item in
 * the DOM as it goes; a controlled one moves only the session's position and
 * the indicator, and the item stays put (and focused) until the framework
 * renders the drop.
 *
 * The bindings follow what's on screen: a horizontal list swaps the
 * within-list and between-container keys, and right-to-left text swaps the
 * meaning of the left and right arrows, so ArrowRight always moves toward
 * the right.
 */
import { dragSettings, type DragKeyAction } from './config';
import {
  ITEM_SELECTOR,
  announce,
  announceDescribed,
  announceFor,
  contextOptions,
  contextsInGroup,
  describeAt,
  getItems,
  insertAtIndex,
  isFlowReversed,
  isRtl,
  messagesFor,
  ownerContext,
} from './dom';
import {
  cancelDrag,
  currentSession,
  dropDrag,
  isAllowed,
  isEligible,
  sessionPosition,
  startDrag,
  updateTarget,
  type DragSession,
} from './engine';
import { placeIndicator } from './indicator';

const AXIS_SWAP: Partial<Record<DragKeyAction, DragKeyAction>> = {
  previous: 'previousContainer',
  next: 'nextContainer',
  previousContainer: 'previous',
  nextContainer: 'next',
};

const RTL_SWAP: Partial<Record<DragKeyAction, DragKeyAction>> = {
  previousContainer: 'nextContainer',
  nextContainer: 'previousContainer',
};

/**
 * Maps a key to an action. The left and right arrows are bound as
 * `previousContainer` and `nextContainer`; RTL swaps those two, then a
 * horizontal list swaps the within-list and between-container actions.
 */
export function resolveAction(key: string, horizontal: boolean, rtl = false): DragKeyAction | null {
  let action =
    (Object.keys(dragSettings.keys) as DragKeyAction[]).find((name) =>
      dragSettings.keys[name].includes(key),
    ) ?? null;
  if (action && rtl && RTL_SWAP[action]) action = RTL_SWAP[action]!;
  if (action && horizontal && AXIS_SWAP[action]) action = AXIS_SWAP[action]!;
  return action;
}

/** Puts the item at `index` in `context`: in the DOM, or in a controlled drag's position. */
function moveTo(current: DragSession, context: HTMLElement, index: number): void {
  if (current.controlled) {
    updateTarget(context, index);
    placeIndicator(current.indicator, context, index, current.item, true);
  } else {
    insertAtIndex(context, current.item, index);
    current.item.focus();
    updateTarget(context, index);
  }
}

function announceMove(
  current: DragSession,
  key: 'moved' | 'movedToContainer',
  context: HTMLElement,
  index: number,
): void {
  if (current.controlled) announceDescribed(key, context, describeAt(current.item, context, index));
  else announceFor(key, current.item, context);
}

function moveWithin(current: DragSession, action: 'previous' | 'next' | 'first' | 'last'): void {
  const { context, index } = sessionPosition(current);
  const last = getItems(context).filter((item) => item !== current.item).length;
  const targets = { previous: index - 1, next: index + 1, first: 0, last };
  const targetIndex = Math.min(Math.max(targets[action], 0), last);
  if (targetIndex === index) return;
  moveTo(current, context, targetIndex);
  announceMove(current, 'moved', context, targetIndex);
}

function moveAcross(current: DragSession, action: 'previousContainer' | 'nextContainer'): void {
  const { context, index } = sessionPosition(current);
  const contexts =
    current.group === null
      ? []
      : contextsInGroup(current.group).filter((candidate) => isEligible(candidate, current));
  if (contexts.length < 2) {
    moveWithin(current, action === 'previousContainer' ? 'previous' : 'next');
    return;
  }
  const step = action === 'previousContainer' ? -1 : 1;
  let next = contexts.indexOf(context) + step;
  while (next >= 0 && next < contexts.length && !isAllowed(contexts[next]!, current)) next += step;
  if (next < 0 || next >= contexts.length) {
    announce(messagesFor(context).noContainer);
    return;
  }
  const target = contexts[next]!;
  const position = Math.min(index, getItems(target).filter((item) => item !== current.item).length);
  moveTo(current, target, position);
  announceMove(current, 'movedToContainer', target, position);
}

function onKeyDown(event: KeyboardEvent): void {
  const current = currentSession();
  const eventTarget = event.target as Element | null;
  const item = eventTarget?.closest
    ? (eventTarget.closest(ITEM_SELECTOR) as HTMLElement | null)
    : null;

  if (current && current.mode === 'pointer') {
    if (resolveAction(event.key, false) === 'cancel') {
      event.preventDefault();
      cancelDrag('escape');
    }
    return;
  }
  if (!item || eventTarget !== item) return;
  const position = current && current.item === item ? sessionPosition(current) : null;
  const context = position ? position.context : ownerContext(item);
  if (!context) return;
  // A horizontal list follows its flow (RTL or `row-reverse`), as pointer
  // hit-testing does; between vertical lists, the left and right arrows
  // follow the text direction.
  const horizontal = contextOptions(context).orientation === 'horizontal';
  const action = resolveAction(
    event.key,
    horizontal,
    horizontal ? isFlowReversed(context) : isRtl(context),
  );

  if (!current || current.item !== item) {
    if (action === 'grab' && !current) {
      event.preventDefault();
      if (startDrag(item, 'keyboard')) announceFor('grabbed', item, context, 'assertive');
    }
    return;
  }

  switch (action) {
    case 'grab':
      event.preventDefault();
      dropDrag();
      break;
    case 'cancel':
      event.preventDefault();
      cancelDrag('escape');
      break;
    case 'previous':
    case 'next':
    case 'first':
    case 'last':
      event.preventDefault();
      moveWithin(current, action);
      break;
    case 'previousContainer':
    case 'nextContainer':
      event.preventDefault();
      moveAcross(current, action);
      break;
    default:
      break;
  }
}

/**
 * Cancels a keyboard drag when focus moves to another element. Moving the
 * held item in the DOM blurs it with no `relatedTarget`; that's ignored.
 */
function onFocusOut(event: FocusEvent): void {
  const current = currentSession();
  if (
    current &&
    current.mode === 'keyboard' &&
    event.target === current.item &&
    event.relatedTarget &&
    event.relatedTarget !== current.item
  ) {
    cancelDrag('blur');
  }
}

export function installKeyboardListeners(): () => void {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusout', onFocusOut);
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('focusout', onFocusOut);
  };
}

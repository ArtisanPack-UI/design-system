/**
 * Drag and drop (D-057): the engine Livewire Drag and Drop, React and Vue
 * share, so all three drag, reorder and announce moves the same way.
 *
 * Plain DOM: one set of delegated document listeners handles pointer, touch
 * and keyboard input for every context on the page. An adapter registers
 * each context (with its options) and each item (with its id) and listens to
 * the context's events:
 *
 *   const off = registerDragContext(list, { id: 'todo', group: 'board', controlled: true });
 *   const offItem = registerDragItem(card, 42);
 *   list.addEventListener('drag:drop', (event) => apply(event.detail));
 *
 * Events (`CustomEvent`, on the contexts, not bubbling): `drag:start`
 * (cancelable), `drag:over`, `drag:drop` (cancelable; `detail.reject(message)`
 * refuses with an announcement), `drag:end`, `drag:cancel` and `drag:revert`.
 * Details are JSON-safe; the elements ride along as non-enumerable
 * `itemElement`, `fromElement` and `toElement`.
 *
 * `controlled: true` (React and Vue) means the engine never moves a node:
 * `drag:drop` and `drag:end` say where the item goes (`toContext`,
 * `toIndex`, `fromOrderedIds`, `toOrderedIds`) and the framework re-renders.
 */
import { resetDragAndDropConfig as resetConfig } from './config';
import {
  decorateContext,
  decorateItem,
  rehydrate,
  resetDom,
  setContextSource,
  setItemId,
  unregisterContext,
} from './dom';
import type { DragContextOptions, DragId } from './dom';
import { cancelDrag, currentSession, resetEngine, type DragCancelReason } from './engine';
import { installKeyboardListeners } from './keyboard';
import { installPointerListeners, resetPointer } from './pointer';

export {
  DRAG_KEYS,
  DRAG_MESSAGES,
  configureDragAndDrop,
  dragSettings,
  formatDragMessage,
  resetDragAndDropConfig,
  type DragAndDropConfig,
  type DragAndDropSettings,
  type DragKeyAction,
  type DragMessageKey,
  type DragMessages,
} from './config';
export {
  CONTEXT_SELECTOR as DRAG_CONTEXT_SELECTOR,
  ITEM_SELECTOR as DRAG_ITEM_SELECTOR,
  INSTRUCTIONS_PREFIX as DRAG_INSTRUCTIONS_PREFIX,
  announce as announceDrag,
  contextOptions as dragContextOptions,
  findItemById as findDragItem,
  instructionsId as dragInstructionsId,
  itemId as dragItemId,
  messagesFor as dragMessagesFor,
  type DragAcceptDetail,
  type DragContextOptions,
  type DragDescription,
  type DragId,
  type ResolvedDragContextOptions,
} from './dom';
export {
  cancelDrag,
  currentSession as currentDrag,
  plannedOrder as plannedDragOrder,
  revertDragItem,
  revertDragMove,
  takeLastKeyboardDrop,
  type DragCancelReason,
  type DragSession,
  type DragTarget,
} from './engine';
export { applyDragMove, type DragMove } from './apply';
export { indicatorRect as dragIndicatorRect } from './indicator';
export { autoScrollAt, indexAtPoint as dragIndexAtPoint } from './pointer';
export { resolveAction as resolveDragKey } from './keyboard';

/** The detail every drag event carries. */
export interface DragEventDetail {
  moveId: string;
  itemId: DragId | null;
  group: string | null;
  fromContext: DragId | null;
  fromIndex: number;
  readonly itemElement?: HTMLElement;
  readonly fromElement?: HTMLElement;
  readonly toElement?: HTMLElement;
}

/** `drag:over`: where the item would land. */
export interface DragOverDetail extends DragEventDetail {
  toContext: DragId | null;
  toIndex: number;
  allowed: boolean;
}

/** `drag:drop`: the move about to be committed, and the order it leads to. */
export interface DragDropDetail extends DragEventDetail {
  toContext: DragId | null;
  toIndex: number;
  fromOrderedIds: (DragId | null)[];
  toOrderedIds: (DragId | null)[];
  /** Refuses the drop; the message is announced instead of the default. */
  readonly reject?: (message?: string) => void;
  /** An announcement to use when the drop is refused with `preventDefault()`. */
  message?: string;
}

/** `drag:end` and `drag:revert`: the committed move and the resulting order. */
export interface DragEndDetail extends DragEventDetail {
  toContext: DragId | null;
  toIndex: number;
  /** This context's order. */
  orderedIds: (DragId | null)[];
  fromOrderedIds: (DragId | null)[];
  toOrderedIds: (DragId | null)[];
}

/** `drag:cancel`. */
export interface DragCancelDetail extends DragEventDetail {
  reason: DragCancelReason;
}

/** The drag events and their details. */
export interface DragEventMap {
  'drag:start': DragEventDetail;
  'drag:over': DragOverDetail;
  'drag:drop': DragDropDetail;
  'drag:end': DragEndDetail;
  'drag:cancel': DragCancelDetail;
  'drag:revert': DragEndDetail;
}

let uninstall: (() => void) | null = null;

/** Installs the document listeners once. Registering a context or item does it for you. */
export function installDragAndDrop(): void {
  if (uninstall || typeof document === 'undefined') return;
  const offPointer = installPointerListeners();
  const offKeyboard = installKeyboardListeners();
  uninstall = () => {
    offPointer();
    offKeyboard();
  };
}

/**
 * Makes an element a drag context. `options` can be a getter, read on every
 * use, so it can follow reactive state. Returns the function that undoes it.
 */
export function registerDragContext(
  context: HTMLElement,
  options: DragContextOptions | (() => DragContextOptions) = {},
): () => void {
  installDragAndDrop();
  setContextSource(context, options);
  decorateContext(context);
  return () => {
    setContextSource(context, null);
    unregisterContext(context);
  };
}

/** Options for the function {@link registerDragItem} returns. */
export interface DragItemCleanupOptions {
  /**
   * The item is about to be removed: cancel a drag of it now, while it's
   * still in the page. React and Vue pass it from their unmount hooks, which
   * run before the node is removed.
   */
  removing?: boolean;
}

/**
 * Makes an element a drag item with an id. Returns the function that undoes
 * it. Undoing it cancels a drag of the item when the item is already
 * detached (Alpine's cleanup runs after removal) or `removing` is set, and
 * removes the `data-drag-item` marker if registering added it.
 */
export function registerDragItem(
  item: HTMLElement,
  id: DragId | null,
): (options?: DragItemCleanupOptions) => void {
  installDragAndDrop();
  setItemId(item, id);
  const addedMarker = !item.hasAttribute('data-drag-item') && !item.hasAttribute('x-drag-item');
  if (addedMarker) item.setAttribute('data-drag-item', '');
  decorateItem(item);
  return (options = {}) => {
    const current = currentSession();
    if (current && current.item === item && (options.removing || !item.isConnected)) {
      cancelDrag('removed');
    }
    setItemId(item, undefined);
    if (addedMarker) item.removeAttribute('data-drag-item');
  };
}

/** Re-applies context and item decoration in a subtree, e.g. after a Livewire morph. */
export function rehydrateDragAndDrop(root: Element | null | undefined): void {
  rehydrate(root);
}

/**
 * Removes the listeners and forgets every session, move and setting. For
 * tests; pages never need it.
 */
export function resetDragAndDrop(): void {
  resetEngine();
  resetPointer();
  resetDom();
  resetConfig();
  uninstall?.();
  uninstall = null;
}

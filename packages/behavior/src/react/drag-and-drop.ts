/**
 * Drag and drop for the React adapter (D-057), on the engine Livewire Drag
 * and Drop runs, so pointer, touch and keyboard moves and their
 * announcements match in every stack. Contexts are controlled: the engine
 * never moves a node, it reports the move and React renders it.
 *
 *   const [lists, setLists] = useState({ todo, done });
 *   const todoList = useDragContext({
 *     id: 'todo', group: 'board', label: 'To do',
 *     // drag:end fires on both lists of a move; apply it once, in the target.
 *     onDragEnd: (detail) => {
 *       if (detail.toContext === 'todo') setLists((current) => applyDragMove(current, detail));
 *     },
 *   });
 *   const item = useDragItems();
 *   <ul {...todoList}>
 *     {lists.todo.map((task) => <li key={task.id} {...item(task.id, { label: task.title })}>{task.title}</li>)}
 *   </ul>
 *
 * Apply moves in `onDragEnd`, which fires only once a drop is committed;
 * `onDrop` (`drag:drop`) is where a drop can still be refused.
 *
 * The props carry the same data attributes the Alpine directives put on the
 * page (`data-drag-context`, `data-drag-item`, `data-drag-id`, …), a role and
 * a tab stop; the engine adds `aria-describedby` (the instructions) once the
 * element mounts.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, type RefCallback } from 'react';

import {
  registerDragContext,
  registerDragItem,
  type DragCancelDetail,
  type DragContextOptions,
  type DragDropDetail,
  type DragEndDetail,
  type DragEventDetail,
  type DragId,
  type DragOverDetail,
} from '../widgets/drag-and-drop';

/** Options for {@link useDragContext}. */
export interface UseDragContextOptions extends DragContextOptions {
  /** `drag:start`; call `event.preventDefault()` to refuse the drag. */
  onDragStart?: (detail: DragEventDetail, event: CustomEvent<DragEventDetail>) => void;
  /** `drag:over`: the item is over this context. */
  onDragOver?: (detail: DragOverDetail, event: CustomEvent<DragOverDetail>) => void;
  /** `drag:drop`: the move is about to happen; refuse it with `detail.reject(message)`. */
  onDrop?: (detail: DragDropDetail, event: CustomEvent<DragDropDetail>) => void;
  /** `drag:end`: the move is committed; render it here (`applyDragMove`). */
  onDragEnd?: (detail: DragEndDetail, event: CustomEvent<DragEndDetail>) => void;
  /** `drag:cancel`. */
  onDragCancel?: (detail: DragCancelDetail, event: CustomEvent<DragCancelDetail>) => void;
  /** `drag:revert`: undo a move (`applyDragMove` works here too). */
  onDragRevert?: (detail: DragEndDetail, event: CustomEvent<DragEndDetail>) => void;
}

/** The props {@link useDragContext} returns; spread them on the list. */
export interface DragContextProps<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  role: 'group';
  'aria-label'?: string;
  'data-drag-context': '';
  'data-drag-controlled'?: '';
  'data-drag-context-id'?: string;
  'data-drag-group'?: string;
  'data-drag-orientation'?: 'vertical' | 'horizontal';
  'data-drag-disabled'?: '';
}

/** Options for an item. */
export interface DragItemOptions {
  /** The item's name in announcements. */
  label?: string;
}

/** The props {@link useDragItem} returns; spread them on the item. */
export interface DragItemProps<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  role: 'button';
  tabIndex: 0;
  'data-drag-item': '';
  'data-drag-id': string;
  'data-drag-label'?: string;
}

/** useLayoutEffect in the browser; useEffect on the server, where React 18 warns about layout effects. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type DragItemCleanup = ReturnType<typeof registerDragItem>;

const EVENTS = [
  ['drag:start', 'onDragStart'],
  ['drag:over', 'onDragOver'],
  ['drag:drop', 'onDrop'],
  ['drag:end', 'onDragEnd'],
  ['drag:cancel', 'onDragCancel'],
  ['drag:revert', 'onDragRevert'],
] as const;

/** The engine options in `options`, without the handlers; controlled unless told otherwise. */
function engineOptions(options: UseDragContextOptions): DragContextOptions {
  return {
    id: options.id,
    group: options.group,
    label: options.label,
    disabled: options.disabled,
    accepts: options.accepts,
    messages: options.messages,
    orientation: options.orientation,
    controlled: options.controlled ?? true,
  };
}

/**
 * Makes an element a drag context. Options are read on every use, so they
 * can change between renders; the handlers always see the latest props.
 */
export function useDragContext<T extends HTMLElement = HTMLElement>(
  options: UseDragContextOptions = {},
): DragContextProps<T> {
  const latest = useRef(options);
  // Committed options only: a render React discards never reaches the listeners.
  useIsomorphicLayoutEffect(() => {
    latest.current = options;
  });
  const element = useRef<T | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  const detach = () => {
    cleanup.current?.();
    cleanup.current = null;
  };
  const attach = (target: T) => {
    const unregister = registerDragContext(target, () => engineOptions(latest.current));
    const listeners = EVENTS.map(([name, handler]) => {
      const listener = (event: Event) => {
        const callback = latest.current[handler] as
          ((detail: unknown, event: CustomEvent) => void) | undefined;
        callback?.((event as CustomEvent).detail, event as CustomEvent);
      };
      target.addEventListener(name, listener);
      return () => target.removeEventListener(name, listener);
    });
    cleanup.current = () => {
      listeners.forEach((off) => off());
      unregister();
    };
  };

  const ref = useCallback((next: T | null) => {
    detach();
    element.current = next;
    if (next) attach(next);
  }, []);

  // Strict Mode replays this effect without calling the ref again, so the
  // setup re-registers the element its cleanup let go.
  useEffect(() => {
    if (element.current && !cleanup.current) attach(element.current);
    return detach;
  }, []);

  const controlled = options.controlled ?? true;
  return {
    ref,
    role: 'group',
    ...(options.label ? { 'aria-label': options.label } : {}),
    'data-drag-context': '',
    ...(controlled ? { 'data-drag-controlled': '' as const } : {}),
    ...(options.id !== undefined && options.id !== null
      ? { 'data-drag-context-id': String(options.id) }
      : {}),
    ...(options.group ? { 'data-drag-group': options.group } : {}),
    ...(options.orientation ? { 'data-drag-orientation': options.orientation } : {}),
    ...(options.disabled ? { 'data-drag-disabled': '' as const } : {}),
  };
}

function itemProps<T extends HTMLElement>(
  ref: RefCallback<T>,
  id: DragId,
  options: DragItemOptions,
): DragItemProps<T> {
  return {
    ref,
    role: 'button',
    tabIndex: 0,
    'data-drag-item': '',
    'data-drag-id': String(id),
    ...(options.label ? { 'data-drag-label': options.label } : {}),
  };
}

/** Makes an element a drag item, for a component per item. */
export function useDragItem<T extends HTMLElement = HTMLElement>(
  id: DragId,
  options: DragItemOptions = {},
): DragItemProps<T> {
  const idRef = useRef(id);
  useIsomorphicLayoutEffect(() => {
    idRef.current = id;
  });
  const element = useRef<T | null>(null);
  const cleanup = useRef<DragItemCleanup | null>(null);

  const ref = useCallback((next: T | null) => {
    cleanup.current?.({ removing: true });
    cleanup.current = null;
    element.current = next;
    if (next) cleanup.current = registerDragItem(next, idRef.current);
  }, []);

  // Re-registers when the id changes, and after Strict Mode's replay.
  useEffect(() => {
    if (!element.current) return;
    cleanup.current?.();
    cleanup.current = registerDragItem(element.current, id);
  }, [id]);

  useEffect(
    () => () => {
      cleanup.current?.({ removing: true });
      cleanup.current = null;
    },
    [],
  );

  return itemProps(ref, id, options);
}

interface ItemEntry<T extends HTMLElement> {
  id: DragId;
  ref: RefCallback<T>;
  element: T | null;
  cleanup: DragItemCleanup | null;
}

/**
 * Item props for a list rendered with `map()`: `item(id, options)` returns
 * the props for one item, with a ref that stays the same for that id across
 * renders, so React doesn't re-register items on every render.
 */
export function useDragItems<T extends HTMLElement = HTMLElement>(): (
  id: DragId,
  options?: DragItemOptions,
) => DragItemProps<T> {
  const entries = useRef(new Map<string, ItemEntry<T>>());

  // Strict Mode replays this effect without calling the refs again: the
  // cleanup lets the items go and the setup registers them again.
  useEffect(() => {
    const map = entries.current;
    map.forEach((entry) => {
      if (entry.element && !entry.cleanup)
        entry.cleanup = registerDragItem(entry.element, entry.id);
    });
    return () => {
      map.forEach((entry) => {
        entry.cleanup?.({ removing: true });
        entry.cleanup = null;
      });
    };
  }, []);

  return useCallback((id: DragId, options: DragItemOptions = {}) => {
    const key = String(id);
    let entry = entries.current.get(key);
    if (!entry) {
      const created: ItemEntry<T> = {
        id,
        element: null,
        cleanup: null,
        ref: (element: T | null) => {
          created.cleanup?.({ removing: true });
          created.cleanup = null;
          created.element = element;
          if (element) created.cleanup = registerDragItem(element, id);
          else entries.current.delete(key);
        },
      };
      entry = created;
      entries.current.set(key, entry);
    }
    return itemProps(entry.ref, id, options);
  }, []);
}

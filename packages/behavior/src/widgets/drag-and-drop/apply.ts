/**
 * `applyDragMove`: turns a controlled drop (or revert) into new arrays for a
 * framework's state, so React and Vue lists don't rebuild order by hand.
 *
 *   const [lists, setLists] = useState({ todo: [...], done: [...] });
 *   onDragEnd: (detail) => setLists((current) => applyDragMove(current, detail));
 *
 * Lists are keyed by context id. Items are matched by `key` (a property name
 * or a function), compared as strings, as the engine compares ids.
 */
import type { DragId } from './dom';

/** What `applyDragMove` reads from a `drag:drop`, `drag:end` or `drag:revert` detail. */
export interface DragMove {
  fromContext: DragId | null;
  toContext: DragId | null;
  fromOrderedIds: (DragId | null)[];
  toOrderedIds: (DragId | null)[];
}

/**
 * The lists after the move: the source and target lists reordered to match
 * the detail's `fromOrderedIds` and `toOrderedIds`, every other list as it
 * was. Returns `lists` itself when a context id isn't among its keys.
 */
export function applyDragMove<T>(
  lists: Record<string, T[]>,
  move: DragMove,
  key: keyof T | ((item: T) => DragId | null | undefined) = 'id' as keyof T,
): Record<string, T[]> {
  const from = move.fromContext === null ? null : String(move.fromContext);
  const to = move.toContext === null ? null : String(move.toContext);
  // Own keys only, so an id like `constructor` never reaches Object.prototype.
  const has = (id: string) =>
    Object.prototype.hasOwnProperty.call(lists, id) && Array.isArray(lists[id]);
  if (from === null || to === null || !has(from) || !has(to)) return lists;

  const idOf = (item: T): string =>
    String(typeof key === 'function' ? key(item) : (item as Record<keyof T, unknown>)[key]);
  const byId = new Map<string, T>();
  for (const item of [...lists[from]!, ...lists[to]!]) byId.set(idOf(item), item);
  const pick = (ids: (DragId | null)[]) =>
    ids.map((id) => byId.get(String(id))).filter((item): item is T => item !== undefined);

  return { ...lists, [from]: pick(move.fromOrderedIds), [to]: pick(move.toOrderedIds) };
}

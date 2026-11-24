/**
 * The board the React and Vue drag fixtures render: two lists in one group,
 * so tests can reorder within a list and move between them.
 */
export interface Card {
  id: number;
  title: string;
}

export const BOARD: Record<string, Card[]> = {
  todo: [
    { id: 1, title: 'Write' },
    { id: 2, title: 'Review' },
    { id: 3, title: 'Ship' },
  ],
  done: [{ id: 4, title: 'Plan' }],
};

export const LABELS: Record<string, string> = { todo: 'To do', done: 'Done' };

/** What the fixtures record for the tests. */
export interface DragLog {
  drops: unknown[];
  ends: unknown[];
  reverts: unknown[];
  renders: number;
}

export function dragLog(): DragLog {
  const w = window as unknown as { dragLog?: DragLog };
  w.dragLog ??= { drops: [], ends: [], reverts: [], renders: 0 };
  return w.dragLog;
}

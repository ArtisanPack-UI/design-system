/**
 * A two-list board on the React drag adapter, for drag-and-drop.frameworks.test.ts.
 * State is the source of truth: drops and reverts go through applyDragMove.
 */
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { applyDragMove, revertDragItem, useDragContext, useDragItems } from '../../src/react';
import { BOARD, LABELS, dragLog, type Card } from './drag-shared';

function List({
  id,
  cards,
  onMove,
}: {
  id: string;
  cards: Card[];
  onMove: (detail: Parameters<typeof applyDragMove>[1]) => void;
}) {
  const list = useDragContext<HTMLUListElement>({
    id,
    group: 'board',
    label: LABELS[id],
    onDrop: (detail) => dragLog().drops.push(JSON.parse(JSON.stringify(detail))),
    onDragEnd: (detail) => {
      dragLog().ends.push(JSON.parse(JSON.stringify(detail)));
      if (String(detail.toContext) === id) onMove(detail);
    },
    onDragRevert: (detail) => {
      dragLog().reverts.push(JSON.parse(JSON.stringify(detail)));
      if (String(detail.fromContext) === id) onMove(detail);
    },
  });
  const item = useDragItems<HTMLLIElement>();
  return (
    <ul
      data-test={id}
      style={{ listStyle: 'none', margin: 0, padding: 8, width: 200, minHeight: 60 }}
      {...list}
    >
      {cards.map((card) => (
        <li
          key={card.id}
          style={{ height: 30, margin: 2, background: '#eee' }}
          {...item(card.id, { label: card.title })}
        >
          {card.title}
        </li>
      ))}
    </ul>
  );
}

function Board() {
  const [lists, setLists] = useState(BOARD);
  dragLog().renders++;
  const move = (detail: Parameters<typeof applyDragMove>[1]) =>
    setLists((current) => applyDragMove(current, detail));
  (window as unknown as { revert?: (id: number) => boolean }).revert = (id) => revertDragItem(id);
  (window as unknown as { removeCard?: (id: number) => void }).removeCard = (id) =>
    setLists((current) =>
      Object.fromEntries(
        Object.entries(current).map(([key, cards]) => [
          key,
          cards.filter((card) => card.id !== id),
        ]),
      ),
    );
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {Object.entries(lists).map(([id, cards]) => (
        <List key={id} id={id} cards={cards} onMove={move} />
      ))}
    </div>
  );
}

// Strict Mode, so the tests cover React's effect replay in development.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board />
  </StrictMode>,
);
(window as unknown as { mounted: boolean }).mounted = true;

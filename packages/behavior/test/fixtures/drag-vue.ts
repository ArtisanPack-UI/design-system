/**
 * A two-list board on the Vue drag adapter, for drag-and-drop.frameworks.test.ts:
 * the to-do list uses the directives, the done list the composable, so both
 * forms are covered. State is the source of truth, through applyDragMove.
 */
import { createApp, defineComponent, h, ref, withDirectives, type PropType } from 'vue';

import {
  applyDragMove,
  revertDragItem,
  useDragContext,
  vDragContext,
  vDragItem,
} from '../../src/vue';
import { BOARD, LABELS, dragLog, type Card } from './drag-shared';

type Move = Parameters<typeof applyDragMove>[1];

const ListStyle = {
  listStyle: 'none',
  margin: '0',
  padding: '8px',
  width: '200px',
  minHeight: '60px',
};
const CardStyle = { height: '30px', margin: '2px', background: '#eee' };

const cardsOf = (cards: Card[]) =>
  cards.map((card) =>
    withDirectives(
      h('li', { key: card.id, style: CardStyle, 'data-drag-label': card.title }, card.title),
      [[vDragItem, card.id]],
    ),
  );

const DirectiveList = defineComponent({
  props: {
    id: { type: String, required: true },
    cards: { type: Array as PropType<Card[]>, required: true },
  },
  emits: ['move'],
  setup(props, { emit }) {
    return () =>
      withDirectives(
        h(
          'ul',
          {
            'data-test': props.id,
            style: ListStyle,
            'onDrag:drop': (event: CustomEvent) =>
              dragLog().drops.push(JSON.parse(JSON.stringify(event.detail))),
            'onDrag:end': (event: CustomEvent<Move>) => {
              dragLog().ends.push(JSON.parse(JSON.stringify(event.detail)));
              if (String(event.detail.toContext) === props.id) emit('move', event.detail);
            },
            'onDrag:revert': (event: CustomEvent<Move>) => {
              dragLog().reverts.push(JSON.parse(JSON.stringify(event.detail)));
              if (String(event.detail.fromContext) === props.id) emit('move', event.detail);
            },
          },
          cardsOf(props.cards),
        ),
        [[vDragContext, { id: props.id, group: 'board', label: LABELS[props.id] }]],
      );
  },
});

const ComposableList = defineComponent({
  props: {
    id: { type: String, required: true },
    cards: { type: Array as PropType<Card[]>, required: true },
  },
  emits: ['move'],
  setup(props, { emit }) {
    const el = ref<HTMLElement | null>(null);
    const { attrs } = useDragContext(el, () => ({
      id: props.id,
      group: 'board',
      label: LABELS[props.id],
      onDrop: (detail) => dragLog().drops.push(JSON.parse(JSON.stringify(detail))),
      onDragEnd: (detail) => {
        dragLog().ends.push(JSON.parse(JSON.stringify(detail)));
        if (String(detail.toContext) === props.id) emit('move', detail);
      },
      onDragRevert: (detail) => {
        dragLog().reverts.push(JSON.parse(JSON.stringify(detail)));
        if (String(detail.fromContext) === props.id) emit('move', detail);
      },
    }));
    return () =>
      h(
        'ul',
        { ref: el, 'data-test': props.id, style: ListStyle, ...attrs.value },
        cardsOf(props.cards),
      );
  },
});

const Board = defineComponent({
  setup() {
    const lists = ref(BOARD);
    const move = (detail: Move) => {
      lists.value = applyDragMove(lists.value, detail);
    };
    (window as unknown as { revert?: (id: number) => boolean }).revert = (id) => revertDragItem(id);
    (window as unknown as { removeCard?: (id: number) => void }).removeCard = (id) => {
      lists.value = Object.fromEntries(
        Object.entries(lists.value).map(([key, cards]) => [
          key,
          cards.filter((card) => card.id !== id),
        ]),
      );
    };
    return () => {
      dragLog().renders++;
      return h('div', { style: { display: 'flex', gap: '16px' } }, [
        h(DirectiveList, { id: 'todo', cards: lists.value.todo!, onMove: move }),
        h(ComposableList, { id: 'done', cards: lists.value.done!, onMove: move }),
      ]);
    };
  },
});

createApp(Board).mount('#root');
(window as unknown as { mounted: boolean }).mounted = true;

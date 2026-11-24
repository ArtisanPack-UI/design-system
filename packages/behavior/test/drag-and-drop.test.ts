// @vitest-environment happy-dom
/**
 * The drag-and-drop engine's pure parts (#140, D-057): settings and message
 * templates, the key map (horizontal lists and RTL), the planned order a
 * controlled drop reports, `applyDragMove`, and the attributes the React and
 * Vue adapters render on the server.
 */
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createSSRApp, h, withDirectives } from 'vue';
import { renderToString as renderVue } from 'vue/server-renderer';

import { useDragContext, useDragItem } from '../src/react';
import { vDragContext, vDragItem, dragContextAttrs } from '../src/vue';
import {
  DRAG_KEYS,
  DRAG_MESSAGES,
  applyDragMove,
  configureDragAndDrop,
  dragSettings,
  formatDragMessage,
  plannedDragOrder,
  registerDragContext,
  registerDragItem,
  resetDragAndDrop,
  resolveDragKey,
} from '../src/widgets/drag-and-drop';

afterEach(() => {
  resetDragAndDrop();
  document.body.innerHTML = '';
});

describe('settings', () => {
  it('starts from the Livewire Drag and Drop defaults', () => {
    expect(dragSettings.messages.grabbed).toBe(DRAG_MESSAGES.grabbed);
    expect(dragSettings.keys.grab).toEqual([' ', 'Enter']);
    expect(dragSettings.dragThreshold).toBe(5);
    expect(dragSettings.touchDelay).toBe(200);
  });

  it('merges messages, keys and tuning, and resets', () => {
    configureDragAndDrop({
      messages: { item: 'Card' },
      keys: { grab: 'g', cancel: ['q', 'Escape'] },
      dragThreshold: 8,
      autoScroll: { speed: 5 },
    });
    expect(dragSettings.messages.item).toBe('Card');
    expect(dragSettings.messages.container).toBe(DRAG_MESSAGES.container);
    expect(dragSettings.keys.grab).toEqual(['g']);
    expect(dragSettings.keys.cancel).toEqual(['q', 'Escape']);
    expect(dragSettings.dragThreshold).toBe(8);
    expect(dragSettings.autoScroll).toEqual({ edge: 48, speed: 5 });
    resetDragAndDrop();
    expect(dragSettings.keys.grab).toEqual([...DRAG_KEYS.grab]);
    expect(dragSettings.messages.item).toBe('Item');
  });

  it('formats templates and leaves unknown or empty placeholders', () => {
    expect(
      formatDragMessage('{item} to {position} of {total}', { item: 'Card', position: 2, total: 3 }),
    ).toBe('Card to 2 of 3');
    expect(formatDragMessage('{item} in {container}', { item: 'Card', container: null })).toBe(
      'Card in {container}',
    );
    expect(formatDragMessage(undefined)).toBe('');
  });
});

describe('the key map', () => {
  it('maps a vertical LTR list', () => {
    expect(resolveDragKey('ArrowUp', false)).toBe('previous');
    expect(resolveDragKey('ArrowDown', false)).toBe('next');
    expect(resolveDragKey('ArrowLeft', false)).toBe('previousContainer');
    expect(resolveDragKey('ArrowRight', false)).toBe('nextContainer');
    expect(resolveDragKey('Home', false)).toBe('first');
    expect(resolveDragKey('x', false)).toBeNull();
  });

  it('swaps within and between for a horizontal list', () => {
    expect(resolveDragKey('ArrowLeft', true)).toBe('previous');
    expect(resolveDragKey('ArrowRight', true)).toBe('next');
    expect(resolveDragKey('ArrowUp', true)).toBe('previousContainer');
  });

  it('makes ArrowRight move right in RTL', () => {
    // Vertical lists side by side: the container on the right comes first in RTL.
    expect(resolveDragKey('ArrowRight', false, true)).toBe('previousContainer');
    expect(resolveDragKey('ArrowLeft', false, true)).toBe('nextContainer');
    expect(resolveDragKey('ArrowUp', false, true)).toBe('previous');
    // A horizontal RTL list: the item on the right comes first.
    expect(resolveDragKey('ArrowRight', true, true)).toBe('previous');
    expect(resolveDragKey('ArrowLeft', true, true)).toBe('next');
  });
});

/** Two registered lists in group `board`. */
function board(): { a: HTMLElement; b: HTMLElement; item: (id: number) => HTMLElement } {
  document.body.innerHTML = `
    <ul id="a"><li data-id="1"></li><li data-id="2"></li><li data-id="3"></li></ul>
    <ul id="b"><li data-id="4"></li></ul>`;
  const a = document.getElementById('a')!;
  const b = document.getElementById('b')!;
  for (const list of [a, b]) {
    registerDragContext(list, { id: list.id, group: 'board' });
    list
      .querySelectorAll('li')
      .forEach((li) => registerDragItem(li as HTMLElement, Number(li.dataset.id)));
  }
  return { a, b, item: (id) => document.querySelector(`[data-id="${id}"]`) as HTMLElement };
}

describe('registration', () => {
  it('decorates contexts and items like the Alpine directives', () => {
    const { a, item } = board();
    expect(a.getAttribute('data-drag-context')).toBe('');
    expect(a.getAttribute('role')).toBe('group');
    expect(item(1).getAttribute('data-drag-item')).toBe('');
    expect(item(1).getAttribute('role')).toBe('button');
    expect(item(1).tabIndex).toBe(0);
    expect(item(1).getAttribute('aria-describedby')).toMatch(/^ldd-instructions-\d+$/);
  });
});

describe('the planned order', () => {
  it('reorders within a list', () => {
    const { a, item } = board();
    expect(plannedDragOrder(item(1), a, a, 2)).toEqual({
      fromOrderedIds: [2, 3, 1],
      toOrderedIds: [2, 3, 1],
    });
    expect(plannedDragOrder(item(3), a, a, 0)).toEqual({
      fromOrderedIds: [3, 1, 2],
      toOrderedIds: [3, 1, 2],
    });
  });

  it('moves between lists and clamps the index', () => {
    const { a, b, item } = board();
    expect(plannedDragOrder(item(2), a, b, 1)).toEqual({
      fromOrderedIds: [1, 3],
      toOrderedIds: [4, 2],
    });
    expect(plannedDragOrder(item(2), a, b, 99)).toEqual({
      fromOrderedIds: [1, 3],
      toOrderedIds: [4, 2],
    });
    expect(plannedDragOrder(item(2), a, b, -1)).toEqual({
      fromOrderedIds: [1, 3],
      toOrderedIds: [2, 4],
    });
  });
});

describe('applyDragMove', () => {
  const lists = {
    todo: [{ id: 1 }, { id: 2 }, { id: 3 }],
    done: [{ id: 4 }],
    other: [{ id: 9 }],
  };

  it('reorders the two lists and keeps the rest', () => {
    const next = applyDragMove(lists, {
      fromContext: 'todo',
      toContext: 'done',
      fromOrderedIds: [1, 3],
      toOrderedIds: [4, 2],
    });
    expect(next.todo).toEqual([{ id: 1 }, { id: 3 }]);
    expect(next.done).toEqual([{ id: 4 }, { id: 2 }]);
    expect(next.other).toBe(lists.other);
    expect(next.done![1]).toBe(lists.todo[1]);
  });

  it('reorders within one list, matches ids as strings, and takes a key function', () => {
    const within = applyDragMove(lists, {
      fromContext: 'todo',
      toContext: 'todo',
      fromOrderedIds: ['3', '1', '2'],
      toOrderedIds: ['3', '1', '2'],
    });
    expect(within.todo!.map((card) => card.id)).toEqual([3, 1, 2]);
    const keyed = applyDragMove(
      { a: [{ key: 'x' }, { key: 'y' }] },
      {
        fromContext: 'a',
        toContext: 'a',
        fromOrderedIds: ['y', 'x'],
        toOrderedIds: ['y', 'x'],
      },
      (card) => card.key,
    );
    expect(keyed.a!.map((card) => card.key)).toEqual(['y', 'x']);
  });

  it('returns the lists as they were for an unknown context', () => {
    expect(
      applyDragMove(lists, {
        fromContext: 'todo',
        toContext: 'nope',
        fromOrderedIds: [],
        toOrderedIds: [],
      }),
    ).toBe(lists);
    expect(
      applyDragMove(lists, {
        fromContext: 'constructor',
        toContext: 'toString',
        fromOrderedIds: [],
        toOrderedIds: [],
      }),
    ).toBe(lists);
  });
});

describe('server rendering', () => {
  it('renders the React props', () => {
    function List() {
      const list = useDragContext({ id: 'todo', group: 'board', label: 'To do' });
      const item = useDragItem(7, { label: 'Seven' });
      return createElement('ul', list, createElement('li', item, 'Seven'));
    }
    const html = renderToString(createElement(List));
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="To do"');
    expect(html).toContain('data-drag-context=""');
    expect(html).toContain('data-drag-controlled=""');
    expect(html).toContain('data-drag-context-id="todo"');
    expect(html).toContain('data-drag-group="board"');
    expect(html).toContain('data-drag-item=""');
    expect(html).toContain('data-drag-id="7"');
    expect(html).toContain('tabindex="0"');
  });

  it('renders the Vue directives', async () => {
    const app = createSSRApp({
      render: () =>
        withDirectives(h('ul', [withDirectives(h('li', 'Seven'), [[vDragItem, 7]])]), [
          [vDragContext, { id: 'todo', group: 'board', label: 'To do' }],
        ]),
    });
    const html = await renderVue(app);
    // Vue writes empty attributes bare.
    const empty = (name: string) => new RegExp(`\\s${name}(="")?[\\s>]`);
    expect(html).toMatch(empty('data-drag-context'));
    expect(html).toMatch(empty('data-drag-controlled'));
    expect(html).toContain('data-drag-context-id="todo"');
    expect(html).toContain('aria-label="To do"');
    expect(html).toMatch(empty('data-drag-item'));
    expect(html).toContain('data-drag-id="7"');
    expect(html).toContain('tabindex="0"');
  });

  it('leaves out data-drag-controlled when a Vue context opts out', () => {
    expect(dragContextAttrs({ controlled: false })).not.toHaveProperty('data-drag-controlled');
  });
});

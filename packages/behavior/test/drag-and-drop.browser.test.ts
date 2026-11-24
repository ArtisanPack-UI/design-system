/**
 * The drag-and-drop engine (#140, D-057) in Chromium: pointer and keyboard
 * moves, cancel, refusal and revert, uncontrolled (the engine moves nodes,
 * as Livewire Drag and Drop does) and controlled (it only reports the move,
 * for React and Vue), and the RTL rules: arrow keys follow what's on screen,
 * horizontal hit-testing follows the flow, and the indicator sits on the
 * inline-start edge.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, launch, settle } from './browser';

let script: string | undefined;

async function engineScript(): Promise<string> {
  script ??= (
    await build({
      entryPoints: [join(__dirname, 'fixtures/drag-vanilla.ts')],
      bundle: true,
      format: 'iife',
      target: 'es2020',
      write: false,
    })
  ).outputFiles[0]!.text;
  return script;
}

interface Opened {
  page: Page;
  errors: string[];
}

/**
 * Two lists in group `board` (or `body`), registered with `options` merged
 * into each, and every event recorded on `window.events`.
 */
async function open({
  dir = 'ltr',
  horizontal = false,
  controlled = false,
  body = '',
} = {}): Promise<Opened> {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const flex = horizontal ? 'display:flex;flex-direction:row;gap:4px;' : '';
  const item = horizontal ? 'width:60px;height:30px;' : 'height:30px;';
  const list = (id: string, cards: [number, string][]) =>
    `<ul id="${id}" data-label="${id === 'a' ? 'First' : 'Second'}" style="list-style:none;margin:0;padding:8px;min-height:40px;width:${horizontal ? 260 : 180}px;${flex}">${cards
      .map(
        ([cid, title]) =>
          `<li data-id="${cid}" data-drag-label="${title}" style="${item}margin:0;background:#ddd">${title}</li>`,
      )
      .join('')}</ul>`;
  await page.setContent(`<!doctype html><html dir="${dir}"><head><style>body{margin:0}</style></head><body>
<div style="display:flex;gap:24px;padding:16px">
${
  body ||
  list('a', [
    [1, 'One'],
    [2, 'Two'],
    [3, 'Three'],
  ]) + list('b', [[4, 'Four']])
}
</div>
<button id="outside">Outside</button>
<script>${await engineScript()}</script>
<script>
  window.events = [];
  for (const list of document.querySelectorAll('ul')) {
    window.DnD.registerDragContext(list, { id: list.id, group: 'board', label: list.dataset.label, controlled: ${controlled} });
    for (const li of list.querySelectorAll('li')) window.DnD.registerDragItem(li, Number(li.dataset.id));
    for (const name of ['drag:start', 'drag:over', 'drag:drop', 'drag:end', 'drag:cancel', 'drag:revert']) {
      list.addEventListener(name, (event) => window.events.push({ on: list.id, name, detail: JSON.parse(JSON.stringify(event.detail)) }));
    }
  }
</script>
</body></html>`);
  await settle(page);
  return { page, errors };
}

const order = (page: Page, id: string) =>
  page.$$eval(`#${id} li`, (els) => els.map((el) => Number((el as HTMLElement).dataset.id)));

const events = (page: Page, name?: string) =>
  page.evaluate(
    (n) =>
      (
        window as unknown as {
          events: { on: string; name: string; detail: Record<string, unknown> }[];
        }
      ).events.filter((event) => !n || event.name === n),
    name,
  );

const announced = (page: Page) =>
  page.$eval('[data-drag-live-region]', (el) => el.textContent?.trim() ?? '');

async function center(page: Page, selector: string) {
  const box = (await page.locator(selector).boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
}

/** Drags `from` with the mouse to a point and releases. */
async function drag(page: Page, from: string, to: { x: number; y: number }) {
  const start = await center(page, from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 10, start.y + 10, { steps: 2 });
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await settle(page);
}

async function focusAndPress(page: Page, selector: string, ...keys: string[]) {
  await page.focus(selector);
  for (const key of keys) await page.keyboard.press(key);
  await settle(page);
}

afterAll(close);

describe('drag and drop: uncontrolled (the Livewire path)', () => {
  it('decorates contexts and items', async () => {
    const { page, errors } = await open();
    expect(await page.getAttribute('#a', 'role')).toBe('group');
    expect(await page.getAttribute('#a', 'aria-label')).toBe('First');
    expect(await page.getAttribute('#a li:first-child', 'role')).toBe('button');
    expect(await page.getAttribute('#a li:first-child', 'tabindex')).toBe('0');
    const described = await page.getAttribute('#a li:first-child', 'aria-describedby');
    expect(described).toMatch(/^ldd-instructions-\d+$/);
    expect(await page.textContent(`#${described}`)).toContain('Press Space or Enter to pick up');
    expect(errors).toEqual([]);
  });

  it('reorders with the pointer, moving the node, and reports the order', async () => {
    const { page } = await open();
    const three = await center(page, '#a li:nth-child(3)');
    await drag(page, '#a li:first-child', { x: three.x, y: three.box.y + three.box.height - 2 });
    expect(await page.locator('[data-drag-indicator]').count()).toBe(1);
    expect(await page.locator('[data-drag-indicator-overlay]').count()).toBe(0);
    await page.mouse.up();
    await settle(page);
    expect(await order(page, 'a')).toEqual([2, 3, 1]);
    const [end] = await events(page, 'drag:end');
    expect(end!.detail).toMatchObject({
      itemId: 1,
      fromContext: 'a',
      toContext: 'a',
      toIndex: 2,
      orderedIds: [2, 3, 1],
    });
    const [drop] = await events(page, 'drag:drop');
    expect(drop!.detail).toMatchObject({
      toIndex: 2,
      fromOrderedIds: [2, 3, 1],
      toOrderedIds: [2, 3, 1],
    });
    expect(await announced(page)).toBe('One dropped in First, position 3 of 3.');
    expect(await page.locator('[data-drag-indicator]').count()).toBe(0);
  });

  it('moves with the keyboard across the group, live in the DOM, and drops', async () => {
    const { page } = await open();
    await focusAndPress(page, '#a li:first-child', 'Space');
    expect(await announced(page)).toBe('One grabbed. Position 1 of 3 in First.');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await order(page, 'a')).toEqual([2, 1, 3]);
    expect(await announced(page)).toBe('One moved to position 2 of 3 in First.');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await order(page, 'b')).toEqual([4, 1]);
    expect(await announced(page)).toBe('One moved to Second, position 2 of 2.');
    expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.id)).toBe('1');
    await page.keyboard.press('Enter');
    await settle(page);
    const ends = await events(page, 'drag:end');
    expect(ends.map((event) => event.on).sort()).toEqual(['a', 'b']);
    expect(ends.find((event) => event.on === 'a')!.detail).toMatchObject({ orderedIds: [2, 3] });
    expect(ends.find((event) => event.on === 'b')!.detail).toMatchObject({
      orderedIds: [4, 1],
      toIndex: 1,
    });
  });

  it('cancels with Escape and puts the item back', async () => {
    const { page } = await open();
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowDown', 'ArrowDown', 'Escape');
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    expect((await events(page, 'drag:cancel'))[0]!.detail).toMatchObject({ reason: 'escape' });
    expect(await announced(page)).toBe('Move cancelled. One returned to First, position 1 of 3.');
  });

  it('refuses a drop through drag:drop and through accepts', async () => {
    const { page } = await open();
    await page.evaluate(() => {
      document
        .querySelector('#a')!
        .addEventListener('drag:drop', (event) => (event as CustomEvent).detail.reject('Not now.'));
    });
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowDown', 'Enter');
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    expect((await events(page, 'drag:cancel'))[0]!.detail).toMatchObject({ reason: 'rejected' });
    expect(await announced(page)).toBe('Not now.');

    await page.evaluate(() => {
      const w = window as unknown as { DnD: typeof import('../src/widgets/drag-and-drop') };
      w.DnD.registerDragContext(document.querySelector('#b') as HTMLElement, {
        id: 'b',
        group: 'board',
        label: 'Second',
        accepts: () => false,
      });
    });
    await focusAndPress(page, '#a li:nth-child(2)', 'Space', 'ArrowRight');
    expect(await announced(page)).toBe('There is no other container in that direction.');
    await page.keyboard.press('Escape');
  });

  it('reverts a committed move', async () => {
    const { page } = await open();
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowRight', 'Enter');
    expect(await order(page, 'b')).toEqual([1, 4]);
    expect(
      await page.evaluate(() =>
        (window as unknown as { DnD: { revertDragItem(id: number): boolean } }).DnD.revertDragItem(
          1,
        ),
      ),
    ).toBe(true);
    await settle(page);
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    expect(await order(page, 'b')).toEqual([4]);
    const reverts = await events(page, 'drag:revert');
    expect(reverts.find((event) => event.on === 'a')!.detail).toMatchObject({
      orderedIds: [1, 2, 3],
      fromContext: 'a',
      toContext: 'b',
    });
    expect(await announced(page)).toBe('One moved back to First, position 1 of 3.');
  });
});

describe('drag and drop: controlled (the React and Vue path)', () => {
  it('never moves a node on a pointer drop, and reports the move', async () => {
    const { page } = await open({ controlled: true });
    const three = await center(page, '#a li:nth-child(3)');
    await drag(page, '#a li:first-child', { x: three.x, y: three.box.y + three.box.height - 2 });
    expect(await page.locator('[data-drag-indicator-overlay]').count()).toBe(1);
    expect(await page.locator('#a [data-drag-indicator]').count()).toBe(0);
    const line = (await page.locator('[data-drag-indicator-overlay]').boundingBox())!;
    expect(Math.abs(line.y + line.height / 2 - (three.box.y + three.box.height))).toBeLessThan(2);
    await page.mouse.up();
    await settle(page);
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    const [drop] = await events(page, 'drag:drop');
    expect(drop!.detail).toMatchObject({
      itemId: 1,
      toContext: 'a',
      toIndex: 2,
      fromOrderedIds: [2, 3, 1],
      toOrderedIds: [2, 3, 1],
    });
    const [end] = await events(page, 'drag:end');
    expect(end!.detail).toMatchObject({ toIndex: 2, orderedIds: [2, 3, 1] });
    expect(await announced(page)).toBe('One dropped in First, position 3 of 3.');
    expect(await page.locator('[data-drag-indicator]').count()).toBe(0);
  });

  it('moves a virtual position with the keyboard, shows it, and announces it', async () => {
    const { page } = await open({ controlled: true });
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowDown');
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    expect(await announced(page)).toBe('One moved to position 2 of 3 in First.');
    expect(await page.locator('[data-drag-indicator-overlay]').count()).toBe(1);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await order(page, 'b')).toEqual([4]);
    expect(await announced(page)).toBe('One moved to Second, position 2 of 2.');
    expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.id)).toBe('1');
    await page.keyboard.press('Space');
    await settle(page);
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    const drops = await events(page, 'drag:drop');
    expect(drops[0]!.detail).toMatchObject({
      toContext: 'b',
      toIndex: 1,
      fromOrderedIds: [2, 3],
      toOrderedIds: [4, 1],
    });
    expect(await announced(page)).toBe('One dropped in Second, position 2 of 2.');
  });

  it('cancels without touching the DOM', async () => {
    const { page } = await open({ controlled: true });
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowDown', 'ArrowDown', 'Escape');
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    expect(await announced(page)).toBe('Move cancelled. One returned to First, position 1 of 3.');
    expect(await page.locator('[data-drag-indicator]').count()).toBe(0);
  });

  it('reverts by reporting the order to render', async () => {
    const { page } = await open({ controlled: true });
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowDown', 'ArrowDown', 'Space');
    // Render the drop as a framework would.
    await page.evaluate(() => {
      const a = document.querySelector('#a')!;
      a.appendChild(a.querySelector('li')!);
    });
    expect(
      await page.evaluate(() =>
        (window as unknown as { DnD: { revertDragItem(id: number): boolean } }).DnD.revertDragItem(
          1,
        ),
      ),
    ).toBe(true);
    await settle(page);
    expect(await order(page, 'a')).toEqual([2, 3, 1]);
    const revert = (await events(page, 'drag:revert'))[0]!;
    expect(revert.detail).toMatchObject({ orderedIds: [1, 2, 3], fromIndex: 0, toIndex: 2 });
  });
});

describe('drag and drop: right to left', () => {
  it('maps ArrowRight to the container on the right (the previous one) in RTL', async () => {
    const { page } = await open({ dir: 'rtl' });
    const a = (await page.locator('#a').boundingBox())!;
    const b = (await page.locator('#b').boundingBox())!;
    expect(b.x).toBeLessThan(a.x);
    await focusAndPress(page, '#b li', 'Space', 'ArrowRight');
    expect(await order(page, 'a')).toEqual([4, 1, 2, 3]);
    await page.keyboard.press('Escape');
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowLeft');
    expect(await order(page, 'b')).toEqual([1, 4]);
    await page.keyboard.press('Escape');
  });

  it('swaps the arrows within an RTL horizontal list', async () => {
    const { page } = await open({ dir: 'rtl', horizontal: true });
    await focusAndPress(page, '#a li:first-child', 'Space', 'ArrowLeft');
    expect(await order(page, 'a')).toEqual([2, 1, 3]);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await order(page, 'a')).toEqual([1, 2, 3]);
    await page.keyboard.press('Escape');
  });

  it('drops where the pointer is in an RTL horizontal list', async () => {
    const { page } = await open({ dir: 'rtl', horizontal: true });
    const three = await center(page, '#a li:nth-child(3)');
    // Past the third item's inline end, which is its left edge in RTL.
    await drag(page, '#a li:first-child', { x: three.box.x + 4, y: three.y });
    const indicator = page.locator('#a [data-drag-indicator]');
    expect(await indicator.count()).toBe(1);
    expect(await indicator.evaluate((el) => getComputedStyle(el).borderRightWidth)).toBe('3px');
    await page.mouse.up();
    await settle(page);
    expect(await order(page, 'a')).toEqual([2, 3, 1]);
  });

  it('puts the controlled overlay on the inline-start edge in RTL', async () => {
    const { page } = await open({ dir: 'rtl', horizontal: true, controlled: true });
    const two = await center(page, '#a li:nth-child(2)');
    await drag(page, '#a li:nth-child(3)', { x: two.box.x + two.box.width - 4, y: two.y });
    const line = (await page.locator('[data-drag-indicator-overlay]').boundingBox())!;
    expect(Math.abs(line.x + line.width / 2 - (two.box.x + two.box.width))).toBeLessThan(2);
    await page.mouse.up();
    await settle(page);
    expect((await events(page, 'drag:drop'))[0]!.detail).toMatchObject({ itemId: 3, toIndex: 1 });
  });
});

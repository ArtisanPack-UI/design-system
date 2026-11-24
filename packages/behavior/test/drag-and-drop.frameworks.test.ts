/**
 * The React and Vue drag adapters (#140, D-057) in Chromium, on a two-list
 * board whose state is the source of truth: the adapters render the same
 * attributes as the Alpine directives, pointer and keyboard drops re-render
 * through `applyDragMove` without the engine touching the DOM (so neither
 * framework logs an error), focus returns to the moved item, and a revert
 * renders the original order.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, launch, settle, type Stack } from './browser';

const scripts = new Map<Stack, string>();

async function fixture(stack: Stack): Promise<string> {
  const cached = scripts.get(stack);
  if (cached) return cached;
  const result = await build({
    entryPoints: [join(__dirname, `fixtures/drag-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`)],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    jsx: 'automatic',
    write: false,
    define: {
      'process.env.NODE_ENV': '"development"',
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  });
  const script = result.outputFiles[0]!.text;
  scripts.set(stack, script);
  return script;
}

async function openBoard(stack: Stack): Promise<{ page: Page; errors: string[] }> {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.setContent(`<!doctype html><html><head><style>body{margin:0;padding:16px}</style></head>
<body><div id="root"></div><script>${await fixture(stack)}</script></body></html>`);
  await page.waitForFunction(() => (window as unknown as { mounted?: boolean }).mounted);
  await settle(page);
  return { page, errors };
}

const titles = (page: Page, list: string) =>
  page.$$eval(`[data-test="${list}"] li`, (els) => els.map((el) => el.textContent?.trim()));

const log = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as unknown as {
          dragLog: {
            drops: Record<string, unknown>[];
            ends: Record<string, unknown>[];
            reverts: Record<string, unknown>[];
          };
        }
      ).dragLog,
  );

const announced = (page: Page) =>
  page.$eval('[data-drag-live-region]', (el) => el.textContent?.trim() ?? '');

afterAll(close);

describe.each(['react', 'vue'] as const)('drag-and-drop adapter (%s)', (stack) => {
  it('renders the same attributes as the Alpine directives', async () => {
    const { page, errors } = await openBoard(stack);
    const list = page.locator('[data-test="todo"]');
    expect(await list.getAttribute('data-drag-context')).toBe('');
    expect(await list.getAttribute('data-drag-controlled')).toBe('');
    expect(await list.getAttribute('data-drag-context-id')).toBe('todo');
    expect(await list.getAttribute('role')).toBe('group');
    expect(await list.getAttribute('aria-label')).toBe('To do');
    const card = page.locator('[data-test="todo"] li').first();
    expect(await card.getAttribute('data-drag-item')).toBe('');
    expect(await card.getAttribute('data-drag-id')).toBe('1');
    expect(await card.getAttribute('role')).toBe('button');
    expect(await card.getAttribute('tabindex')).toBe('0');
    expect(await card.getAttribute('aria-describedby')).toMatch(/^ldd-instructions-\d+$/);
    expect(await page.locator('[data-test="done"]').getAttribute('data-drag-group')).toBe('board');
    expect(errors).toEqual([]);
  });

  it('moves a card to the other list with the keyboard and keeps focus on it', async () => {
    const { page, errors } = await openBoard(stack);
    await page.focus('[data-test="todo"] li:first-child');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await titles(page, 'todo')).toEqual(['Write', 'Review', 'Ship']);
    expect(await announced(page)).toBe('Write moved to Done, position 1 of 2.');
    await page.keyboard.press('Enter');
    await settle(page);
    await settle(page);
    expect(await titles(page, 'todo')).toEqual(['Review', 'Ship']);
    expect(await titles(page, 'done')).toEqual(['Write', 'Plan']);
    expect(await page.evaluate(() => document.activeElement?.textContent?.trim())).toBe('Write');
    const { drops } = await log(page);
    expect(drops).toHaveLength(2);
    expect(drops[0]).toMatchObject({
      itemId: 1,
      fromContext: 'todo',
      toContext: 'done',
      toIndex: 0,
      toOrderedIds: [1, 4],
    });
    expect(errors).toEqual([]);
  });

  it('reorders with the pointer', async () => {
    const { page, errors } = await openBoard(stack);
    const first = (await page.locator('[data-test="todo"] li').first().boundingBox())!;
    const last = (await page.locator('[data-test="todo"] li').last().boundingBox())!;
    await page.mouse.move(first.x + 20, first.y + 10);
    await page.mouse.down();
    await page.mouse.move(first.x + 30, first.y + 20, { steps: 2 });
    await page.mouse.move(last.x + 20, last.y + last.height - 3, { steps: 6 });
    await settle(page);
    expect(await page.locator('[data-drag-indicator-overlay]').count()).toBe(1);
    await page.mouse.up();
    await settle(page);
    expect(await titles(page, 'todo')).toEqual(['Review', 'Ship', 'Write']);
    expect(errors).toEqual([]);
  });

  it('renders a revert', async () => {
    const { page, errors } = await openBoard(stack);
    await page.focus('[data-test="todo"] li:first-child');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await titles(page, 'done')).toEqual(['Write', 'Plan']);
    expect(
      await page.evaluate(() => (window as unknown as { revert(id: number): boolean }).revert(1)),
    ).toBe(true);
    await settle(page);
    expect(await titles(page, 'todo')).toEqual(['Write', 'Review', 'Ship']);
    expect(await titles(page, 'done')).toEqual(['Plan']);
    expect((await log(page)).reverts.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  it('cancels a keyboard drag when the held card is removed from state', async () => {
    const { page, errors } = await openBoard(stack);
    await page.focus('[data-test="todo"] li:first-child');
    await page.keyboard.press('Space');
    expect(await page.getAttribute('body', 'data-drag-in-progress')).toBe('keyboard');
    await page.evaluate(() =>
      (window as unknown as { removeCard(id: number): void }).removeCard(1),
    );
    await settle(page);
    expect(await titles(page, 'todo')).toEqual(['Review', 'Ship']);
    expect(await page.getAttribute('body', 'data-drag-in-progress')).toBeNull();
    // Another card can be picked up: no drag is stuck.
    await page.focus('[data-test="todo"] li:first-child');
    await page.keyboard.press('Space');
    expect(await announced(page)).toBe('Review grabbed. Position 1 of 2 in To do.');
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });

  it('refuses a drop with reject() and leaves the order alone', async () => {
    const { page } = await openBoard(stack);
    await page.evaluate(() => {
      document
        .querySelector('[data-test="done"]')!
        .addEventListener('drag:drop', (event) =>
          (event as CustomEvent).detail.reject('Done is locked.'),
        );
    });
    await page.focus('[data-test="todo"] li:first-child');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await titles(page, 'done')).toEqual(['Plan']);
    expect(await announced(page)).toBe('Done is locked.');
  });
});

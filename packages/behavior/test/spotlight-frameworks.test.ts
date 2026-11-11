/**
 * Spotlight through the React and Vue adapters (#57): the same behavior as
 * the Alpine tests, plus each stack's controlled and uncontrolled patterns.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, launch, settle, type Stack } from './browser';
import type { SpotlightFixture } from './fixtures/spotlight-shared';

const bundles = new Map<Stack, string>();

/** A stack's Spotlight fixture, bundled with its framework. */
async function fixtureScript(stack: Stack): Promise<string> {
  const cached = bundles.get(stack);
  if (cached) return cached;
  const result = await build({
    entryPoints: [
      join(__dirname, `fixtures/spotlight-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`),
    ],
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
  bundles.set(stack, script);
  return script;
}

async function openPalette(stack: Stack, options: SpotlightFixture, dir = 'ltr') {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.setContent(`<!doctype html>
<html dir="${dir}"><head><style>[hidden] { display: none !important; } body { margin: 0; min-height: 200vh; }</style></head>
<body><div id="root"></div><button id="outside">Outside</button>
<script>${await fixtureScript(stack)}</script></body></html>`);
  await page.waitForFunction(() => (window as unknown as { spotlight?: unknown }).spotlight);
  await page.evaluate(
    (o) => (window as unknown as { spotlight: { mount(o: object): void } }).spotlight.mount(o),
    options as object,
  );
  await settle(page);
  return { page, errors };
}

const isOpen = (page: Page) => page.$eval('#s-content', (el) => !el.hasAttribute('hidden'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const values = (page: Page) =>
  page.$$eval('#s-results [data-part="item"]:not([hidden])', (els) =>
    els.map((el) => el.getAttribute('data-value')),
  );
const highlighted = (page: Page) =>
  page.evaluate(
    () =>
      document.querySelector('#s-results [data-highlighted]')?.getAttribute('data-value') ?? null,
  );
const events = (page: Page, name: string) =>
  page.evaluate(
    (n) =>
      (window as unknown as { spotlight: { events: [string, unknown][] } }).spotlight.events
        .filter(([event]) => event === n)
        .map(([, detail]) => detail),
    name,
  );
const setParent = async (page: Page, key: string, value: unknown) => {
  await page.evaluate(
    ([k, v]) =>
      (window as unknown as { spotlight: { set(k: string, v: unknown): void } }).spotlight.set(
        k as string,
        v,
      ),
    [key, value] as const,
  );
  await settle(page);
  await settle(page);
};

async function typeQuery(page: Page, text: string) {
  await page.keyboard.type(text);
  await settle(page);
  await settle(page);
}

afterAll(close);

describe.each<Stack>(['react', 'vue'])('%s spotlight', (stack) => {
  it('renders closed with every part in the spotlight scope', async () => {
    const { page, errors } = await openPalette(stack, { mode: 'uncontrolled' });
    expect(await isOpen(page)).toBe(false);
    const parts = await page.$$eval('[data-scope]', (els) =>
      els.map((el) => `${el.getAttribute('data-scope')}:${el.getAttribute('data-part')}`),
    );
    for (const part of [
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'search',
      'query',
      'close-trigger',
      'results',
      'item-group',
      'item-group-label',
      'item',
      'item-text',
      'empty',
      'loading',
    ]) {
      expect(parts).toContain(`spotlight:${part}`);
    }
    expect(parts.every((part) => part.startsWith('spotlight:'))).toBe(true);
    expect(await page.$eval('#s-query', (el) => el.getAttribute('aria-controls'))).toBe(
      's-results',
    );
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens with the shortcut, focuses the query and activates the first result', async () => {
    const { page, errors } = await openPalette(stack, { mode: 'uncontrolled', shortcut: 'ctrl+k' });
    await page.keyboard.press('Control+k');
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    expect(await events(page, 'open-change')).toEqual([{ open: true }]);
    expect(await page.$eval('#s-content', (el) => el.getAttribute('aria-label'))).toBe('Search');
    expect(await focusedId(page)).toBe('s-query');
    expect(await page.$eval('#s-query', (el) => el.getAttribute('role'))).toBe('combobox');
    expect(await page.$eval('#s-results', (el) => el.getAttribute('role'))).toBe('listbox');
    expect(await highlighted(page)).toBe('growth');
    const active = await page.$eval('#s-query', (el) => el.getAttribute('aria-activedescendant'));
    expect(await page.$eval(`[id="${active}"]`, (el) => el.getAttribute('aria-selected'))).toBe(
      'true',
    );
    expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBe('true');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await highlighted(page)).toBe('groups');
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('filters by every word, hides empty groups and shows the empty state', async () => {
    const { page } = await openPalette(stack, { mode: 'uncontrolled' });
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'team');
    expect(await values(page)).toEqual(['groups']);
    expect(await page.$$eval('[data-part="item-group"]', (els) => els.length)).toBe(1);
    expect(await highlighted(page)).toBe('groups');
    await page.fill('#s-query', 'zzz');
    await settle(page);
    await settle(page);
    expect(await values(page)).toEqual([]);
    expect(await page.$eval('#s-empty', (el) => el.hasAttribute('hidden'))).toBe(false);
    expect((await events(page, 'search-change')).at(-1)).toEqual({ search: 'zzz' });
    await page.close();
  });

  it('chooses with Enter, closes, and lists the choice first next time', async () => {
    const { page } = await openPalette(stack, { mode: 'controlled' });
    await setParent(page, 'open', true);
    expect(await isOpen(page)).toBe(true);
    await typeQuery(page, 'import');
    await page.keyboard.press('Enter');
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    const selects = await events(page, 'select');
    expect(selects).toHaveLength(1);
    expect(selects[0]).toMatchObject({ value: 'import', item: { label: 'Import listings' } });
    expect(await events(page, 'open-change')).toEqual([{ open: false }]);
    await page.click('#s-trigger');
    await settle(page);
    await settle(page);
    expect(await page.$eval('#s-query', (el) => (el as HTMLInputElement).value)).toBe('');
    expect((await values(page))[0]).toBe('recent:import');
    await page.close();
  });

  it('follows a link item chosen from the keyboard', async () => {
    const { page } = await openPalette(stack, { mode: 'uncontrolled' });
    await page.click('#s-trigger');
    await settle(page);
    await settle(page);
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await page.evaluate(() => location.hash)).toBe('#growth');
    expect(await events(page, 'select')).toHaveLength(1);
    await page.close();
  });

  it('follows a controlled query and leaves remote results unfiltered', async () => {
    const { page } = await openPalette(stack, {
      mode: 'uncontrolled',
      controlledSearch: true,
      remote: true,
    });
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'zz');
    expect(await page.$eval('#s-query', (el) => (el as HTMLInputElement).value)).toBe('zz');
    expect(await values(page)).toEqual(['growth', 'groups', 'add', 'import']);
    await setParent(page, 'search', 'abc');
    expect(await page.$eval('#s-query', (el) => (el as HTMLInputElement).value)).toBe('abc');
    // Closing resets the parent's query.
    await page.keyboard.press('Escape');
    await settle(page);
    expect((await events(page, 'search-change')).at(-1)).toEqual({ search: '' });
    await page.close();
  });

  it('marks the results busy while loading', async () => {
    const { page } = await openPalette(stack, { mode: 'uncontrolled', loading: true });
    expect(await page.$eval('#s-results', (el) => el.getAttribute('aria-busy'))).toBe('true');
    expect(await page.$eval('#s-loading', (el) => el.hasAttribute('hidden'))).toBe(false);
    expect(await page.$eval('#s-empty', (el) => el.hasAttribute('hidden'))).toBe(true);
    await page.close();
  });

  it('removes the shortcut on unmount', async () => {
    const { page } = await openPalette(stack, { mode: 'uncontrolled', shortcut: 'ctrl+k' });
    await page.evaluate(() =>
      (window as unknown as { spotlight: { unmount(): void } }).spotlight.unmount(),
    );
    await settle(page);
    await page.keyboard.press('Control+k');
    await settle(page);
    expect(await events(page, 'open-change')).toEqual([]);
    await page.close();
  });
});

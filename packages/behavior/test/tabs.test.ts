/**
 * Tabs (#56) through the Alpine adapter, and the React and Vue hooks: tab
 * ARIA and ids, arrow keys that follow the text direction, automatic and
 * manual activation, bound value, value-change, and morph survival.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, data, launch, morph, open, setData, settle } from './browser';

/** The tabs as a server renders them: ids per part, no machine attributes. */
const markup = (value = 'overview', mode = 'automatic') => `
<div id="tabs" x-data="apuiTabs({ value: '${value}', activationMode: '${mode}', label: 'Sections' })" x-apui:root>
  <div id="list" x-apui:list>
    <button id="trigger-overview" x-apui:trigger="{ value: 'overview' }">Overview</button>
    <button id="trigger-history" x-apui:trigger="{ value: 'history' }">History</button>
    <button id="trigger-archived" x-apui:trigger="{ value: 'archived', disabled: true }">Archived</button>
    <button id="trigger-settings" x-apui:trigger="{ value: 'settings' }">Settings</button>
  </div>
  <div id="content-overview" x-apui:content="{ value: 'overview' }">Overview panel</div>
  <div id="content-history" x-apui:content="{ value: 'history' }">History panel</div>
  <div id="content-archived" x-apui:content="{ value: 'archived' }">Archived panel</div>
  <div id="content-settings" x-apui:content="{ value: 'settings' }">Settings panel</div>
</div>`;

const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const selected = (page: Page) =>
  page.$$eval('[role="tab"][aria-selected="true"]', (els) => els.map((el) => el.id));
const visiblePanels = (page: Page) =>
  page.$$eval('[role="tabpanel"]:not([hidden])', (els) => els.map((el) => el.id));

async function record(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { events: unknown[] };
    w.events = [];
    document
      .querySelector('#tabs')!
      .addEventListener('value-change', (event) => w.events.push((event as CustomEvent).detail));
  });
}

afterAll(close);

describe('tabs (Alpine)', () => {
  it('renders tab ARIA on the authored ids, scoped tabs', async () => {
    const { page, errors } = await open(markup());
    expect(
      await page.$eval('#list', (el) => [el.getAttribute('role'), el.getAttribute('aria-label')]),
    ).toEqual(['tablist', 'Sections']);
    expect(await selected(page)).toEqual(['trigger-overview']);
    expect(await visiblePanels(page)).toEqual(['content-overview']);
    expect(await page.$eval('#trigger-overview', (el) => el.getAttribute('aria-controls'))).toBe(
      'content-overview',
    );
    expect(await page.$eval('#content-overview', (el) => el.getAttribute('aria-labelledby'))).toBe(
      'trigger-overview',
    );
    expect(await page.$eval('#trigger-history', (el) => el.getAttribute('tabindex'))).toBe('-1');
    expect(await page.$eval('#trigger-overview', (el) => el.getAttribute('tabindex'))).toBe('0');
    expect(await page.$eval('#trigger-archived', (el) => el.hasAttribute('disabled'))).toBe(true);
    const scopes = await page.$$eval('#tabs [data-part], #tabs', (els) => [
      ...new Set(els.map((el) => el.getAttribute('data-scope'))),
    ]);
    expect(scopes).toEqual(['tabs']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('selects the first enabled tab when nothing is selected', async () => {
    const { page } = await open(markup().replace("value: 'overview', ", 'value: null, '));
    await settle(page);
    expect(await selected(page)).toEqual(['trigger-overview']);
    expect(await data(page, '#tabs', 'value')).toBe('overview');
    await page.close();
  });

  it('moves and selects with the arrow keys, skipping disabled tabs, and reports value-change', async () => {
    const { page } = await open(markup());
    await record(page);
    await page.focus('#trigger-overview');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-history');
    expect(await selected(page)).toEqual(['trigger-history']);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-settings');
    await page.keyboard.press('Home');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-overview');
    await page.keyboard.press('End');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-settings');
    expect(await data(page, '#tabs', 'value')).toBe('settings');
    expect(
      await page.evaluate(() => (window as unknown as { events: unknown[] }).events),
    ).toContainEqual({ value: 'history' });
    await page.close();
  });

  it('follows the text direction in RTL: ArrowLeft moves to the next tab', async () => {
    const { page } = await open(markup(), { dir: 'rtl' });
    await page.focus('#trigger-overview');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-history');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-overview');
    await page.close();
  });

  it('only moves focus in manual mode, and selects on Enter', async () => {
    const { page } = await open(markup('overview', 'manual'));
    await page.focus('#trigger-overview');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-history');
    expect(await selected(page)).toEqual(['trigger-overview']);
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await selected(page)).toEqual(['trigger-history']);
    expect(await visiblePanels(page)).toEqual(['content-history']);
    await page.close();
  });

  it('binds value to Alpine data both ways, and ignores clicks on disabled tabs', async () => {
    const { page } = await open(markup());
    await setData(page, '#tabs', 'value', 'settings');
    expect(await selected(page)).toEqual(['trigger-settings']);
    await page.click('#trigger-history');
    await settle(page);
    expect(await data(page, '#tabs', 'value')).toBe('history');
    await page.click('#trigger-archived', { force: true });
    await settle(page);
    expect(await data(page, '#tabs', 'value')).toBe('history');
    await page.close();
  });

  it('keeps the selection and ARIA through a morph', async () => {
    const { page, errors } = await open(markup());
    await page.click('#trigger-history');
    await settle(page);
    await morph(page, '#tabs', markup());
    expect(await selected(page)).toEqual(['trigger-history']);
    expect(await visiblePanels(page)).toEqual(['content-history']);
    expect(await page.$eval('#list', (el) => el.getAttribute('role'))).toBe('tablist');
    await page.focus('#trigger-history');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-settings');
    expect(errors).toEqual([]);
    await page.close();
  });
});

// ---------------------------------------------------------------------------
// React and Vue

type Stack = 'react' | 'vue';
const scripts = new Map<Stack, string>();

async function fixture(stack: Stack): Promise<string> {
  const cached = scripts.get(stack);
  if (cached) return cached;
  const result = await build({
    entryPoints: [join(__dirname, `fixtures/tabs-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`)],
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
  scripts.set(stack, result.outputFiles[0]!.text);
  return scripts.get(stack)!;
}

async function mountStack(stack: Stack, options: object, dir = 'ltr') {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  await page.setContent(
    `<!doctype html><html dir="${dir}"><head><style>[hidden]{display:none!important}</style></head><body><div id="root"></div><script>${await fixture(stack)}</script></body></html>`,
  );
  await page.evaluate(
    (o) => (window as unknown as { tabsFixture: { mount(o: object): void } }).tabsFixture.mount(o),
    options,
  );
  await settle(page);
  return { page, errors };
}

const shown = (page: Page) =>
  page.evaluate(() => (window as unknown as { tabsFixture: { value?: string } }).tabsFixture.value);

describe.each(['react', 'vue'] as const)('tabs (%s)', (stack) => {
  it('renders the same ARIA and ids as Alpine', async () => {
    const { page, errors } = await mountStack(stack, { mode: 'controlled' });
    expect(
      await page.$eval('#list', (el) => [el.getAttribute('role'), el.getAttribute('aria-label')]),
    ).toEqual(['tablist', 'Sections']);
    expect(await selected(page)).toEqual(['trigger-overview']);
    expect(await visiblePanels(page)).toEqual(['content-overview']);
    expect(await page.$eval('#trigger-overview', (el) => el.getAttribute('aria-controls'))).toBe(
      'content-overview',
    );
    expect(errors).toEqual([]);
    await page.close();
  });

  it('selects with the arrow keys, mirrored in RTL, when controlled', async () => {
    const { page } = await mountStack(stack, { mode: 'controlled' }, 'rtl');
    await page.focus('#trigger-overview');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-history');
    expect(await shown(page)).toBe('history');
    expect(await selected(page)).toEqual(['trigger-history']);
    await page.close();
  });

  it('follows the parent value, and moves only focus in manual mode', async () => {
    const { page } = await mountStack(stack, { mode: 'controlled', activationMode: 'manual' });
    await page.evaluate(() =>
      (window as unknown as { tabsFixture: { set(v: string): void } }).tabsFixture.set('settings'),
    );
    await settle(page);
    expect(await selected(page)).toEqual(['trigger-settings']);
    await page.focus('#trigger-settings');
    await page.keyboard.press('Home');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-overview');
    expect(await selected(page)).toEqual(['trigger-settings']);
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await selected(page)).toEqual(['trigger-overview']);
    await page.close();
  });

  it('keeps its own value when uncontrolled', async () => {
    const { page } = await mountStack(stack, { mode: 'uncontrolled', initial: 'history' });
    expect(await selected(page)).toEqual(['trigger-history']);
    await page.click('#trigger-settings');
    await settle(page);
    expect(await selected(page)).toEqual(['trigger-settings']);
    await page.close();
  });
  it('selects the first enabled tab when nothing is, so one tab is in the Tab order', async () => {
    const { page, errors } = await mountStack(stack, { mode: 'uncontrolled' });
    expect(await selected(page)).toEqual(['trigger-overview']);
    expect(await page.$eval('#trigger-overview', (el) => el.getAttribute('tabindex'))).toBe('0');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('selects the first tab of tabs that load after mount', async () => {
    const { page } = await mountStack(stack, { mode: 'uncontrolled', late: true });
    expect(await page.$$eval('[role="tab"]', (els) => els.length)).toBe(0);
    await page.evaluate(() =>
      (window as unknown as { tabsFixture: { load(): void } }).tabsFixture.load(),
    );
    await settle(page);
    await settle(page);
    expect(await selected(page)).toEqual(['trigger-overview']);
    expect(await visiblePanels(page)).toEqual(['content-overview']);
    await page.close();
  });
});

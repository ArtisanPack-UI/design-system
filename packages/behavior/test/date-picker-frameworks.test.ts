/**
 * DatePicker through the React and Vue adapters (#55): the same definition as
 * the Alpine adapter, so the same ARIA, keyboard (RTL included), range and
 * time behavior, plus each stack's controlled and uncontrolled patterns and a
 * markup comparison with Alpine.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, launch, open, type Opened, settle, type Stack } from './browser';
import { markup } from './date-picker-markup';

const bundles = new Map<Stack, string>();

/** A stack's date picker fixture, bundled with its framework. */
async function bundle(stack: Stack): Promise<string> {
  const cached = bundles.get(stack);
  if (cached) return cached;
  const result = await build({
    entryPoints: [
      join(__dirname, `fixtures/date-picker-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`),
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

async function openPicker(stack: Stack, options: object, { dir = 'ltr' } = {}): Promise<Opened> {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.setContent(`<!doctype html>
<html dir="${dir}"><head><style>[hidden] { display: none !important; }</style></head>
<body><div id="root"></div><script>${await bundle(stack)}</script></body></html>`);
  await page.waitForFunction(() => (window as unknown as { dateFixture?: unknown }).dateFixture);
  await page.evaluate(
    (o) => (window as unknown as { dateFixture: { mount(o: object): void } }).dateFixture.mount(o),
    options,
  );
  await settle(page);
  return { page, errors };
}

const fixtureCall = <T>(page: Page, method: 'get' | 'events', ...args: unknown[]) =>
  page.evaluate(
    ([m, a]) => {
      const f = (window as unknown as { dateFixture: Record<string, unknown> }).dateFixture;
      const value =
        typeof f[m as string] === 'function'
          ? (f[m as string] as (...x: unknown[]) => unknown)(...(a as unknown[]))
          : f[m as string];
      return JSON.parse(JSON.stringify(value ?? null));
    },
    [method, args] as const,
  ) as Promise<T>;

const setValue = async (page: Page, value: unknown) => {
  await page.evaluate(
    (v) => (window as unknown as { dateFixture: { set(v: unknown): unknown } }).dateFixture.set(v),
    value,
  );
  await settle(page);
};

const focusedDay = (page: Page) =>
  page.evaluate(() => document.activeElement?.getAttribute('data-value') ?? null);

/** Every part's attributes, without event handler noise, for the cross-stack comparison. */
const snapshot = (page: Page) =>
  page.$$eval('[data-scope="date-picker"][data-part]', (els) =>
    els.map((el) => {
      const attrs: Record<string, string> = {};
      for (const { name, value } of Array.from(el.attributes)) {
        // Machine-generated row and cell ids, inline positioning and Alpine's own attributes vary.
        if (name === 'style' || name.startsWith('x-') || name.startsWith(':')) continue;
        if (name === 'id' && !value.startsWith('dp')) continue;
        // React and Vue reflect the input's value as an attribute; Alpine sets the property.
        if (name === 'wire:ignore' || name === 'value') continue;
        attrs[name] = value;
      }
      return attrs;
    }),
  );

afterAll(close);

describe.each(['react', 'vue'] as const)('date picker (%s)', (stack) => {
  it('renders the parts with ARIA and the value', async () => {
    const { page, errors } = await openPicker(stack, { initial: '2026-11-12' });
    expect(await page.$eval('#dp-label', (el) => el.getAttribute('for'))).toBe('dp-input');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '11/12/2026',
    );
    expect(await page.$eval('#dp-table', (el) => el.getAttribute('role'))).toBe('grid');
    expect(await page.$eval('[data-part="range-text"]', (el) => el.textContent)).toBe(
      'November 2026',
    );
    expect(
      await page.$eval('[data-part="table-cell-trigger"][data-selected]', (el) =>
        el.getAttribute('data-value'),
      ),
    ).toBe('2026-11-12');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('selects with the keyboard and reports ISO through the callback', async () => {
    const { page } = await openPicker(stack, { initial: '2026-11-12' });
    await page.click('#dp-trigger');
    await settle(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await fixtureCall(page, 'get')).toBe('2026-11-13');
    expect(await fixtureCall<[string, unknown][]>(page, 'events')).toContainEqual([
      'value-change',
      { value: '2026-11-13' },
    ]);
    await page.close();
  });

  it('keeps the calendar open when the text input is pressed', async () => {
    const { page } = await openPicker(stack, { initial: '2026-11-12' });
    await page.click('#dp-trigger');
    await settle(page);
    await page.click('#dp-input');
    await settle(page);
    await page.waitForTimeout(50);
    expect(await page.$eval('#dp-content', (el) => !el.hasAttribute('hidden'))).toBe(true);
    await page.close();
  });

  it('returns focus to the text input after picking a day', async () => {
    const { page } = await openPicker(stack, { initial: '2026-11-12' });
    await page.click('#dp-trigger');
    await settle(page);
    await page.click('[data-part="table-cell-trigger"][data-value="2026-11-20"]');
    await settle(page);
    await settle(page);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('dp-input');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '11/20/2026',
    );
    await page.click('#dp-trigger');
    await settle(page);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');
    await settle(page);
    await settle(page);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('dp-input');
    await page.close();
  });

  it('follows the text direction in RTL', async () => {
    const { page } = await openPicker(stack, { initial: '2026-11-12' }, { dir: 'rtl' });
    await page.click('#dp-trigger');
    await settle(page);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedDay(page)).toBe('2026-11-11');
    await page.close();
  });

  it('keeps an uncontrolled value of its own', async () => {
    const { page } = await openPicker(stack, { mode: 'uncontrolled', initial: '2026-11-12' });
    await page.click('#dp-trigger');
    await settle(page);
    await page.click('[data-part="table-cell-trigger"][data-value="2026-11-20"]');
    await settle(page);
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '11/20/2026',
    );
    await page.close();
  });

  it('follows the controlled value and shows its month', async () => {
    const { page } = await openPicker(stack, { initial: '2026-11-12' });
    await setValue(page, '2027-01-05');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '01/05/2027',
    );
    expect(await page.$eval('[data-part="range-text"]', (el) => el.textContent)).toBe(
      'January 2027',
    );
    await page.close();
  });

  it('selects a range and a time', async () => {
    const range = await openPicker(stack, { initial: [], picker: { mode: 'range' } });
    await range.page.click('#dp-trigger');
    await settle(range.page);
    await range.page.click(
      '[data-part="table-cell-trigger"][data-value$="-12"]:not([data-outside-range])',
    );
    await range.page.click(
      '[data-part="table-cell-trigger"][data-value$="-14"]:not([data-outside-range])',
    );
    await settle(range.page);
    const value = await fixtureCall<string[]>(range.page, 'get');
    expect(value).toHaveLength(2);
    await range.page.close();

    const time = await openPicker(stack, { initial: '2026-11-12T10:00', picker: { time: true } });
    await time.page.click('#dp-trigger');
    await settle(time.page);
    await time.page.click('[data-part="time-option"][data-value="13:30"]');
    await settle(time.page);
    expect(await fixtureCall(time.page, 'get')).toBe('2026-11-12T13:30');
    await time.page.close();
  });

  it('renders the same part attributes as the Alpine adapter', async () => {
    const framework = await openPicker(stack, {
      initial: '2026-11-12T00:00',
      picker: { time: true },
    });
    const alpine = await open(
      markup("{ locale: 'en-US', time: true, value: '2026-11-12T00:00' }", { time: true }),
    );
    const [a, b] = [await snapshot(framework.page), await snapshot(alpine.page)];
    expect(a.length).toBe(b.length);
    expect(a).toEqual(b);
    await framework.page.close();
    await alpine.page.close();
  });
});

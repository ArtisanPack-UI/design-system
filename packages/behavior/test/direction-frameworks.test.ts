/**
 * Direction from an ancestor (React and Vue): every engine widget the hooks
 * run, rendered inside `<div dir="rtl">` on a page whose `<html>` is LTR,
 * writes `dir="rtl"` on its parts and follows RTL arrow keys, as Alpine does
 * through `directionOf`. An explicit `dir` option still wins.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, launch, settle, type Stack } from './browser';

const WIDGETS = ['dialog', 'combobox', 'menu', 'tabs', 'color', 'spotlight', 'date'];

async function bundle(entry: string): Promise<string> {
  const result = await build({
    entryPoints: [join(__dirname, entry)],
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
  return result.outputFiles[0]!.text;
}

async function openIn(script: string, mount: (page: Page) => Promise<void>): Promise<Page> {
  const page = await (await launch()).newPage();
  await page.setContent(`<!doctype html>
<html dir="ltr"><head><style>[hidden] { display: none !important; }</style></head>
<body><div dir="rtl" id="wrapper"><div id="root"></div></div><script>${script}</script></body></html>`);
  await mount(page);
  await settle(page);
  await settle(page);
  return page;
}

afterAll(close);

describe.each(['react', 'vue'] as const)('direction from an ancestor (%s)', (stack: Stack) => {
  it('writes dir="rtl" on every widget inside an RTL wrapper', async () => {
    const script = await bundle(`fixtures/direction-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`);
    const page = await openIn(script, (p) =>
      p.waitForFunction(() => (window as unknown as { mounted?: boolean }).mounted).then(() => {}),
    );
    const dirs = await page.$$eval('[data-test]', (els) =>
      Object.fromEntries(els.map((el) => [el.getAttribute('data-test'), el.getAttribute('dir')])),
    );
    expect(Object.keys(dirs).sort()).toEqual([...WIDGETS, 'toaster'].sort());
    for (const widget of WIDGETS) expect(dirs[widget], widget).toBe('rtl');
    // The toast region is fixed to the viewport, one per placement for the
    // page: it follows <html dir>.
    expect(dirs.toaster).toBe('ltr');
    await page.close();
  });

  it('moves the date picker by RTL arrow keys: ArrowLeft is the next day', async () => {
    const script = await bundle(
      `fixtures/date-picker-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`,
    );
    const page = await openIn(script, async (p) => {
      await p.waitForFunction(() => (window as unknown as { dateFixture?: unknown }).dateFixture);
      await p.evaluate(() =>
        (window as unknown as { dateFixture: { mount(o: object): void } }).dateFixture.mount({
          initial: '2026-11-12',
        }),
      );
    });
    expect(await page.$eval('#dp-table', (el) => el.getAttribute('dir'))).toBe('rtl');
    await page.click('#dp-trigger');
    await settle(page);
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await page.evaluate(() => document.activeElement?.getAttribute('data-value'))).toBe(
      '2026-11-13',
    );
    await page.close();
  });

  it('keeps an explicit dir over the measured one', async () => {
    const script = await bundle(
      `fixtures/date-picker-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`,
    );
    const page = await openIn(script, async (p) => {
      await p.waitForFunction(() => (window as unknown as { dateFixture?: unknown }).dateFixture);
      await p.evaluate(() =>
        (window as unknown as { dateFixture: { mount(o: object): void } }).dateFixture.mount({
          initial: '2026-11-12',
          picker: { dir: 'ltr' },
        }),
      );
    });
    expect(await page.$eval('#dp-table', (el) => el.getAttribute('dir'))).toBe('ltr');
    await page.close();
  });
});

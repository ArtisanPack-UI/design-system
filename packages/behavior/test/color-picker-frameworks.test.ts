/**
 * ColorPicker through the React adapter (#53): a controlled parent keeps
 * what the area (pointer and keyboard), the sliders and the swatches pick,
 * as well as typed text; an uncontrolled one too.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, launch, settle } from './browser';

let script: string | undefined;

async function bundle(): Promise<string> {
  if (script) return script;
  const result = await build({
    entryPoints: [join(__dirname, 'fixtures/color-picker-react.tsx')],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    jsx: 'automatic',
    write: false,
    define: { 'process.env.NODE_ENV': '"development"' },
  });
  script = result.outputFiles[0]!.text;
  return script;
}

async function openPicker(options: object): Promise<{ page: Page; errors: string[] }> {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.setContent(`<!doctype html><html><head><style>[hidden] { display: none !important; }</style></head>
<body><div id="root"></div><script>${await bundle()}</script></body></html>`);
  await page.waitForFunction(() => (window as unknown as { colorFixture?: unknown }).colorFixture);
  await page.evaluate(
    (o) =>
      (window as unknown as { colorFixture: { mount(o: object): void } }).colorFixture.mount(o),
    options,
  );
  await settle(page);
  return { page, errors };
}

const parentValue = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { colorFixture: { value: string } }).colorFixture.value,
  );
const inputText = (page: Page) => page.$eval('#cp-input', (el) => (el as HTMLInputElement).value);

afterAll(close);

describe('color picker (React, controlled)', () => {
  it('keeps a color picked in the area with the pointer', async () => {
    const { page, errors } = await openPicker({});
    expect(await inputText(page)).toBe('#1f74bf');
    const box = (await page.$eval('[data-part="area"]', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    }))!;
    await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.6);
    await settle(page);
    const picked = await parentValue(page);
    expect(picked).not.toBe('#1f74bf');
    expect(await inputText(page)).toBe(picked);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('keeps a color moved with the area thumb and the hue slider keys', async () => {
    const { page } = await openPicker({});
    await page.focus('[data-part="area-thumb"]');
    await page.keyboard.press('ArrowUp');
    await settle(page);
    const afterArea = await parentValue(page);
    expect(afterArea).not.toBe('#1f74bf');
    expect(await inputText(page)).toBe(afterArea);
    await page.focus('[data-part="channel-slider-thumb"]');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await parentValue(page)).not.toBe(afterArea);
    expect(await inputText(page)).toBe(await parentValue(page));
    await page.close();
  });

  it('keeps a chosen swatch and typed text', async () => {
    const { page } = await openPicker({});
    await page.click('#cp-swatch-teal');
    await settle(page);
    expect(await parentValue(page)).toBe('#0b9488');
    expect(await inputText(page)).toBe('#0b9488');
    await page.fill('#cp-input', '#00ff00');
    await page.press('#cp-input', 'Enter');
    await settle(page);
    expect(await parentValue(page)).toBe('#00ff00');
    await page.close();
  });

  it('works uncontrolled too', async () => {
    const { page } = await openPicker({ controlled: false });
    await page.click('#cp-swatch-teal');
    await settle(page);
    expect(await inputText(page)).toBe('#0b9488');
    await page.close();
  });
});

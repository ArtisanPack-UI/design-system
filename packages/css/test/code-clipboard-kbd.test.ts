/**
 * Code, Clipboard and Kbd (#65) in a real browser (Chromium): Code's LTR,
 * unwrapped lines with numbers outside the text, Clipboard's hidden live
 * region and the icon button's tooltip, the copy field's joined edges, and
 * Kbd's sizes and RTL order.
 */
import { chromium, type Browser, type Page } from 'playwright';

import { bundle } from '../build.mjs';

const apui = bundle();
let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
});

async function open(body: string, htmlAttributes = 'data-theme="light"'): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${apui}</style></head><body>${body}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string, pseudo?: string) =>
  page.$eval(
    selector,
    (element, [prop, pseudoElement]) =>
      getComputedStyle(element, pseudoElement ?? undefined)
        .getPropertyValue(prop!)
        .trim(),
    [property, pseudo] as const,
  );

const box = (page: Page, selector: string) =>
  page.$eval(selector, (element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });

const CODE = `
  <div id="code" class="apui-code" data-numbered style="inline-size: 240px">
    <div data-scope="code" data-part="header">
      <span id="file" data-scope="code" data-part="file">a.ts</span>
      <button id="copy" class="apui-button" data-scope="code" data-part="copy" data-variant="ghost" data-color="neutral" data-size="xs" data-state="idle"><span data-scope="button" data-part="label">Copy</span></button>
    </div>
    <pre id="pre" data-scope="code" data-part="pre" role="region" aria-label="a.ts" tabindex="0"><code><span id="l1" data-scope="code" data-part="line" data-n="1">const veryLongName = someFunction(argumentOne, argumentTwo, argumentThree);</span><span id="l2" data-scope="code" data-part="line" data-n="2"></span><span id="l3" data-scope="code" data-part="line" data-n="3" data-highlight>  return a;</span></code></pre>
  </div>`;

describe('Code', () => {
  it('keeps the code LTR and unwrapped in an RTL page, and scrolls instead', async () => {
    const page = await open(CODE, 'data-theme="light" dir="rtl"');
    expect(await style(page, '#pre', 'direction')).toBe('ltr');
    expect(await style(page, '#l1', 'white-space')).toBe('pre');
    const pre = await page.$eval('#pre', (el) => ({
      scroll: el.scrollWidth,
      client: el.clientWidth,
    }));
    expect(pre.scroll).toBeGreaterThan(pre.client);
    // The header mirrors: the file name sits at the right edge in RTL.
    const file = await box(page, '#file');
    const copy = await box(page, '#copy');
    expect(file.x).toBeGreaterThan(copy.x);
    await page.close();
  });

  it('draws line numbers outside the text, gives empty lines a height and marks highlights', async () => {
    const page = await open(CODE);
    expect(await style(page, '#l1', 'content', '::before')).toBe('"1"');
    expect(await style(page, '#l1', 'user-select', '::before')).toBe('none');
    expect(await page.$eval('#l1', (el) => el.textContent)).not.toMatch(/^1/);
    expect((await box(page, '#l2')).height).toBe(20);
    expect(await style(page, '#l3', 'background-color')).not.toBe(
      await style(page, '#l1', 'background-color'),
    );
    expect(await style(page, '#l3', 'box-shadow')).toContain('inset');
    await page.close();
  });

  it('turns the copied button the success color', async () => {
    const page = await open(CODE);
    const idle = await style(page, '#copy', 'color');
    await page.$eval('#copy', (el) => el.setAttribute('data-state', 'copied'));
    // The button's color transitions.
    await page.waitForTimeout(400);
    expect(await style(page, '#copy', 'color')).not.toBe(idle);
    await page.close();
  });

  it('sets inline code in the mono font, isolated LTR', async () => {
    const page = await open(
      '<p dir="rtl">مرحبا <code id="c" class="apui-code" data-inline>data-theme="dark"</code></p>',
    );
    expect(await style(page, '#c', 'direction')).toBe('ltr');
    expect(await style(page, '#c', 'unicode-bidi')).toBe('isolate');
    expect(await style(page, '#c', 'display')).toBe('inline');
    await page.close();
  });
});

const clipboard = (variant: string, state = 'idle', size = 'sm') => `
  <span id="root" class="apui-clipboard" data-scope="clipboard" data-part="root" data-variant="${variant}" data-size="${size}" data-state="${state}" style="margin: 40px">
    ${variant === 'field' ? '<span id="field" data-scope="clipboard" data-part="field"><span data-scope="clipboard" data-part="value">https://horizonhomes.com/l/grove-greenfield</span></span>' : ''}
    <button id="button" class="apui-button" data-scope="clipboard" data-part="button" data-variant="${variant === 'icon' ? 'ghost' : 'outline'}" data-color="neutral" data-size="${size}" data-state="${state}"><span data-scope="button" data-part="label">Copy</span></button>
    <span id="tip" data-scope="clipboard" data-part="tooltip" role="status">${state === 'idle' ? '' : 'Copied to clipboard'}</span>
  </span>`;

describe('Clipboard', () => {
  it('keeps the live region hidden for the labeled button', async () => {
    const page = await open(clipboard('button', 'copied'));
    expect((await box(page, '#tip')).width).toBeLessThanOrEqual(1);
    await page.close();
  });

  it('shows the icon button confirmation as a tooltip below it', async () => {
    const page = await open(clipboard('icon', 'copied'));
    const tip = await box(page, '#tip');
    const button = await box(page, '#button');
    expect(tip.width).toBeGreaterThan(40);
    expect(tip.y).toBeGreaterThan(button.y + button.height);
    // Centered under the button.
    expect(Math.abs(tip.x + tip.width / 2 - (button.x + button.width / 2))).toBeLessThan(1);
    await page.close();
  });

  it('centers the tooltip in RTL too', async () => {
    const page = await open(clipboard('icon', 'failed'), 'data-theme="light" dir="rtl"');
    const tip = await box(page, '#tip');
    const button = await box(page, '#button');
    expect(Math.abs(tip.x + tip.width / 2 - (button.x + button.width / 2))).toBeLessThan(1);
    await page.close();
  });

  it('joins the copy field to its button at the size height', async () => {
    const page = await open(
      `<div style="inline-size: 400px">${clipboard('field', 'idle', 'md')
        .replace('<span id="root"', '<div id="root"')
        .replace(/<\/span>\s*$/, '</div>')}</div>`,
    );
    const field = await box(page, '#field');
    const button = await box(page, '#button');
    expect(field.height).toBe(36);
    expect(button.height).toBe(36);
    expect(Math.round(button.x)).toBe(Math.round(field.x + field.width - 1));
    expect(await style(page, '#button', 'border-start-start-radius')).toBe('0px');
    expect(await style(page, '#field', 'border-start-end-radius')).toBe('0px');
    await page.close();
  });
});

describe('Kbd', () => {
  const combo = (size = 'md') =>
    `<kbd id="combo" class="apui-kbd-combo" data-scope="kbd" data-part="combo"><kbd id="a" class="apui-kbd" data-scope="kbd" data-part="key" data-size="${size}">Ctrl</kbd><kbd id="b" class="apui-kbd" data-scope="kbd" data-part="key" data-size="${size}">K</kbd></kbd>`;

  it('sizes the caps from the spec', async () => {
    const page = await open(`${combo('md')}<br>${combo('sm').replace(/id="/g, 'id="s')}`);
    expect((await box(page, '#b')).height).toBe(22);
    expect((await box(page, '#b')).width).toBe(22);
    expect((await box(page, '#sb')).height).toBe(18);
    expect(await style(page, '#a', 'border-bottom-width')).toBe('2px');
    expect(await style(page, '#a', 'font-family')).toContain('mono');
    await page.close();
  });

  it('keeps the key order in RTL', async () => {
    const page = await open(combo(), 'data-theme="light" dir="rtl"');
    expect((await box(page, '#a')).x).toBeLessThan((await box(page, '#b')).x);
    await page.close();
  });
});

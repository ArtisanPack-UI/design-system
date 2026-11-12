/**
 * Icon, Swap and Carousel (#65) in a real browser (Chromium): icon sizes,
 * tiles and RTL mirroring; Swap's native :checked swap, target and focus;
 * Carousel's header and overlay layouts and its dots.
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
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${apui}</style></head><body style="margin:0">${body}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

const svg = '<svg viewBox="0 0 24 24"><path d="M5 12h14" /></svg>';

describe('Icon', () => {
  it('sizes the glyph 14, 16, 20 and 24px', async () => {
    const page = await open(
      ['sm', 'md', 'lg', 'xl']
        .map((size) => `<span id="${size}" class="apui-icon" data-size="${size}">${svg}</span>`)
        .join(''),
    );
    for (const [size, px] of [
      ['sm', '14px'],
      ['md', '16px'],
      ['lg', '20px'],
      ['xl', '24px'],
    ]) {
      expect(await style(page, `#${size} > svg`, 'width'), size).toBe(px);
      expect(await style(page, `#${size}`, 'height'), size).toBe(px);
    }
    await page.close();
  });

  it('draws a tile 32, 40, 48 and 56px around the glyph, neutral unless colored', async () => {
    const page = await open(`
      <span id="sm" class="apui-icon apui-icon-tile" data-variant="tile" data-size="sm">${svg}</span>
      <span id="md" class="apui-icon apui-icon-tile" data-variant="tile" data-size="md">${svg}</span>
      <span id="lg" class="apui-icon apui-icon-tile" data-variant="tile" data-size="lg">${svg}</span>
      <span id="xl" class="apui-icon apui-icon-tile" data-variant="tile" data-size="xl">${svg}</span>
      <span id="primary" class="apui-icon apui-icon-tile" data-variant="tile" data-size="md" data-color="primary">${svg}</span>
      <span id="plain" class="apui-icon" data-size="md" data-color="primary">${svg}</span>`);
    expect(await style(page, '#sm', 'width')).toBe('32px');
    expect(await style(page, '#sm > svg', 'width')).toBe('16px');
    expect(await style(page, '#md', 'width')).toBe('40px');
    expect(await style(page, '#md > svg', 'width')).toBe('16px');
    expect(await style(page, '#lg', 'width')).toBe('48px');
    expect(await style(page, '#lg > svg', 'width')).toBe('20px');
    expect(await style(page, '#xl', 'width')).toBe('56px');
    expect(await style(page, '#xl > svg', 'width')).toBe('24px');
    const neutral = await style(page, '#md', 'background-color');
    const primary = await style(page, '#primary', 'background-color');
    expect(primary).not.toBe(neutral);
    expect(await style(page, '#primary', 'color')).not.toBe(await style(page, '#md', 'color'));
    expect(await style(page, '#plain', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    await page.close();
  });

  it('gives a tile an edge in high contrast only', async () => {
    const tile = `<span id="t" class="apui-icon apui-icon-tile" data-variant="tile">${svg}</span>`;
    const light = await open(tile);
    expect(await style(light, '#t', 'outline-width')).toBe('0px');
    await light.close();
    const contrast = await open(tile, 'data-theme="high-contrast"');
    expect(await style(contrast, '#t', 'outline-width')).toBe('1px');
    await contrast.close();
  });

  it('mirrors only marked icons, only in RTL', async () => {
    const body = `<span id="m" class="apui-icon" data-mirror>${svg}</span><span id="n" class="apui-icon">${svg}</span>`;
    const ltr = await open(body);
    expect(await style(ltr, '#m > svg', 'scale')).toBe('none');
    await ltr.close();
    const rtl = await open(body, 'data-theme="light" dir="rtl"');
    expect(await style(rtl, '#m > svg', 'scale')).toBe('-1 1');
    expect(await style(rtl, '#n > svg', 'scale')).toBe('none');
    await rtl.close();
  });
});

const swap = (attributes = '', state = '') => `
  <label id="s" class="apui-swap" data-scope="swap" data-part="root" data-size="md" data-transition="fade" ${attributes}>
    <input id="c" type="checkbox" data-scope="swap" data-part="control" aria-label="Dark mode" ${state}>
    <span id="on" data-scope="swap" data-part="on" aria-hidden="true">${svg}</span>
    <span id="off" data-scope="swap" data-part="off" aria-hidden="true">${svg}</span>
  </label>`;

describe('Swap', () => {
  it('shows off, then on, from the native checkbox alone', async () => {
    const page = await open(swap());
    expect(await style(page, '#off', 'opacity')).toBe('1');
    expect(await style(page, '#on', 'opacity')).toBe('0');
    await page.click('#s');
    await page.waitForFunction(
      () => getComputedStyle(document.querySelector('#on')!).opacity === '1',
    );
    expect(await page.$eval('#c', (el) => (el as HTMLInputElement).checked)).toBe(true);
    await page.close();
  });

  it('is a square target at the control heights, stacking both contents', async () => {
    const page = await open(swap());
    expect(await style(page, '#s', 'width')).toBe('36px');
    expect(await style(page, '#s', 'height')).toBe('36px');
    expect(await style(page, '#c', 'opacity')).toBe('0');
    const [on, off] = await Promise.all([
      page.$eval('#on', (el) => el.getBoundingClientRect().left),
      page.$eval('#off', (el) => el.getBoundingClientRect().left),
    ]);
    expect(on).toBe(off);
    await page.close();
  });

  it('rotates the hidden content with transition=rotate, and not under reduced motion', async () => {
    const page = await open(swap().replace('data-transition="fade"', 'data-transition="rotate"'));
    expect(await style(page, '#on', 'rotate')).toBe('-90deg');
    expect(await style(page, '#on', 'transition-duration')).not.toBe('0s');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await style(page, '#on', 'transition-duration')).toMatch(/^0s(, 0s)?$/);
    await page.close();
  });

  it('rings the target while the checkbox has keyboard focus', async () => {
    const page = await open(`<button id="before">x</button>${swap()}`);
    await page.focus('#before');
    await page.keyboard.press('Tab');
    expect(await style(page, '#s', 'box-shadow')).not.toBe('none');
    await page.close();
  });

  it('dims to the disabled text color', async () => {
    const page = await open(
      swap('data-disabled', 'disabled') +
        `<span id="t" style="color: var(--apui-text-disabled)">t</span>`,
    );
    expect(await style(page, '#s', 'color')).toBe(await style(page, '#t', 'color'));
    await page.close();
  });
});

const slides = [0, 1, 2, 3]
  .map(
    (i) =>
      `<div data-scope="carousel" data-part="item" style="flex: 0 0 auto; max-width: 100%; scroll-snap-align: start"><div style="block-size: 80px">${i}</div></div>`,
  )
  .join('');
const track = `<div id="g" data-scope="carousel" data-part="item-group" style="display: grid; gap: var(--slide-spacing); grid-auto-flow: column; grid-auto-columns: var(--slide-item-size); overflow-x: auto">${slides}</div>`;
const rootStyle = (perPage: number) =>
  `--slides-per-page: ${perPage}; --slide-spacing: 12px; --slide-item-size: calc(100% / var(--slides-per-page) - var(--slide-spacing) * (var(--slides-per-page) - 1) / var(--slides-per-page))`;
const button = (part: string) =>
  `<button id="${part}" class="apui-button" data-variant="soft" data-color="neutral" data-size="sm" data-icon-only data-scope="carousel" data-part="${part}" aria-label="${part}"></button>`;

describe('Carousel', () => {
  it('overlays the buttons on the viewport edges without a header, insetting the track', async () => {
    const page = await open(`
      <div id="r" class="apui-carousel" style="${rootStyle(1)}; inline-size: 600px">
        <div id="v" data-scope="carousel" data-part="viewport">${track}${button('prev-trigger')}${button('next-trigger')}</div>
      </div>`);
    expect(await style(page, '#v', 'padding-left')).toBe('52px');
    expect(await style(page, '#prev-trigger', 'position')).toBe('absolute');
    expect(await style(page, '#v', 'overflow')).toBe('hidden');
    const width = await page.$eval('#g > div', (el) => el.getBoundingClientRect().width);
    expect(width).toBe(600 - 104);
    await page.close();
  });

  it('puts the buttons in the header and lets the next slide peek', async () => {
    const page = await open(`
      <div id="r" class="apui-carousel" style="${rootStyle(3.15)}; inline-size: 1000px">
        <div data-scope="carousel" data-part="header"><h3 id="t" data-scope="carousel" data-part="title">Featured</h3>${button('prev-trigger')}${button('next-trigger')}</div>
        <div id="v" data-scope="carousel" data-part="viewport">${track}</div>
      </div>`);
    expect(await style(page, '#v', 'padding-left')).toBe('0px');
    expect(await style(page, '#prev-trigger', 'position')).not.toBe('absolute');
    expect(await style(page, '#t', 'margin-right')).not.toBe('0px');
    const widths = await page.$$eval('#g > div', (els) =>
      els.map((el) => el.getBoundingClientRect()),
    );
    // Three whole slides, and the fourth starts inside the view.
    expect(widths[2]!.right).toBeLessThan(1000);
    expect(widths[3]!.left).toBeLessThan(1000);
    expect(widths[3]!.right).toBeGreaterThan(1000);
    await page.close();
  });

  it('draws a wider primary pill for the current dot, in a 24px target', async () => {
    const page = await open(`
      <div data-scope="carousel" data-part="indicator-group">
        <button id="a" data-scope="carousel" data-part="indicator" aria-current="true"></button>
        <button id="b" data-scope="carousel" data-part="indicator"></button>
      </div>`);
    expect(await style(page, '#b', 'height')).toBe('24px');
    expect(await style(page, '#a', 'width')).toBe('32px');
    const current = await page.$eval(
      '#a',
      (el) => getComputedStyle(el, '::before').backgroundColor,
    );
    const other = await page.$eval('#b', (el) => getComputedStyle(el, '::before').backgroundColor);
    expect(current).not.toBe(other);
    await page.close();
  });

  it('peeks at the inline end in RTL', async () => {
    const page = await open(
      `<div class="apui-carousel" style="${rootStyle(3.15)}; inline-size: 1000px"><div data-scope="carousel" data-part="header"></div><div data-scope="carousel" data-part="viewport">${track}</div></div>`,
      'data-theme="light" dir="rtl"',
    );
    const rects = await page.$$eval('#g > div', (els) =>
      els.map((el) => el.getBoundingClientRect()),
    );
    const root = await page.$eval('.apui-carousel', (el) => el.getBoundingClientRect());
    expect(rects[0]!.right).toBe(root.right);
    expect(rects[3]!.left).toBeLessThan(root.left);
    expect(rects[3]!.right).toBeGreaterThan(root.left);
    await page.close();
  });
});

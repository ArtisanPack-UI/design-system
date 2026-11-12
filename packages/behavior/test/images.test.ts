/**
 * ImageGallery's lightbox and ImageSlider's carousel (#61) through the Alpine
 * adapter and the React and Vue hooks: dialog ARIA and focus return, arrow
 * keys that follow the text direction, the index and its events, carousel
 * ARIA, indicators and thumbs, and the components' scopes on every part.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, data, launch, morph, open, setData, settle } from './browser';
import { IMAGES, IMAGES_CSS } from './fixtures/images-shared';

const images = JSON.stringify(IMAGES).replace(/"/g, '&quot;');

const galleryMarkup = () => `
<div id="g" x-data="apuiLightbox({ images: ${images} })">
  ${IMAGES.map(
    (image, i) =>
      `<button id="g-trigger-${i}" x-apui:trigger="{ index: ${i} }"><img src="${image.src}" alt="${image.alt}"></button>`,
  ).join('')}
  <div id="g-backdrop" x-apui:backdrop></div>
  <div id="g-positioner" x-apui:positioner>
    <div id="g-content" x-apui:content>
      <h2 id="g-title" x-apui:title x-text="title"></h2>
      <button id="g-close" x-apui:close-trigger aria-label="Close">×</button>
      <img id="g-image" x-apui:image>
      <button id="g-prev" x-apui:prev-trigger aria-label="Previous photo">‹</button>
      <button id="g-next" x-apui:next-trigger aria-label="Next photo">›</button>
      ${IMAGES.map(
        (image, i) =>
          `<button id="g-thumb-${i}" x-apui:thumb="{ index: ${i} }"><img src="${image.src}" alt="${image.alt}"></button>`,
      ).join('')}
    </div>
  </div>
</div>`;

const sliderMarkup = () => `
<div id="c" aria-label="Tour" x-data="apuiCarousel({ scope: 'image-slider', slideCount: 3, labels: { previous: 'Previous photo', next: 'Next photo', indicator: 'Photo {index}' } })" x-apui:root>
  <div id="c-group" x-apui:item-group>
    ${IMAGES.map(
      (image, i) =>
        `<div id="c-item-${i}" x-apui:item="{ index: ${i} }"><img src="${image.src}" alt="${image.alt}"></div>`,
    ).join('')}
  </div>
  <button id="c-prev" x-apui:prev-trigger>‹</button>
  <button id="c-next" x-apui:next-trigger>›</button>
  <span id="c-progress" x-apui:progress-text x-text="progressText"></span>
  <div id="c-indicators" x-apui:indicator-group>
    ${IMAGES.map((_, i) => `<button id="c-indicator-${i}" x-apui:indicator="{ index: ${i} }"></button>`).join('')}
  </div>
  ${IMAGES.map(
    (image, i) =>
      `<button id="c-thumb-${i}" x-apui:thumb="{ index: ${i} }"><img src="${image.src}" alt="${image.alt}"></button>`,
  ).join('')}
</div>`;

const body = () => `<style>${IMAGES_CSS}</style>${galleryMarkup()}${sliderMarkup()}`;

const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const attr = (page: Page, selector: string, name: string) =>
  page.$eval(selector, (el, n) => el.getAttribute(n), name);
const current = (page: Page, prefix: string) =>
  page.$$eval(`[id^="${prefix}"][aria-current="true"]`, (els) => els.map((el) => el.id));
const text = (page: Page, selector: string) =>
  page.$eval(selector, (el) => el.textContent?.trim() ?? '');

/** Waits until the carousel shows `index` (its scroll settles). */
async function shows(page: Page, index: number) {
  await page.waitForFunction(
    (i) => document.querySelector(`#c-indicator-${i}`)?.getAttribute('aria-current') === 'true',
    index,
  );
  await settle(page);
}

afterAll(close);

/** The checks every stack passes, from the rendered DOM only. */
function sharedChecks(load: (dir?: string) => Promise<{ page: Page; errors: string[] }>) {
  it('opens on the clicked item: dialog ARIA, the image, the counter and the current thumb', async () => {
    const { page, errors } = await load();
    expect(await page.$eval('#g-content', (el) => (el as HTMLElement).hidden)).toBe(true);
    expect(await attr(page, '#g-trigger-1', 'aria-haspopup')).toBe('dialog');
    await page.click('#g-trigger-1');
    await settle(page);
    expect(await page.$eval('#g-content', (el) => (el as HTMLElement).hidden)).toBe(false);
    expect(await attr(page, '#g-content', 'role')).toBe('dialog');
    expect(await attr(page, '#g-content', 'aria-labelledby')).toBe('g-title');
    expect(await text(page, '#g-title')).toBe('2 / 3 · The roof terrace');
    expect(await attr(page, '#g-image', 'alt')).toBe('Roof');
    expect(await current(page, 'g-thumb-')).toEqual(['g-thumb-1']);
    expect(
      await page.evaluate(() =>
        document.getElementById('g-content')!.contains(document.activeElement),
      ),
    ).toBe(true);
    const scopes = await page.$$eval('#g [data-part]', (els) => [
      ...new Set(els.map((el) => el.getAttribute('data-scope'))),
    ]);
    expect(scopes).toEqual(['image-gallery']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('steps with the arrow keys, wrapping, and Home and End; Escape returns focus to the item', async () => {
    const { page } = await load();
    await page.click('#g-trigger-1');
    await settle(page);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Street');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Lobby');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Street');
    await page.keyboard.press('Home');
    await settle(page);
    expect(await current(page, 'g-thumb-')).toEqual(['g-thumb-0']);
    await page.keyboard.press('End');
    await settle(page);
    expect(await text(page, '#g-title')).toBe('3 / 3 · The street at night');
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await page.$eval('#g-content', (el) => (el as HTMLElement).hidden)).toBe(true);
    expect(await focusedId(page)).toBe('g-trigger-1');
    await page.close();
  });

  it('follows the text direction in RTL: ArrowLeft shows the next image', async () => {
    const { page } = await load('rtl');
    await page.click('#g-trigger-0');
    await settle(page);
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Roof');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Lobby');
    await page.close();
  });

  it('moves with the previous and next buttons and the thumbs', async () => {
    const { page } = await load();
    await page.click('#g-trigger-0');
    await settle(page);
    await page.click('#g-next');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Roof');
    await page.click('#g-prev');
    await page.click('#g-prev');
    await settle(page);
    expect(await attr(page, '#g-image', 'alt')).toBe('Street');
    await page.click('#g-thumb-1');
    await settle(page);
    expect(await current(page, 'g-thumb-')).toEqual(['g-thumb-1']);
    await page.click('#g-close');
    await settle(page);
    expect(await page.$eval('#g-content', (el) => (el as HTMLElement).hidden)).toBe(true);
    await page.close();
  });

  it('renders carousel ARIA scoped image-slider, with aria-current on the indicator shown', async () => {
    const { page, errors } = await load();
    expect(await attr(page, '#c', 'role')).toBe('region');
    expect(await attr(page, '#c', 'aria-roledescription')).toBe('carousel');
    expect(await attr(page, '#c-item-0', 'aria-roledescription')).toBe('slide');
    expect(await attr(page, '#c-item-1', 'aria-label')).toBe('2 of 3');
    expect(await attr(page, '#c-prev', 'aria-label')).toBe('Previous photo');
    expect(await attr(page, '#c-indicator-2', 'aria-label')).toBe('Photo 3');
    expect(await current(page, 'c-indicator-')).toEqual(['c-indicator-0']);
    expect(await current(page, 'c-thumb-')).toEqual(['c-thumb-0']);
    expect(await text(page, '#c-progress')).toBe('1 / 3');
    const scopes = await page.$$eval('#c [data-part], #c', (els) => [
      ...new Set(els.map((el) => el.getAttribute('data-scope'))),
    ]);
    expect(scopes).toEqual(['image-slider']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('moves with the next trigger and the thumbs, and the indicators follow the text direction', async () => {
    const { page } = await load('rtl');
    await page.click('#c-next');
    await shows(page, 1);
    expect(await text(page, '#c-progress')).toBe('2 / 3');
    expect(await current(page, 'c-thumb-')).toEqual(['c-thumb-1']);
    await page.click('#c-thumb-2');
    await shows(page, 2);
    await page.focus('#c-indicator-2');
    // RTL: ArrowRight goes back.
    await page.keyboard.press('ArrowRight');
    await shows(page, 1);
    await page.keyboard.press('Home');
    await shows(page, 0);
    await page.close();
  });
}

describe('images (Alpine)', () => {
  const load = (dir = 'ltr') => open(body(), { dir });
  sharedChecks(load);

  it('binds open and index as Alpine data, and dispatches open-change and index-change', async () => {
    const { page } = await load();
    await page.evaluate(() => {
      const w = window as unknown as { events: unknown[] };
      w.events = [];
      for (const name of ['open-change', 'index-change']) {
        document
          .querySelector('#g')!
          .addEventListener(name, (event) => w.events.push([name, (event as CustomEvent).detail]));
      }
    });
    await setData(page, '#g', 'index', 2);
    await setData(page, '#g', 'open', true);
    expect(await page.$eval('#g-content', (el) => (el as HTMLElement).hidden)).toBe(false);
    expect(await attr(page, '#g-image', 'alt')).toBe('Street');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await page.evaluate(() => (window as unknown as { events: unknown[] }).events)).toEqual([
      ['index-change', { index: 0 }],
      ['open-change', { open: false }],
    ]);
    await page.close();
  });

  it('pauses autoplay while the pointer or focus is on it, unless paused by hand', async () => {
    const markup = sliderMarkup()
      .replace('slideCount: 3,', 'slideCount: 3, autoplay: true, interval: 60000,')
      .replace(
        '<button id="c-prev"',
        '<button id="c-play" x-apui:autoplay-trigger>‖</button><button id="c-prev"',
      );
    const { page } = await open(`<style>${IMAGES_CSS}</style><div id="outside">x</div>${markup}`);
    const label = () => attr(page, '#c-play', 'aria-label');
    const pressed = () => page.$eval('#c-play', (el) => el.hasAttribute('data-pressed'));
    // Zag's live region is off only while the machine rotates.
    const live = () => attr(page, '#c-group', 'aria-live');
    expect(await label()).toBe('Stop slide rotation');
    // A hover or focus holds rotation without changing the trigger (WCAG 2.2.2).
    await page.hover('#c-group');
    await settle(page);
    expect(await data(page, '#c', 'playing')).toBe(true);
    expect(await label()).toBe('Stop slide rotation');
    expect(await pressed()).toBe(true);
    expect(await live()).toBe('polite');
    await page.hover('#outside');
    await settle(page);
    expect(await label()).toBe('Stop slide rotation');
    expect(await live()).toBe('off');
    await page.focus('#c-next');
    await settle(page);
    expect(await label()).toBe('Stop slide rotation');
    // One click on the trigger, while held, stops rotation for good.
    await page.click('#c-play');
    await settle(page);
    expect(await label()).toBe('Start slide rotation');
    expect(await pressed()).toBe(false);
    expect(await data(page, '#c', 'playing')).toBe(false);
    await page.hover('#outside');
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await settle(page);
    expect(await label()).toBe('Start slide rotation');
    expect(await data(page, '#c', 'playing')).toBe(false);
    expect(await live()).toBe('polite');
    // And a click while it's off starts it.
    await page.click('#c-play');
    await settle(page);
    expect(await label()).toBe('Stop slide rotation');
    expect(await data(page, '#c', 'playing')).toBe(true);
    await page.close();
  });

  it('binds an entangled index, as $wire.entangle() passes it', async () => {
    // $wire.entangle() hands x-data an Alpine interceptor object, not a
    // number: Alpine swaps it for the real value before init() runs.
    const entangled = (value: number) => `Alpine.interceptor((initial) => initial)(${value})`;
    const { page, errors } = await open(
      `<style>${IMAGES_CSS}</style>${galleryMarkup().replace(
        `images: ${images}`,
        `images: ${images}, index: ${entangled(2)}`,
      )}${sliderMarkup().replace('slideCount: 3', `slideCount: 3, index: ${entangled(1)}`)}`,
    );
    await shows(page, 1);
    expect(await data(page, '#c', 'index')).toBe(1);
    expect(await text(page, '#c-progress')).toBe('2 / 3');
    expect(await data(page, '#g', 'index')).toBe(2);
    await setData(page, '#g', 'open', true);
    expect(await attr(page, '#g-image', 'alt')).toBe('Street');
    expect(await current(page, 'g-thumb-')).toEqual(['g-thumb-2']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('follows a bound carousel index and keeps both widgets through a morph', async () => {
    const { page, errors } = await load();
    await setData(page, '#c', 'index', 2);
    await shows(page, 2);
    await morph(page, '#c', sliderMarkup());
    await morph(page, '#g', galleryMarkup());
    expect(await current(page, 'c-indicator-')).toEqual(['c-indicator-2']);
    expect(await attr(page, '#c', 'role')).toBe('region');
    await page.click('#g-trigger-2');
    await settle(page);
    expect(await attr(page, '#g-content', 'role')).toBe('dialog');
    expect(await attr(page, '#g-image', 'alt')).toBe('Street');
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
    entryPoints: [join(__dirname, `fixtures/images-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`)],
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

async function mountStack(stack: Stack, dir = 'ltr') {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  await page.setContent(
    `<!doctype html><html dir="${dir}"><head><style>[hidden]{display:none!important}${IMAGES_CSS}</style></head><body><div id="root"></div><script>${await fixture(stack)}</script></body></html>`,
  );
  await page.evaluate(() =>
    (window as unknown as { imagesFixture: { mount(): void } }).imagesFixture.mount(),
  );
  await settle(page);
  return { page, errors };
}

describe.each(['react', 'vue'] as const)('images (%s)', (stack) => {
  sharedChecks((dir = 'ltr') => mountStack(stack, dir));

  it('reports open-change and index-change, and follows the parent index', async () => {
    const { page } = await mountStack(stack);
    await page.click('#g-trigger-1');
    await settle(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await settle(page);
    const events = await page.evaluate(
      () => (window as unknown as { imagesFixture: { events: unknown[] } }).imagesFixture.events,
    );
    expect(events).toContainEqual(['index-change', { index: 1 }]);
    expect(events).toContainEqual(['index-change', { index: 2 }]);
    expect(events).toContainEqual(['open-change', { open: false }]);
    await page.evaluate(() =>
      (
        window as unknown as { imagesFixture: { setIndex(i: number): void } }
      ).imagesFixture.setIndex(0),
    );
    await settle(page);
    expect(await current(page, 'g-thumb-')).toEqual(['g-thumb-0']);
    await page.close();
  });
});

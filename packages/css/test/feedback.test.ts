/**
 * Alert, Loading, Progress, ProgressRadial, Skeleton, EmptyState, ErrorState
 * and StreamableContent (#60) in a real browser (Chromium): states, reduced
 * motion, RTL and the parts that only CSS places.
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

async function open(
  body: string,
  htmlAttributes = 'data-theme="light"',
  reducedMotion: 'reduce' | 'no-preference' = 'no-preference',
): Promise<Page> {
  const page = await browser.newPage({ reducedMotion });
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${apui}</style></head><body>${body}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

const alert = (attributes: string, close = '') => `
  <div class="apui-alert" role="status" ${attributes}>
    <span data-scope="alert" data-part="icon" aria-hidden="true"><svg viewBox="0 0 24 24"></svg></span>
    <p data-scope="alert" data-part="title">Listing published</p>
    <div data-scope="alert" data-part="description">Lakeview Lofts is live.</div>
    ${close}
  </div>`;

describe('Alert', () => {
  it('tints soft, outlines outline and fills solid', async () => {
    const page = await open(
      `<div id="soft">${alert('data-color="success" data-variant="soft"')}</div>
       <div id="outline">${alert('data-color="success" data-variant="outline"')}</div>
       <div id="solid">${alert('data-color="success" data-variant="solid"')}</div>`,
    );
    const bg = (id: string) => style(page, `#${id} .apui-alert`, 'background-color');
    expect(await bg('soft')).not.toBe(await bg('outline'));
    expect(await bg('solid')).not.toBe(await bg('soft'));
    expect(await style(page, '#outline .apui-alert', 'border-inline-start-color')).toBe(
      await style(page, '#outline .apui-alert', 'border-inline-end-color'),
    );
    await page.close();
  });

  it('puts the close button at the end of the first row and hides a dismissed alert', async () => {
    const close =
      '<button class="apui-button" data-variant="ghost" data-color="neutral" data-size="xs" data-scope="alert" data-part="close-trigger" aria-label="Dismiss">x</button>';
    const page = await open(
      `${alert('data-color="info" id="shown"', close)}${alert('data-color="info" id="gone" hidden')}`,
    );
    expect(await style(page, '[data-part="close-trigger"]', 'grid-column-start')).toBe('3');
    expect(await style(page, '[data-part="close-trigger"]', 'grid-row-start')).toBe('1');
    expect(await style(page, '#gone', 'display')).toBe('none');
    await page.close();
  });

  it('gives the soft alert a firm edge in high contrast', async () => {
    const light = await open(alert('data-color="error"'));
    const hc = await open(alert('data-color="error"'), 'data-theme="high-contrast"');
    expect(await style(light, '.apui-alert', 'outline-width')).toBe('0px');
    expect(await style(hc, '.apui-alert', 'outline-width')).toBe('1px');
    expect(await style(hc, '.apui-alert', 'outline-color')).not.toBe('rgba(0, 0, 0, 0)');
    await light.close();
    await hc.close();
  });
});

describe('Loading', () => {
  const loading = (attributes = '', dots = false) =>
    `<span class="apui-loading" role="status" ${attributes}><span data-scope="loading" data-part="indicator" aria-hidden="true">${dots ? '<span></span><span></span><span></span>' : ''}</span><span data-scope="loading" data-part="label" class="apui-sr-only">Loading</span></span>`;

  it('sizes the spinner from data-size', async () => {
    const page = await open(
      `<div id="xs">${loading('data-size="xs"')}</div><div id="xl">${loading('data-size="xl"')}</div>`,
    );
    expect(await style(page, '#xs [data-part="indicator"]', 'width')).toBe('12px');
    expect(await style(page, '#xl [data-part="indicator"]', 'width')).toBe('40px');
    await page.close();
  });

  it('draws three dots for the dots variant, still under reduced motion', async () => {
    const page = await open(loading('data-variant="dots"', true), 'data-theme="light"', 'reduce');
    expect(await style(page, '[data-part="indicator"] > span', 'width')).toBe('6px');
    expect(await style(page, '[data-part="indicator"] > span', 'animation-name')).toBe('none');
    await page.close();
  });

  it('waits for the delay before showing', async () => {
    const page = await open(loading('style="--apui-_delay: 5000ms"'));
    expect(await style(page, '.apui-loading', 'visibility')).toBe('hidden');
    await page.close();
    const now = await open(loading('style="--apui-_delay: 0ms"'));
    await now.waitForTimeout(50);
    expect(await style(now, '.apui-loading', 'visibility')).toBe('visible');
    await now.close();
  });

  it('covers its positioned region as an overlay', async () => {
    const page = await open(
      `<div style="position: relative; width: 300px; height: 200px">${loading('data-overlay')}</div>`,
    );
    expect(await style(page, '.apui-loading', 'position')).toBe('absolute');
    expect(await style(page, '.apui-loading', 'width')).toBe('300px');
    await page.close();
  });
});

describe('Progress', () => {
  const progress = (
    attributes = '',
    track = '<div data-scope="progress" data-part="bar" style="--apui-_v: 64%"></div>',
  ) =>
    `<div class="apui-progress" role="progressbar" aria-label="Upload" style="width: 200px" ${attributes}><div data-scope="progress" data-part="track">${track}</div></div>`;

  it('fills the bar to the value and sizes the track', async () => {
    const page = await open(
      `<div id="md">${progress()}</div><div id="lg">${progress('data-size="lg"')}</div>`,
    );
    expect(await style(page, '#md [data-part="bar"]', 'width')).toBe('128px');
    expect(await style(page, '#md [data-part="track"]', 'height')).toBe('6px');
    expect(await style(page, '#lg [data-part="track"]', 'height')).toBe('10px');
    await page.close();
  });

  it('slides the indeterminate bar, and stops it under reduced motion', async () => {
    const markup = progress(
      'data-indeterminate',
      '<div data-scope="progress" data-part="bar"></div>',
    );
    const page = await open(markup);
    expect(await style(page, '[data-part="bar"]', 'animation-name')).toBe(
      'apui-progress-indeterminate',
    );
    await page.close();
    const reduced = await open(markup, 'data-theme="light"', 'reduce');
    expect(await style(reduced, '[data-part="bar"]', 'animation-name')).toBe('none');
    await reduced.close();
  });

  it('lays segments out across the track and fills the done ones', async () => {
    const bars =
      '<div data-scope="progress" data-part="bar" data-done></div><div data-scope="progress" data-part="bar"></div>';
    const page = await open(progress('data-segmented', bars));
    expect(await style(page, '[data-part="track"]', 'display')).toBe('grid');
    const [done, todo] = await page.$$eval('[data-part="bar"]', (els) =>
      els.map((el) => getComputedStyle(el).backgroundColor),
    );
    expect(done).not.toBe(todo);
    await page.close();
  });
});

describe('ProgressRadial', () => {
  const ring = `<span class="apui-progress-radial" role="progressbar" aria-label="Done" style="--apui-_s: 80px"><svg data-scope="progress-radial" data-part="svg" viewBox="0 0 80 80" aria-hidden="true"><circle data-scope="progress-radial" data-part="track" cx="40" cy="40" r="36.5" stroke-width="7"></circle></svg><span data-scope="progress-radial" data-part="value">68%</span></span>`;

  it('sizes from --apui-_s and scales the value', async () => {
    const page = await open(ring);
    expect(await style(page, '.apui-progress-radial', 'width')).toBe('80px');
    expect(await style(page, '[data-part="value"]', 'font-size')).toBe('19.2px');
    await page.close();
  });

  it('mirrors the ring in RTL so it fills in the reading direction', async () => {
    const ltr = await open(ring);
    expect(await style(ltr, 'svg', 'transform')).toBe('none');
    await ltr.close();
    const rtl = await open(ring, 'data-theme="light" dir="rtl"');
    expect(await style(rtl, 'svg', 'transform')).not.toBe('none');
    await rtl.close();
  });
});

describe('Skeleton', () => {
  it('draws a text line and a circle, and stops the shimmer under reduced motion', async () => {
    const markup =
      '<span class="apui-skeleton" data-shape="text" aria-hidden="true" style="width: 100px"></span><span class="apui-skeleton" data-shape="circle" aria-hidden="true" style="width: 40px; height: 40px"></span>';
    const page = await open(markup);
    expect(await style(page, '[data-shape="text"]', 'height')).toBe('10px');
    expect(await style(page, '[data-shape="circle"]', 'border-top-left-radius')).toBe('9999px');
    await page.close();
    const reduced = await open(markup, 'data-theme="light"', 'reduce');
    const shimmer = await reduced.$eval(
      '.apui-skeleton',
      (el) => getComputedStyle(el, '::after').animationName,
    );
    expect(shimmer).toBe('none');
    await reduced.close();
  });
});

describe('EmptyState and ErrorState', () => {
  const state = (root: string, scope: string, attributes: string) =>
    `<div class="${root}" ${attributes}><span data-scope="${scope}" data-part="icon" aria-hidden="true"><svg viewBox="0 0 24 24"></svg></span><h3 data-scope="${scope}" data-part="title">Title</h3><div data-scope="${scope}" data-part="description">Text</div></div>`;

  it('shares one layout and tints the tile by variant', async () => {
    const page = await open(
      `<div id="a">${state('apui-empty-state', 'empty-state', 'data-variant="first-use"')}</div>
       <div id="b">${state('apui-empty-state', 'empty-state', 'data-variant="no-results"')}</div>
       <div id="c">${state('apui-error-state', 'error-state', 'role="alert" data-variant="request"')}</div>`,
    );
    const tile = (id: string) => style(page, `#${id} [data-part="icon"]`, 'background-color');
    expect(await tile('a')).not.toBe(await tile('b'));
    expect(await tile('c')).not.toBe(await tile('b'));
    expect(await style(page, '#c [data-part="icon"]', 'width')).toBe('48px');
    expect(await style(page, '#c [data-part="title"]', 'font-size')).toBe(
      await style(page, '#a [data-part="title"]', 'font-size'),
    );
    await page.close();
  });

  it('shrinks the tile at sm and aligns to the start', async () => {
    const page = await open(
      state(
        'apui-empty-state',
        'empty-state',
        'data-variant="cleared" data-size="sm" data-align="start"',
      ),
    );
    expect(await style(page, '[data-part="icon"]', 'width')).toBe('40px');
    expect(await style(page, '.apui-empty-state', 'text-align')).toBe('start');
    await page.close();
  });
});

describe('StreamableContent', () => {
  it('blinks the caret while streaming and stops it under reduced motion', async () => {
    const markup =
      '<div class="apui-streamable-content" data-state="streaming"><div data-scope="streamable-content" data-part="content">Text<span data-scope="streamable-content" data-part="caret" aria-hidden="true"></span></div></div>';
    const page = await open(markup);
    expect(await style(page, '[data-part="caret"]', 'animation-name')).toBe(
      'apui-streamable-content-blink',
    );
    await page.close();
    const reduced = await open(markup, 'data-theme="light"', 'reduce');
    expect(await style(reduced, '[data-part="caret"]', 'animation-name')).toBe('none');
    await reduced.close();
  });
});

/**
 * Link, Breadcrumbs, Pagination and Steps (#56) in a real browser (Chromium):
 * states, RTL mirroring and the parts that only CSS places.
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

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

const chevron = '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>';

describe('Link', () => {
  it('underlines inline links and drops the underline on standalone ones', async () => {
    const page = await open(
      '<a id="inline" class="apui-link" data-tone="primary" href="#">Terms</a> <a id="standalone" class="apui-link" data-tone="primary" data-standalone href="#">View all</a>',
    );
    expect(await style(page, '#inline', 'text-decoration-line')).toBe('underline');
    expect(await style(page, '#standalone', 'text-decoration-line')).toBe('none');
    expect(await style(page, '#standalone', 'display')).toBe('inline-flex');
    await page.close();
  });

  it('mutes the color with data-tone="muted"', async () => {
    const page = await open(
      '<a id="p" class="apui-link" data-tone="primary" href="#">a</a><a id="m" class="apui-link" data-tone="muted" href="#">b</a>',
    );
    expect(await style(page, '#p', 'color')).not.toBe(await style(page, '#m', 'color'));
    await page.close();
  });

  it('styles the button form like the anchor', async () => {
    const page = await open(
      '<p><a id="a" class="apui-link" data-tone="primary" href="#">Log out</a> <button id="b" type="button" class="apui-link" data-tone="primary">Log out</button></p>',
    );
    for (const property of ['color', 'text-decoration-line', 'font-size', 'background-color']) {
      expect(await style(page, '#b', property)).toBe(await style(page, '#a', property));
    }
    expect(await style(page, '#b', 'padding-inline-start')).toBe('0px');
    await page.close();
  });

  it('mirrors a directional icon in RTL only', async () => {
    const markup = `<a class="apui-link" data-tone="primary" data-standalone href="#">Next<span data-scope="link" data-part="iconEnd" aria-hidden="true" data-mirror>${chevron}</span></a>`;
    const ltr = await open(markup);
    expect(await style(ltr, 'svg', 'scale')).toBe('none');
    await ltr.close();
    const rtl = await open(markup, 'data-theme="light" dir="rtl"');
    expect(await style(rtl, 'svg', 'scale')).toBe('-1 1');
    await rtl.close();
  });
});

describe('Breadcrumbs', () => {
  const trail = (dir = '') =>
    `<nav class="apui-breadcrumbs" aria-label="Breadcrumb" ${dir}><ol data-scope="breadcrumbs" data-part="list">
      <li data-scope="breadcrumbs" data-part="item"><a data-scope="breadcrumbs" data-part="link" href="#">Home</a></li>
      <li data-scope="breadcrumbs" data-part="item"><span data-scope="breadcrumbs" data-part="separator" aria-hidden="true" data-mirror>${chevron}</span><button type="button" data-scope="breadcrumbs" data-part="overflow" aria-label="Show 1 more levels">…</button></li>
      <li data-scope="breadcrumbs" data-part="item" hidden><span data-scope="breadcrumbs" data-part="separator" aria-hidden="true" data-mirror>${chevron}</span><a data-scope="breadcrumbs" data-part="link" href="#">Hidden</a></li>
      <li data-scope="breadcrumbs" data-part="item"><span data-scope="breadcrumbs" data-part="separator" aria-hidden="true" data-mirror>${chevron}</span><span data-scope="breadcrumbs" data-part="current" aria-current="page">Visitor</span></li>
    </ol></nav>`;

  it('lays the trail out in a row and keeps collapsed items hidden', async () => {
    const page = await open(trail());
    expect(await style(page, '[data-part="list"]', 'display')).toBe('flex');
    expect(await style(page, '[data-part="item"][hidden]', 'display')).toBe('none');
    expect(await style(page, '[data-part="list"]', 'list-style-type')).toBe('none');
    await page.close();
  });

  it('sets the current page apart from the links', async () => {
    const page = await open(trail());
    expect(await style(page, '[data-part="current"]', 'font-weight')).toBe('500');
    expect(await style(page, '[data-part="link"]', 'color')).not.toBe(
      await style(page, '[data-part="current"]', 'color'),
    );
    await page.close();
  });

  it('mirrors the separators in RTL', async () => {
    const page = await open(trail('dir="rtl"'));
    expect(await style(page, '[data-part="separator"] svg', 'scale')).toBe('-1 1');
    await page.close();
  });
});

describe('Pagination', () => {
  const pagination = `<nav class="apui-pagination" aria-label="Pagination">
    <button type="button" data-scope="pagination" data-part="previous" aria-label="Previous page" aria-disabled="true" data-mirror>${chevron}</button>
    <button type="button" id="one" data-scope="pagination" data-part="page" aria-label="Page 1">1</button>
    <button type="button" id="two" data-scope="pagination" data-part="page" aria-label="Page 2" aria-current="page">2</button>
    <span data-scope="pagination" data-part="ellipsis" aria-hidden="true">…</span>
    <button type="button" id="next" data-scope="pagination" data-part="next" aria-label="Next page" data-mirror>${chevron}</button>
  </nav>`;

  it('draws round items at the small control height', async () => {
    const page = await open(pagination);
    expect(await style(page, '#one', 'height')).toBe('28px');
    expect(await style(page, '#one', 'min-width')).toBe('28px');
    await page.close();
  });

  it('marks the current page with the selected fill and edge', async () => {
    const page = await open(pagination);
    expect(await style(page, '#two', 'background-color')).not.toBe(
      await style(page, '#one', 'background-color'),
    );
    expect(await style(page, '#two', 'box-shadow')).toContain('inset');
    await page.close();
  });

  it('greys out a disabled previous button', async () => {
    const page = await open(pagination);
    expect(await style(page, '[data-part="previous"]', 'cursor')).toBe('not-allowed');
    expect(await style(page, '[data-part="previous"]', 'color')).not.toBe(
      await style(page, '#next', 'color'),
    );
    await page.close();
  });

  it('mirrors previous and next in RTL', async () => {
    const page = await open(pagination, 'data-theme="light" dir="rtl"');
    expect(await style(page, '#next svg', 'scale')).toBe('-1 1');
    await page.close();
  });
});

describe('Steps', () => {
  const step = (state: string, title: string, current = false) =>
    `<li data-scope="steps" data-part="step" data-state="${state}"${current ? ' aria-current="step"' : ''}>
      <span data-scope="steps" data-part="marker">1</span>
      <span data-scope="steps" data-part="title">${title}</span>
      <span data-scope="steps" data-part="connector" aria-hidden="true"></span>
      <span data-scope="steps" data-part="description">Text</span>
    </li>`;
  const steps = (orientation: string) =>
    `<ol class="apui-steps" data-orientation="${orientation}">${step('complete', 'A')}${step('current', 'B', true)}${step('upcoming', 'C')}</ol>`;

  it('fills complete markers and connectors with the primary color', async () => {
    const page = await open(steps('horizontal'));
    const complete = '[data-state="complete"]';
    const upcoming = '[data-state="upcoming"]';
    expect(await style(page, `${complete} [data-part="marker"]`, 'background-color')).toBe(
      await style(page, `${complete} [data-part="connector"]`, 'background-color'),
    );
    expect(await style(page, `${upcoming} [data-part="connector"]`, 'background-color')).not.toBe(
      await style(page, `${complete} [data-part="connector"]`, 'background-color'),
    );
    await page.close();
  });

  it('draws no connector after the last step', async () => {
    const page = await open(steps('horizontal'));
    expect(await style(page, 'li:last-child [data-part="connector"]', 'display')).toBe('none');
    expect(await style(page, 'li:first-child [data-part="connector"]', 'display')).toBe('block');
    await page.close();
  });

  it('stacks vertically with the connector down the marker column', async () => {
    const page = await open(steps('vertical'));
    expect(await style(page, '.apui-steps', 'flex-direction')).toBe('column');
    expect(await style(page, 'li:first-child [data-part="connector"]', 'position')).toBe(
      'absolute',
    );
    expect(await style(page, 'li:first-child [data-part="connector"]', 'width')).toBe('2px');
    await page.close();
  });

  it('puts the connector on the start side in RTL', async () => {
    const page = await open(steps('vertical'), 'data-theme="light" dir="rtl"');
    const box = await page.$eval('li:first-child', (li) => {
      const item = li.getBoundingClientRect();
      const line = li.querySelector('[data-part="connector"]')!.getBoundingClientRect();
      return { itemEnd: item.right, lineEnd: line.right };
    });
    expect(box.itemEnd - box.lineEnd).toBeLessThan(20);
    await page.close();
  });
});

/**
 * Chart (#63) in a real browser (Chromium): series colors from data-series in
 * fixed order, the plot kept LTR in RTL pages while the header mirrors, the
 * donut's fixed plot, the hit columns of line charts, and the tooltip on the
 * overlay surface.
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

const token = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

const chart = (type: string) => `
<div class="apui-card apui-chart" data-type="${type}" style="inline-size: 600px">
  <div data-scope="chart" data-part="header">
    <div><h3 data-scope="chart" data-part="title">Title</h3></div>
    <ul id="legend" data-scope="chart" data-part="legend"><li><span id="swatch" data-scope="chart" data-part="swatch" data-series="3"></span>A</li></ul>
  </div>
  <div data-scope="chart" data-part="body">
    <svg id="plot" data-scope="chart" data-part="plot" viewBox="0 0 520 220" width="520" height="220" role="group">
      <rect id="mark" data-scope="chart" data-part="mark" data-series="2" x="0" y="0" width="10" height="10" tabindex="0" />
      <path id="line" data-scope="chart" data-part="line" data-series="6" d="M0,0 L10,10" />
    </svg>
    <div id="tooltip" data-scope="chart" data-part="tooltip"><strong id="strong">Q1</strong>4</div>
  </div>
</div>`;

describe('Chart', () => {
  it('colors series and swatches from --apui-chart-1…6 by data-series', async () => {
    const page = await open(chart('bar'));
    const rgb = (value: string) =>
      page.evaluate((v) => {
        const probe = document.createElement('i');
        probe.style.color = v;
        document.body.append(probe);
        return getComputedStyle(probe).color;
      }, value);
    expect(await style(page, '#swatch', 'background-color')).toBe(
      await rgb(await token(page, '--apui-chart-3')),
    );
    expect(await style(page, '#mark', 'fill')).toBe(await rgb(await token(page, '--apui-chart-2')));
    expect(await style(page, '#line', 'stroke')).toBe(
      await rgb(await token(page, '--apui-chart-6')),
    );
    expect(await style(page, '#line', 'fill')).toBe('none');
  });

  it('keeps the plot LTR in an RTL page, and the header mirrors', async () => {
    const page = await open(chart('bar'), 'data-theme="light" dir="rtl"');
    expect(await style(page, '#plot', 'direction')).toBe('ltr');
    expect(await style(page, '#legend', 'direction')).toBe('rtl');
    expect(await style(page, '#plot', 'width')).not.toBe('520px');
  });

  it('makes line chart marks transparent hit columns and sizes the donut plot', async () => {
    const line = await open(chart('line'));
    expect(await style(line, '#mark', 'fill')).toBe('rgba(0, 0, 0, 0)');
    const donut = await open(chart('donut'));
    expect(await style(donut, '#plot', 'width')).toBe('160px');
  });

  it('puts the tooltip on the overlay surface, above the plot', async () => {
    const page = await open(chart('bar'));
    expect(await style(page, '#tooltip', 'position')).toBe('absolute');
    expect(await style(page, '#tooltip', 'pointer-events')).toBe('none');
    expect(await style(page, '#strong', 'display')).toBe('block');
  });
});

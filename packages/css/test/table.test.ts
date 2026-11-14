/**
 * Table (#62) in a real browser (Chromium): density, the header row, selected
 * and numeric cells, the last-row edge beside hidden expansion rows, and the
 * expand chevron in RTL.
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

const table = (rootAttributes = '', extraRows = '') => `
<div class="apui-table" data-surface="default" data-sticky-header ${rootAttributes}>
  <div data-scope="table" data-part="scroll">
    <table data-scope="table" data-part="table">
      <thead><tr>
        <th id="head" data-scope="table" data-part="head-cell" scope="col">Name</th>
        <th id="sorted" data-scope="table" data-part="head-cell" scope="col" aria-sort="ascending"><button type="button" data-scope="table" data-part="sort">Amount</button></th>
      </tr></thead>
      <tbody>
        <tr id="selected" data-scope="table" data-part="row" aria-selected="true"><td id="first" data-scope="table" data-part="cell"><button id="expand" type="button" data-scope="table" data-part="expand-trigger" aria-expanded="true" data-mirror>${chevron}</button></td><td id="numeric" data-scope="table" data-part="cell" data-numeric>1</td></tr>
        <tr id="plain" data-scope="table" data-part="row" aria-selected="false"><td id="last" data-scope="table" data-part="cell">B</td><td data-scope="table" data-part="cell">2</td></tr>
        ${extraRows}
      </tbody>
    </table>
  </div>
</div>`;

describe('Table', () => {
  it('follows density through the row tokens and steps the type down in compact', async () => {
    const page = await open(table() + table('id="compact" data-density="compact"'));
    expect(await style(page, '#first', 'height')).toBe('40px');
    expect(await style(page, '#first', 'font-size')).toBe('14px');
    expect(await style(page, '#compact #first', 'height')).toBe('32px');
    expect(await style(page, '#compact #first', 'font-size')).toBe('13px');
    expect(await style(page, '#compact #first', 'padding-inline-start')).toBe('8px');
    await page.close();
  });

  it('draws the sunken, sticky header row with muted type, and the sorted header in full color', async () => {
    const page = await open(table());
    expect(await style(page, '#head', 'position')).toBe('sticky');
    expect(await style(page, '#head', 'font-size')).toBe('12px');
    expect(await style(page, '#head', 'color')).not.toBe(await style(page, '#sorted', 'color'));
    expect(await style(page, '#head', 'background-color')).not.toBe('rgba(0, 0, 0, 0)');
    await page.close();
    const loose = await open(table().replace(' data-sticky-header', ''));
    expect(await style(loose, '#head', 'position')).toBe('static');
    await loose.close();
  });

  it('tints selected rows and end-aligns numbers with tabular figures', async () => {
    const page = await open(table());
    expect(await style(page, '#first', 'background-color')).not.toBe(
      await style(page, '#last', 'background-color'),
    );
    expect(await style(page, '#numeric', 'text-align')).toBe('end');
    expect(await style(page, '#numeric', 'font-variant-numeric')).toBe('tabular-nums');
    await page.close();
  });

  it('drops the last edge even when a hidden expansion row follows', async () => {
    const page = await open(
      table(
        '',
        '<tr data-scope="table" data-part="expansion" hidden><td colspan="2">More</td></tr>',
      ),
    );
    expect(await style(page, '#last', 'border-block-end-width')).toBe('0px');
    expect(await style(page, '#first', 'border-block-end-width')).toBe('1px');
    await page.close();
  });

  it('turns the open chevron down, mirrored in RTL', async () => {
    const ltr = await open(table());
    expect(await style(ltr, '#expand svg', 'rotate')).toBe('90deg');
    expect(await style(ltr, '#expand svg', 'scale')).toBe('none');
    await ltr.close();
    const rtl = await open(table(), 'data-theme="light" dir="rtl"');
    expect(await style(rtl, '#expand svg', 'rotate')).toBe('-90deg');
    expect(await style(rtl, '#expand svg', 'scale')).toBe('-1 1');
    await rtl.close();
  });
});

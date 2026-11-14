/**
 * DatePicker and its time mode (#55) in Chromium: the field box on the shared
 * field anatomy, the day states the spec draws, the time column, and RTL.
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

const day = (value: number, attrs = '') =>
  `<td data-scope="date-picker" data-part="table-cell"><div data-scope="date-picker" data-part="table-cell-trigger" id="d${value}" tabindex="-1" ${attrs}>${value}</div></td>`;

const picker = (root = '', content = '', time = '') => `
  <div class="apui-date-picker" data-scope="date-picker" data-part="root" data-size="md" ${root}>
    <label data-scope="date-picker" data-part="label" for="i">Move-in date</label>
    <div data-scope="date-picker" data-part="box">
      <button data-scope="date-picker" data-part="trigger" aria-label="Choose date"><svg viewBox="0 0 24 24"></svg></button>
      <input data-scope="date-picker" data-part="control" id="i" />
    </div>
    <p data-scope="date-picker" data-part="hint">MM/DD/YYYY</p>
    <div data-scope="date-picker" data-part="positioner">
      <div data-scope="date-picker" data-part="content" data-state="open" ${content}>
        <div data-scope="date-picker" data-part="view">
          <div data-scope="date-picker" data-part="view-control">
            <button data-scope="date-picker" data-part="prev-trigger">‹</button>
            <span data-scope="date-picker" data-part="range-text">November 2026</span>
            <button data-scope="date-picker" data-part="next-trigger">›</button>
          </div>
          <table data-scope="date-picker" data-part="table" role="grid"><tbody><tr>
            ${day(1, 'data-outside-range data-disabled')}${day(2, 'data-disabled data-unavailable')}${day(7, 'data-today')}${day(12, 'data-selected data-range-start')}${day(13, 'data-in-range')}${day(14)}
          </tr></tbody></table>
        </div>
        ${time}
      </div>
    </div>
  </div>`;

const timeColumn = `
  <div data-scope="date-picker" data-part="time">
    <span data-scope="date-picker" data-part="time-label" aria-hidden="true">Time</span>
    <div data-scope="date-picker" data-part="time-list" role="listbox" aria-label="Time">
      <div data-scope="date-picker" data-part="time-option" role="option" id="t1" tabindex="-1">10:30</div>
      <div data-scope="date-picker" data-part="time-option" role="option" id="t2" data-selected aria-selected="true" tabindex="0">11:00</div>
    </div>
  </div>`;

describe('DatePicker', () => {
  it('draws the field box from the shared anatomy, with the control height', async () => {
    const page = await open(picker());
    expect(await style(page, '[data-part="box"]', 'height')).toBe('36px');
    expect(await style(page, '[data-part="box"]', 'border-top-style')).toBe('solid');
    expect(await style(page, '[data-part="control"]', 'border-top-width')).toBe('0px');
    expect(await style(page, '[data-part="label"]', 'font-weight')).toBe('500');
    await page.close();
  });

  it('marks invalid with an error edge and disabled with the sunken surface', async () => {
    const page = await open(picker('data-invalid') + picker('data-disabled'));
    const [invalid, disabled] = await page.$$eval('[data-part="box"]', (els) =>
      els.map((el) => getComputedStyle(el).borderTopColor),
    );
    const base = await open(picker());
    const plain = await style(base, '[data-part="box"]', 'border-top-color');
    await base.close();
    expect(invalid).not.toBe(plain);
    expect(disabled).not.toBe(plain);
    await page.close();
  });

  it('draws the day states the spec shows', async () => {
    const page = await open(picker());
    expect(await style(page, '[data-part="content"]', 'width')).toBe('296px');
    expect(await style(page, '#d12', 'border-radius')).toBe('9999px');
    expect(await style(page, '#d12', 'font-weight')).toBe('600');
    expect(await style(page, '#d13', 'border-radius')).toBe('0px');
    expect(await style(page, '#d13', 'background-color')).not.toBe(
      await style(page, '#d14', 'background-color'),
    );
    expect(await style(page, '#d2', 'text-decoration-line')).toBe('line-through');
    expect(await style(page, '#d1', 'text-decoration-line')).toBe('none');
    expect(await style(page, '#d7', 'box-shadow')).toContain('inset');
    await page.close();
  });

  it('insets the focus ring inside the grid', async () => {
    const page = await open(picker());
    await page.focus('#d14');
    await page.keyboard.press('Shift');
    expect(await style(page, '#d14', 'box-shadow')).toContain('inset');
    await page.close();
  });

  it("shows the focus ring on today's cell, with today's edge inside it", async () => {
    const page = await open(picker());
    const idle = await style(page, '#d7', 'box-shadow');
    await page.focus('#d7');
    await page.keyboard.press('Shift');
    const focused = await style(page, '#d7', 'box-shadow');
    expect(focused).not.toBe(idle);
    expect(focused.match(/inset/g)).toHaveLength(2);
    await page.close();
  });

  it("draws the focus outline over today's edge in forced colors", async () => {
    const page = await open(picker());
    await page.emulateMedia({ forcedColors: 'active' });
    expect(await style(page, '#d7', 'outline-width')).toBe('1px');
    await page.focus('#d7');
    await page.keyboard.press('Shift');
    expect(await style(page, '#d7', 'outline-width')).toBe('2px');
    expect(await style(page, '#d7', 'outline-style')).toBe('solid');
    await page.close();
  });

  it('stacks the time column under the month on a 375px screen', async () => {
    const page = await open(picker('', 'data-time', timeColumn));
    await page.setViewportSize({ width: 375, height: 800 });
    const box = await page.$eval('[data-part="content"]', (el) => el.getBoundingClientRect().right);
    expect(box).toBeLessThanOrEqual(375);
    expect(await style(page, '[data-part="time"]', 'border-left-style')).toBe('none');
    expect(await style(page, '[data-part="time"]', 'border-top-style')).toBe('solid');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );
    await page.close();
  });

  it('lays out the time column beside the month in time mode', async () => {
    const page = await open(picker('', 'data-time', timeColumn));
    expect(await style(page, '[data-part="content"]', 'display')).toBe('grid');
    expect(await style(page, '[data-part="content"]', 'grid-template-columns')).toBe('272px 110px');
    expect(await style(page, '#t2', 'font-weight')).toBe('600');
    expect(await style(page, '[data-part="time"]', 'border-left-style')).toBe('solid');
    await page.close();
  });

  it('puts the time column on the start side in RTL', async () => {
    const page = await open(picker('', 'data-time', timeColumn), 'data-theme="light" dir="rtl"');
    expect(await style(page, '[data-part="time"]', 'border-right-style')).toBe('solid');
    expect(await style(page, '[data-part="time"]', 'border-left-style')).toBe('none');
    await page.close();
  });

  it('follows the dark theme through tokens', async () => {
    const light = await open(picker());
    const dark = await open(picker(), 'data-theme="dark"');
    expect(await style(dark, '[data-part="content"]', 'background-color')).not.toBe(
      await style(light, '[data-part="content"]', 'background-color'),
    );
    await light.close();
    await dark.close();
  });
});

/**
 * Calendar (#64) in a real browser (Chromium): soft tints by data-color,
 * today's filled date, 24px targets for events and "+N more", the agenda's
 * list layout and RTL borders.
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

const month = (view = 'month') => `
<div class="apui-calendar" data-view="${view}" style="inline-size: 900px">
  <div data-scope="calendar" data-part="grid" role="grid">
    <div data-scope="calendar" data-part="row" role="row">
      <div data-scope="calendar" data-part="cell" role="gridcell" id="first">
        <span data-scope="calendar" data-part="date">1</span>
        <button data-scope="calendar" data-part="event" data-color="error" id="error"><span data-scope="calendar" data-part="event-time">09:00</span><span data-scope="calendar" data-part="event-title">Team meeting</span></button>
        <button data-scope="calendar" data-part="event" id="primary">Viewing</button>
        <button data-scope="calendar" data-part="more" id="more">+1 more</button>
      </div>
      <div data-scope="calendar" data-part="cell" role="gridcell" data-today id="today"><span data-scope="calendar" data-part="date" id="today-date">2</span></div>
      <div data-scope="calendar" data-part="cell" role="gridcell" data-outside id="outside"></div>
      <div data-scope="calendar" data-part="cell" role="gridcell"></div>
      <div data-scope="calendar" data-part="cell" role="gridcell"></div>
      <div data-scope="calendar" data-part="cell" role="gridcell"></div>
      <div data-scope="calendar" data-part="cell" role="gridcell" id="last"></div>
    </div>
  </div>
</div>`;

describe('Calendar', () => {
  it('tints events by data-color from the soft roles', async () => {
    const page = await open(month());
    expect(await style(page, '#error', 'background-color')).not.toBe(
      await style(page, '#primary', 'background-color'),
    );
    expect(await style(page, '#error', 'color')).not.toBe(await style(page, '#primary', 'color'));
    await page.close();
  });

  it('keeps events and +N more at least 24px tall', async () => {
    const page = await open(month());
    for (const id of ['#error', '#more']) {
      const box = await page.$eval(id, (el) => el.getBoundingClientRect().height);
      expect(box).toBeGreaterThanOrEqual(24);
    }
    await page.close();
  });

  it('fills today with primary and mutes days outside the month', async () => {
    const page = await open(month());
    expect(await style(page, '#today-date', 'background-color')).not.toBe('rgba(0, 0, 0, 0)');
    expect(await style(page, '#outside', 'background-color')).not.toBe(
      await style(page, '#first', 'background-color'),
    );
    await page.close();
  });

  it('draws the cell edge at the inline end, flipping under RTL', async () => {
    const ltr = await open(month());
    expect(await style(ltr, '#first', 'border-right-width')).toBe('1px');
    expect(await style(ltr, '#last', 'border-right-width')).toBe('0px');
    await ltr.close();
    const rtl = await open(month(), 'data-theme="light" dir="rtl"');
    expect(await style(rtl, '#first', 'border-left-width')).toBe('1px');
    expect(await style(rtl, '#first', 'border-right-width')).toBe('0px');
    await rtl.close();
  });

  it('stacks the time over the title in week and day views', async () => {
    const page = await open(month('week'));
    expect(await style(page, '#error', 'flex-direction')).toBe('column');
    expect(await style(page, '#first', 'min-height')).toBe('320px');
    await page.close();
  });
});

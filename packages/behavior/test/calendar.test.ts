/**
 * The Calendar's Alpine component (#64) in Chromium: arrow keys between the
 * grid's cells that follow the text direction, one tab stop, and roving
 * focus in the view tabs. The markup is what the Blade view renders.
 */
import type { Page } from 'playwright';

import { close, morph, open } from './browser';

/** Two weeks of a server-rendered month grid, with the view tabs. */
const markup = () => {
  const cell = (date: number, stop = false) =>
    `<div data-scope="calendar" data-part="cell" role="gridcell" id="d${date}" tabindex="${stop ? 0 : -1}"><span>${date}</span><button type="button" data-scope="calendar" data-part="event" id="e${date}">Event</button></div>`;
  const row = (from: number) =>
    `<div data-scope="calendar" data-part="row" role="row">${Array.from({ length: 7 }, (_, i) => cell(from + i, from + i === 7)).join('')}</div>`;
  return `
<div class="apui-calendar" x-data="apuiCalendar()">
  <div role="tablist" x-on:keydown="tabsKeydown($event)">
    <button type="button" role="tab" id="t-month" tabindex="0" aria-selected="true">Month</button>
    <button type="button" role="tab" id="t-week" tabindex="-1">Week</button>
    <button type="button" role="tab" id="t-day" tabindex="-1">Day</button>
  </div>
  <div data-scope="calendar" data-part="grid" role="grid" x-on:keydown="gridKeydown($event)">
    <div data-scope="calendar" data-part="row" role="row"><div role="columnheader">Mon</div></div>
    ${row(1)}${row(8)}
  </div>
</div>`;
};

const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const stops = (page: Page) =>
  page.$$eval('[data-part="cell"][tabindex="0"]', (els) => els.map((el) => el.id));

afterAll(close);

describe('calendar grid', () => {
  it('moves between days and rows, keeping one tab stop', async () => {
    const { page, errors } = await open(markup());
    await page.focus('#d7');
    await page.keyboard.press('ArrowRight');
    expect(await focusedId(page)).toBe('d8');
    await page.keyboard.press('ArrowUp');
    expect(await focusedId(page)).toBe('d1');
    await page.keyboard.press('End');
    expect(await focusedId(page)).toBe('d7');
    await page.keyboard.press('ArrowDown');
    expect(await focusedId(page)).toBe('d14');
    await page.keyboard.press('ArrowDown');
    expect(await focusedId(page)).toBe('d14');
    await page.keyboard.press('Home');
    expect(await focusedId(page)).toBe('d8');
    expect(await stops(page)).toEqual(['d8']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('stays put on ArrowUp in the first row and ArrowDown in the last', async () => {
    const { page } = await open(markup());
    await page.focus('#d3');
    await page.keyboard.press('ArrowUp');
    expect(await focusedId(page)).toBe('d3');
    await page.keyboard.press('ArrowDown');
    expect(await focusedId(page)).toBe('d10');
    await page.keyboard.press('ArrowDown');
    expect(await focusedId(page)).toBe('d10');
    expect(await stops(page)).toEqual(['d10']);
    const scrolled = await page.evaluate(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      document.getElementById('d10')!.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(scrolled).toBe(true);
    await page.close();
  });

  it('takes the server tab stop again after a Livewire re-render', async () => {
    const { page } = await open(markup());
    await page.focus('#d7');
    await page.keyboard.press('ArrowDown');
    expect(await stops(page)).toEqual(['d14']);
    await morph(page, '.apui-calendar', markup().trim());
    expect(await stops(page)).toEqual(['d7']);
    await page.close();
  });

  it('swaps ArrowLeft and ArrowRight under RTL', async () => {
    const { page } = await open(markup(), { dir: 'rtl' });
    await page.focus('#d7');
    await page.keyboard.press('ArrowLeft');
    expect(await focusedId(page)).toBe('d8');
    await page.keyboard.press('ArrowRight');
    expect(await focusedId(page)).toBe('d7');
    await page.close();
  });

  it('leaves keys from inside an event alone', async () => {
    const { page } = await open(markup());
    await page.focus('#e7');
    await page.keyboard.press('ArrowRight');
    expect(await focusedId(page)).toBe('e7');
    await page.close();
  });

  it('roves focus in the view tabs', async () => {
    const { page } = await open(markup(), { dir: 'rtl' });
    await page.focus('#t-month');
    await page.keyboard.press('ArrowLeft');
    expect(await focusedId(page)).toBe('t-week');
    await page.keyboard.press('End');
    expect(await focusedId(page)).toBe('t-day');
    await page.close();
  });
});

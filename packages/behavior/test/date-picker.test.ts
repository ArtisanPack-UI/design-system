/**
 * DatePicker through the Alpine adapter (#55): typing, the calendar grid and
 * its keyboard (RTL included), range selection, time mode's listbox, values
 * bound to Alpine data, a server morph of the field, and the pure helpers.
 * React and Vue run the same definition: see date-picker-frameworks.test.ts.
 */
import type { Page } from 'playwright';

import { close, data, morph, open, setData, settle } from './browser';
import { markup } from './date-picker-markup';
import {
  datePattern,
  formatDate,
  parseDate,
  parseIso,
  timeOptions,
  toIso,
  toIsoValue,
} from '../src/widgets/date-picker';

const isOpen = (page: Page) => page.$eval('#dp-content', (el) => !el.hasAttribute('hidden'));
const focusedDay = (page: Page) =>
  page.evaluate(() => document.activeElement?.getAttribute('data-value') ?? null);

async function openCalendar(page: Page) {
  await page.click('#dp-trigger');
  await settle(page);
}

afterAll(close);

describe('date picker helpers', () => {
  it('reads and writes ISO dates and date-times', () => {
    expect(toIso(parseIso('2026-11-12')!)).toBe('2026-11-12');
    expect(toIso(parseIso('2026-11-12T11:30')!, true)).toBe('2026-11-12T11:30');
    expect(toIso(parseIso('2026-11-12')!, true)).toBe('2026-11-12T00:00');
    expect(parseIso('2026-02-30')).toBeUndefined();
    expect(parseIso('not a date')).toBeUndefined();
    expect(toIsoValue([parseIso('2026-11-12')!, parseIso('2026-11-18')!], 'range')).toEqual([
      '2026-11-12',
      '2026-11-18',
    ]);
    expect(toIsoValue([], 'single')).toBeNull();
  });

  it('derives a numeric pattern from the locale', () => {
    expect(datePattern('en-US')).toBe('MM/dd/yyyy');
    expect(datePattern('de-DE')).toBe('dd.MM.yyyy');
    expect(datePattern('en-GB')).toBe('dd/MM/yyyy');
  });

  it('formats and parses text in a pattern, with a clock in time mode', () => {
    const date = parseIso('2026-11-02T09:05')!;
    expect(formatDate(date, 'dd.MM.yyyy')).toBe('02.11.2026');
    expect(formatDate(date, 'MM/dd/yyyy', true)).toBe('11/02/2026 09:05');
    expect(toIso(parseDate('2.11.2026', 'dd.MM.yyyy')!)).toBe('2026-11-02');
    expect(toIso(parseDate('11/02/2026 9:05', 'MM/dd/yyyy', true)!, true)).toBe('2026-11-02T09:05');
    expect(parseDate('31/02/2026', 'dd/MM/yyyy')).toBeUndefined();
    expect(parseDate('2026', 'dd/MM/yyyy')).toBeUndefined();
  });

  it('lists times every step minutes', () => {
    expect(timeOptions(30)).toHaveLength(48);
    expect(
      timeOptions(60)
        .map((t) => t.value)
        .slice(0, 3),
    ).toEqual(['00:00', '01:00', '02:00']);
    expect(timeOptions(0)).toHaveLength(48);
  });
});

describe('date picker (Alpine)', () => {
  it('wires the field, the trigger and the grid', async () => {
    const { page, errors } = await open(markup("{ locale: 'en-US', value: '2026-11-12' }"));
    expect(await page.$eval('#dp-label', (el) => el.getAttribute('for'))).toBe('dp-input');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '11/12/2026',
    );
    expect(await page.$eval('#dp-input', (el) => el.getAttribute('placeholder'))).toBe(
      'MM/DD/YYYY',
    );
    const trigger = await page.$eval('#dp-trigger', (el) => ({
      label: el.getAttribute('aria-label'),
      expanded: el.getAttribute('aria-expanded'),
      controls: el.getAttribute('aria-controls'),
    }));
    expect(trigger).toEqual({ label: 'Choose date', expanded: 'false', controls: 'dp-content' });
    expect(await page.$eval('#dp-table', (el) => el.getAttribute('role'))).toBe('grid');
    expect(await page.$$eval('#dp-table th', (els) => els.map((el) => el.textContent))).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
    expect(await page.$eval('[data-part="range-text"]', (el) => el.textContent)).toBe(
      'November 2026',
    );
    const selected = await page.$eval('[data-part="table-cell-trigger"][data-selected]', (el) => ({
      value: el.getAttribute('data-value'),
      label: el.getAttribute('aria-label'),
      cell: el.parentElement!.getAttribute('aria-selected'),
    }));
    expect(selected).toEqual({
      value: '2026-11-12',
      label: 'Thursday, November 12, 2026',
      cell: 'true',
    });
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens from the trigger and moves through days with the arrow keys and PageDown', async () => {
    const { page } = await open(markup("{ locale: 'en-US', value: '2026-11-12' }"));
    await openCalendar(page);
    expect(await isOpen(page)).toBe(true);
    expect(await focusedDay(page)).toBe('2026-11-12');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedDay(page)).toBe('2026-11-13');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await focusedDay(page)).toBe('2026-11-20');
    await page.keyboard.press('PageDown');
    await settle(page);
    expect(await focusedDay(page)).toBe('2026-12-20');
    expect(await page.$eval('[data-part="range-text"]', (el) => el.textContent)).toBe(
      'December 2026',
    );
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await data(page, '#dp', 'value')).toBe('2026-12-20');
    expect(await isOpen(page)).toBe(false);
    await page.close();
  });

  it('replaces the server-rendered month with its own', async () => {
    const html = markup("{ locale: 'en-US', value: '2026-11-12' }").replace(
      '<tbody x-apui:table-body>',
      '<tbody x-apui:table-body><tr data-apui-ssr><td id="ssr-cell">1</td></tr>',
    );
    const { page } = await open(html);
    expect(await page.$('#ssr-cell')).toBeNull();
    expect(await page.$$eval('[data-part="table-cell-trigger"]', (els) => els.length)).toBe(35);
    await page.close();
  });

  it('keeps the calendar open when the text input is pressed', async () => {
    const { page } = await open(markup("{ locale: 'en-US', value: '2026-11-12' }"));
    await openCalendar(page);
    await page.click('#dp-input');
    await settle(page);
    await page.waitForTimeout(50);
    expect(await isOpen(page)).toBe(true);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('dp-input');
    await page.close();
  });

  it('returns focus to the text input after picking a day', async () => {
    const { page } = await open(markup("{ locale: 'en-US', value: '2026-11-12' }"));
    await openCalendar(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('dp-input');
    await openCalendar(page);
    await page.click('[data-part="table-cell-trigger"][data-value="2026-11-20"]');
    await settle(page);
    await settle(page);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('dp-input');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '11/20/2026',
    );
    await page.close();
  });

  it('follows the text direction: ArrowRight moves back a day in RTL', async () => {
    const { page } = await open(markup("{ locale: 'en-US', value: '2026-11-12' }"), {
      dir: 'rtl',
    });
    await openCalendar(page);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedDay(page)).toBe('2026-11-11');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await focusedDay(page)).toBe('2026-11-13');
    await page.close();
  });

  it('takes typed text and reports an ISO value', async () => {
    const { page } = await open(markup("{ locale: 'de-DE' }"));
    const changes: unknown[] = [];
    await page.exposeFunction('recordChange', (detail: unknown) => changes.push(detail));
    await page.evaluate(() =>
      document
        .querySelector('#dp')!
        .addEventListener('value-change', (event) =>
          (window as unknown as { recordChange(d: unknown): void }).recordChange(
            (event as CustomEvent).detail,
          ),
        ),
    );
    await page.click('#dp-input');
    await page.keyboard.type('3.2.2027x');
    await page.keyboard.press('Tab');
    await settle(page);
    expect(await data(page, '#dp', 'value')).toBe('2027-02-03');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '03.02.2027',
    );
    expect(changes).toContainEqual({ value: '2027-02-03' });
    await page.close();
  });

  it('starts the week and names days from the locale and weekStartsOn', async () => {
    const { page } = await open(markup("{ locale: 'fr-FR', value: '2026-11-12' }"));
    expect(await page.$eval('#dp-table th', (el) => el.textContent)).toBe('lun.');
    expect(await page.$eval('[data-part="range-text"]', (el) => el.textContent)).toBe(
      'novembre 2026',
    );
    await page.close();
    const second = await open(markup("{ locale: 'en-US', value: '2026-11-12', weekStartsOn: 1 }"));
    expect(await second.page.$eval('#dp-table th', (el) => el.textContent)).toBe('Mon');
    await second.page.close();
  });

  it('honors min, max and disabledDates', async () => {
    const { page } = await open(
      markup(
        "{ locale: 'en-US', value: '2026-11-12', min: '2026-11-05', max: '2026-11-20', disabledDates: ['2026-11-10'] }",
      ),
    );
    const disabled = await page.$$eval(
      '[data-part="table-cell-trigger"][data-disabled]:not([data-outside-range])',
      (els) => els.map((el) => el.getAttribute('data-value')),
    );
    expect(disabled).toContain('2026-11-04');
    expect(disabled).toContain('2026-11-10');
    expect(disabled).toContain('2026-11-21');
    expect(disabled).not.toContain('2026-11-12');
    await openCalendar(page);
    // aria-disabled: Playwright would wait for it to enable, so click it directly.
    await page.$eval('[data-part="table-cell-trigger"][data-value="2026-11-10"]', (el) =>
      (el as HTMLElement).click(),
    );
    await settle(page);
    expect(await data(page, '#dp', 'value')).toBe('2026-11-12');
    await page.close();
  });

  it('selects a range in two clicks, as an array', async () => {
    const { page } = await open(
      markup("{ locale: 'en-US', mode: 'range', value: [] }", { range: true }),
    );
    await setData(page, '#dp', 'value', ['2026-11-01', '2026-11-02']);
    await openCalendar(page);
    await page.click('[data-part="table-cell-trigger"][data-value="2026-11-12"]');
    await page.click('[data-part="table-cell-trigger"][data-value="2026-11-18"]');
    await settle(page);
    expect(await data(page, '#dp', 'value')).toEqual(['2026-11-12', '2026-11-18']);
    const inRange = await page.$$eval('[data-part="table-cell-trigger"][data-in-range]', (els) =>
      els.map((el) => el.getAttribute('data-value')),
    );
    expect(inRange).toHaveLength(7);
    expect(await page.$eval('#dp-input-1', (el) => (el as HTMLInputElement).value)).toBe(
      '11/18/2026',
    );
    await page.close();
  });

  it('picks a time from the listbox in time mode', async () => {
    const { page } = await open(
      markup("{ locale: 'en-US', time: true, step: 30, value: '2026-11-12T10:00' }", {
        time: true,
      }),
    );
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '11/12/2026 10:00',
    );
    expect(await page.$eval('#dp-times', (el) => el.getAttribute('role'))).toBe('listbox');
    const selected = await page.$eval('[data-part="time-option"][aria-selected="true"]', (el) => [
      el.getAttribute('data-value'),
      el.getAttribute('tabindex'),
    ]);
    expect(selected).toEqual(['10:00', '0']);
    await openCalendar(page);
    await page.focus('[data-part="time-option"][data-value="10:00"]');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await data(page, '#dp', 'value')).toBe('2026-11-12T11:00');
    expect(await isOpen(page)).toBe(false);
    // Picking a day keeps the time and the popover open.
    await openCalendar(page);
    await page.click('[data-part="table-cell-trigger"][data-value="2026-11-14"]');
    await settle(page);
    expect(await data(page, '#dp', 'value')).toBe('2026-11-14T11:00');
    expect(await isOpen(page)).toBe(true);
    await page.close();
  });

  it('follows bound state both ways', async () => {
    const { page } = await open(markup("{ locale: 'en-US', value: null }"));
    await setData(page, '#dp', 'value', '2027-01-05');
    expect(await page.$eval('#dp-input', (el) => (el as HTMLInputElement).value)).toBe(
      '01/05/2027',
    );
    expect(await page.$eval('[data-part="range-text"]', (el) => el.textContent)).toBe(
      'January 2027',
    );
    await setData(page, '#dp', 'open', true);
    expect(await isOpen(page)).toBe(true);
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await data(page, '#dp', 'open')).toBe(false);
    await page.close();
  });

  it('keeps the field wired through a server morph', async () => {
    const { page, errors } = await open(markup("{ locale: 'en-US', value: '2026-11-12' }"));
    await morph(page, '#dp', markup("{ locale: 'en-US', value: '2026-11-12' }"));
    expect(await page.$eval('#dp-trigger', (el) => el.getAttribute('aria-controls'))).toBe(
      'dp-content',
    );
    expect(await page.$eval('#dp-label', (el) => el.getAttribute('for'))).toBe('dp-input');
    await openCalendar(page);
    expect(await isOpen(page)).toBe(true);
    expect(errors).toEqual([]);
    await page.close();
  });
});

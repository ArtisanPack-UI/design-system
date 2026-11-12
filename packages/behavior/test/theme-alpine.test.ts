/**
 * ThemeToggle (#65) through the Alpine adapter: the segmented radio group's
 * checked state, roving tabindex and keys (following the text direction),
 * applying and storing a choice, value-change, the stored choice on start,
 * following the OS while it's system, and the icon button.
 */
import type { Page } from 'playwright';

import { close, open, settle } from './browser';

/** The segmented toggle as Livewire renders it. */
const segmented = (
  options = "{ value: null, choices: ['light', 'dark', 'high-contrast', 'system'] }",
) => `
<div id="toggle" x-data="apuiThemeToggle(${options})" x-bind:data-value="current()">
  <div id="list" role="radiogroup" aria-label="Theme" x-on:keydown="keydown( $event )">
    ${['light', 'dark', 'high-contrast', 'system']
      .map(
        (choice) =>
          `<button type="button" id="radio-${choice}" role="radio" data-value="${choice}" aria-checked="false" tabindex="-1"
            x-bind:aria-checked="checked( '${choice}' )" x-bind:tabindex="tabStop( '${choice}' )"
            x-on:click="choose( '${choice}' )">${choice}</button>`,
      )
      .join('')}
  </div>
</div>
<div id="other" x-data="apuiThemeToggle({ value: null })" x-bind:data-value="current()"></div>`;

const checkedId = (page: Page) =>
  page.$$eval('[role="radio"][aria-checked="true"]', (els) => els.map((el) => el.id));
const theme = (page: Page) =>
  page.evaluate(() => document.documentElement.getAttribute('data-theme'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');

async function record(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { events: unknown[] };
    w.events = [];
    document
      .querySelector('#toggle')!
      .addEventListener('value-change', (event) => w.events.push((event as CustomEvent).detail));
  });
}

/**
 * A page set with setContent has an opaque origin, where localStorage
 * throws (as in some private windows): the toggle must survive that, and the
 * storage tests swap in an in-memory one.
 */
async function memoryStorage(page: Page, items: Record<string, string> = {}) {
  await page.evaluate((initial) => {
    const map = new Map(Object.entries(initial));
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => map.get(key) ?? null,
        setItem: (key: string, value: string) => void map.set(key, String(value)),
      },
    });
  }, items);
}

/** Adds a toggle after Alpine started, so it reads storage as it starts. */
async function addToggle(page: Page, html: string) {
  await page.evaluate((markup) => {
    const host = document.createElement('div');
    host.innerHTML = markup;
    document.body.append(host);
    (window as unknown as { Alpine: { initTree(el: Element): void } }).Alpine.initTree(host);
  }, html);
  await settle(page);
}

afterAll(close);

describe('theme toggle (Alpine)', () => {
  it('checks system without a stored choice, with one tab stop', async () => {
    const { page, errors } = await open(segmented());
    await settle(page);
    expect(await checkedId(page)).toEqual(['radio-system']);
    expect(
      await page.$$eval('[role="radio"][tabindex="0"]', (els) => els.map((el) => el.id)),
    ).toEqual(['radio-system']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('survives blocked storage', async () => {
    const { page, errors } = await open(segmented());
    await page.click('#radio-dark');
    await settle(page);
    expect(await theme(page)).toBe('dark');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('applies, stores and reports a click, and the other toggles follow', async () => {
    const { page, errors } = await open(segmented());
    await memoryStorage(page);
    await settle(page);
    await record(page);
    await page.click('#radio-high-contrast');
    await settle(page);
    expect(await checkedId(page)).toEqual(['radio-high-contrast']);
    expect(await theme(page)).toBe('high-contrast');
    expect(await page.evaluate(() => localStorage.getItem('apui-theme'))).toBe('high-contrast');
    expect(await page.evaluate(() => (window as unknown as { events: unknown[] }).events)).toEqual([
      { value: 'high-contrast' },
    ]);
    expect(await page.$eval('#other', (el) => el.getAttribute('data-value'))).toBe('high-contrast');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('moves, checks and focuses with the arrow keys, Home and End', async () => {
    const { page } = await open(segmented("{ value: 'light' }"));
    await settle(page);
    await page.focus('#radio-light');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('radio-dark');
    expect(await checkedId(page)).toEqual(['radio-dark']);
    expect(await theme(page)).toBe('dark');
    await page.keyboard.press('End');
    await settle(page);
    expect(await focusedId(page)).toBe('radio-system');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('radio-light');
    await page.close();
  });

  it('follows the text direction', async () => {
    const { page } = await open(segmented("{ value: 'light' }"), { dir: 'rtl' });
    await settle(page);
    await page.focus('#radio-light');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await focusedId(page)).toBe('radio-dark');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(await focusedId(page)).toBe('radio-light');
    await page.close();
  });

  it('re-applies system when the OS scheme changes', async () => {
    const { page } = await open(segmented());
    await settle(page);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.click('#radio-system');
    await settle(page);
    expect(await theme(page)).toBe('light');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    await page.click('#radio-light');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    await settle(page);
    expect(await theme(page)).toBe('light');
    await page.close();
  });

  it('shows the stored choice when it starts', async () => {
    const { page } = await open('<main></main>');
    await memoryStorage(page, { 'site-theme': 'high-contrast' });
    await addToggle(
      page,
      `<div id="late" x-data="apuiThemeToggle({ value: null, storageKey: 'site-theme' })" x-bind:data-value="current()"></div>
       <div id="unpersisted" x-data="apuiThemeToggle({ value: null, persist: false, storageKey: 'site-theme' })" x-bind:data-value="current()"></div>`,
    );
    expect(await page.$eval('#late', (el) => el.getAttribute('data-value'))).toBe('high-contrast');
    expect(await page.$eval('#unpersisted', (el) => el.getAttribute('data-value'))).toBe('system');
    await page.close();
  });

  it('applies and stores a bound value that differs from the stored choice, but not a plain one', async () => {
    const { page } = await open('<main></main>');
    await memoryStorage(page, { 'site-theme': 'high-contrast' });
    await addToggle(
      page,
      `<div id="plain" x-data="apuiThemeToggle({ value: 'light', storageKey: 'site-theme' })" x-bind:data-value="current()"></div>`,
    );
    expect(await page.$eval('#plain', (el) => el.getAttribute('data-value'))).toBe('light');
    expect(await theme(page)).toBeNull();
    await addToggle(
      page,
      `<div id="bound" x-data="apuiThemeToggle({ value: 'dark', bound: true, storageKey: 'site-theme' })" x-bind:data-value="current()"></div>`,
    );
    expect(await page.$eval('#bound', (el) => el.getAttribute('data-value'))).toBe('dark');
    expect(await theme(page)).toBe('dark');
    expect(await page.evaluate(() => localStorage.getItem('site-theme'))).toBe('dark');
    await page.close();
  });

  it('switches light and dark from the icon button', async () => {
    const { page } = await open(`
      <div id="icon" x-data="apuiThemeToggle({ value: 'light', persist: false })">
        <button id="button" x-bind:aria-label="nextTheme()" x-on:click="toggle()"></button>
      </div>`);
    await memoryStorage(page);
    await settle(page);
    expect(await page.$eval('#button', (el) => el.getAttribute('aria-label'))).toBe('dark');
    await page.click('#button');
    await settle(page);
    expect(await theme(page)).toBe('dark');
    expect(await page.$eval('#button', (el) => el.getAttribute('aria-label'))).toBe('light');
    expect(await page.evaluate(() => localStorage.getItem('apui-theme'))).toBeNull();
    await page.close();
  });

  it('applies a value set from outside (an entangled Livewire property)', async () => {
    const { page, errors } = await open(segmented("{ value: 'dark', bound: true }"));
    await memoryStorage(page);
    await settle(page);
    await record(page);
    // The starting value differs from the (empty) stored choice, so it's applied once.
    expect(await theme(page)).toBe('dark');
    await page.evaluate(() => {
      const alpine = (window as unknown as { Alpine: { $data(el: Element): { value: string } } })
        .Alpine;
      alpine.$data(document.querySelector('#toggle')!).value = 'high-contrast';
    });
    await settle(page);
    expect(await checkedId(page)).toEqual(['radio-high-contrast']);
    expect(await theme(page)).toBe('high-contrast');
    expect(await page.evaluate(() => localStorage.getItem('apui-theme'))).toBe('high-contrast');
    expect(await page.$eval('#other', (el) => el.getAttribute('data-value'))).toBe('high-contrast');
    // An outside change isn't the person's pick, so no value-change.
    expect(await page.evaluate(() => (window as unknown as { events: unknown[] }).events)).toEqual(
      [],
    );
    expect(errors).toEqual([]);
    await page.close();
  });
});

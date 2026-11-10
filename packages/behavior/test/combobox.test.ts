/**
 * Combobox through the Alpine adapter (#35): local filtering, keyboard
 * selection, single and multiple values bound to Alpine data, an option list
 * the server morphs, remote search, and teardown.
 */
import type { Page } from 'playwright';

import { close, data, listenerCount, morph, open, setData, settle } from './browser';

const COUNTRIES: [string, string][] = [
  ['fr', 'France'],
  ['de', 'Germany'],
  ['gh', 'Ghana'],
  ['is', 'Iceland'],
  ['ci', "Côte d'Ivoire"],
];

/** The combobox as a server renders it. `options` is the x-data argument. */
const markup = (options = '{}', items = COUNTRIES) => `
<div id="cb" x-data="apuiCombobox(${options})">
  <label id="cb-label" x-apui:label>Country</label>
  <div x-apui:control>
    <input id="cb-input" x-apui:input />
    <button id="cb-toggle" x-apui:trigger>▾</button>
  </div>
  <div x-apui:positioner>
    <ul id="cb-list" x-apui:content>
      ${items.map(([value, label]) => `<li x-apui:item="{ value: '${value}', label: ${JSON.stringify(label).replace(/"/g, '&quot;')} }" data-test="${value}">${label}</li>`).join('\n      ')}
      <li id="cb-empty" x-apui:empty>No matches</li>
    </ul>
  </div>
</div>`;

const visibleItems = (page: Page) =>
  page.$$eval('#cb-list [data-part="item"]:not([hidden])', (els) =>
    els.map((el) => el.getAttribute('data-value')),
  );
const isOpen = (page: Page) => page.$eval('#cb-list', (el) => !el.hasAttribute('hidden'));

async function type(page: Page, text: string) {
  await page.click('#cb-input');
  await page.keyboard.type(text);
  await settle(page);
}

afterAll(close);

describe('combobox', () => {
  it('wires ARIA between the label, input and listbox', async () => {
    const { page, errors } = await open(markup());
    const input = await page.$eval('#cb-input', (el) => ({
      role: el.getAttribute('role'),
      expanded: el.getAttribute('aria-expanded'),
      controls: el.getAttribute('aria-controls'),
      autocomplete: el.getAttribute('aria-autocomplete'),
    }));
    expect(input).toEqual({
      role: 'combobox',
      expanded: 'false',
      controls: 'cb-list',
      autocomplete: 'list',
    });
    expect(await page.$eval('#cb-label', (el) => el.getAttribute('for'))).toBe('cb-input');
    expect(await page.$eval('#cb-list', (el) => el.getAttribute('role'))).toBe('listbox');
    expect(await page.$$eval('[role="option"]', (els) => els.length)).toBe(COUNTRIES.length);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('filters by label as you type, ignoring case and accents', async () => {
    const { page } = await open(markup());
    await type(page, 'COTE');
    expect(await isOpen(page)).toBe(true);
    expect(await visibleItems(page)).toEqual(['ci']);
    await page.fill('#cb-input', '');
    await page.keyboard.type('g');
    await settle(page);
    expect(await visibleItems(page)).toEqual(['de', 'gh']);
    expect(await page.$eval('#cb-empty', (el) => el.hasAttribute('hidden'))).toBe(true);
    await page.close();
  });

  it('shows the empty part when nothing matches', async () => {
    const { page } = await open(markup());
    await type(page, 'zzz');
    expect(await visibleItems(page)).toEqual([]);
    expect(await page.$eval('#cb-empty', (el) => el.hasAttribute('hidden'))).toBe(false);
    await page.close();
  });

  it('selects with the keyboard and binds the value', async () => {
    const { page } = await open(markup('{ value: null }'));
    await page.evaluate(() => {
      (window as unknown as { values: unknown[] }).values = [];
      document.querySelector('#cb')!.addEventListener('value-change', (event) => {
        (window as unknown as { values: unknown[] }).values.push(
          (event as CustomEvent<{ value: unknown }>).detail.value,
        );
      });
    });
    await type(page, 'ger');
    // aria-activedescendant follows the highlighted option.
    const active = await page.$eval('#cb-input', (el) => el.getAttribute('aria-activedescendant'));
    expect(await page.$eval(`[id="${active}"]`, (el) => el.getAttribute('data-value'))).toBe('de');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await data(page, '#cb', 'value')).toBe('de');
    expect(await page.inputValue('#cb-input')).toBe('Germany');
    expect(await isOpen(page)).toBe(false);
    expect(await page.evaluate(() => (window as unknown as { values: unknown[] }).values)).toEqual([
      'de',
    ]);

    // Reopening lists everything again, not just the selected label.
    await page.click('#cb-toggle');
    await settle(page);
    expect(await visibleItems(page)).toEqual(COUNTRIES.map(([value]) => value));
    await page.close();
  });

  it('takes a value from outside, as $wire.entangle() sets it', async () => {
    const { page } = await open(markup("{ value: 'fr' }"));
    expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
      'true',
    );
    await setData(page, '#cb', 'value', 'is');
    expect(await page.$eval('[data-value="is"]', (el) => el.getAttribute('aria-selected'))).toBe(
      'true',
    );
    expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
      'false',
    );
    await page.close();
  });

  it('selects several values with multiple', async () => {
    const { page } = await open(markup('{ multiple: true, value: [] }'));
    await page.click('#cb-input');
    await settle(page);
    await page.click('[data-value="gh"]');
    await settle(page);
    await page.click('[data-value="fr"]');
    await settle(page);
    expect(await data(page, '#cb', 'value')).toEqual(['gh', 'fr']);
    await page.close();
  });

  describe('morphing', () => {
    it('picks up a new option list from the server', async () => {
      const { page, errors } = await open(markup());
      await type(page, 'a');
      expect(await isOpen(page)).toBe(true);

      // The server answers with a different list.
      await morph(
        page,
        '#cb',
        markup('{}', [
          ['ar', 'Argentina'],
          ['at', 'Austria'],
          ['ca', 'Canada'],
        ]),
      );

      expect(await isOpen(page)).toBe(true);
      expect(await page.$eval('#cb-input', (el) => el.getAttribute('role'))).toBe('combobox');
      expect(await visibleItems(page)).toEqual(['ar', 'at', 'ca']);
      expect(await page.$$eval('[data-test="fr"]', (els) => els.length)).toBe(0);

      // Keyboard navigation runs over the new items.
      await page.keyboard.press('ArrowDown');
      await settle(page);
      const active = await page.$eval('#cb-input', (el) =>
        el.getAttribute('aria-activedescendant'),
      );
      expect(await page.$eval(`[id="${active}"]`, (el) => el.getAttribute('data-value'))).toMatch(
        /^(ar|at|ca)$/,
      );
      await page.keyboard.press('Enter');
      await settle(page);
      expect(['ar', 'at', 'ca']).toContain(await data(page, '#cb', 'value'));
      expect(errors).toEqual([]);
      await page.close();
    });
  });

  describe('remote', () => {
    it('hands the search to the server and does not filter itself', async () => {
      const { page } = await open(markup("{ remote: true, search: '' }"));
      await type(page, 'zz');
      expect(await data(page, '#cb', 'search')).toBe('zz');
      // The server decides what matches, so nothing is hidden here.
      expect(await visibleItems(page)).toEqual(COUNTRIES.map(([value]) => value));

      // The server re-renders with its results.
      await morph(page, '#cb', markup("{ remote: true, search: '' }", [['zw', 'Zimbabwe']]));
      expect(await visibleItems(page)).toEqual(['zw']);
      await page.close();
    });
  });

  it('cleans up when destroyed, adding no listeners per instance', async () => {
    const { page } = await open('<div id="host"></div>');
    const cycle = async () => {
      await page.evaluate((html) => {
        document.querySelector('#host')!.innerHTML = html;
      }, markup());
      await settle(page);
      await type(page, 'g');
      await page.keyboard.press('Escape');
      await page.evaluate(() => {
        const alpine = (window as unknown as { Alpine: { destroyTree(el: Element): void } }).Alpine;
        const host = document.querySelector('#host')!;
        alpine.destroyTree(host);
        host.innerHTML = '';
      });
      await settle(page);
    };
    // Zag tracks keyboard versus pointer focus once per window, shared by every
    // widget, so the first mount adds those listeners for good.
    await cycle();
    const baseline = await listenerCount(page);
    await cycle();
    await cycle();
    expect(await listenerCount(page)).toBe(baseline);
    await page.close();
  });
});

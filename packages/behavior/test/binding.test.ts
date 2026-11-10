/**
 * Binding edge cases from review: several parts or widgets on one node,
 * items whose expression changes, ids on the component element, server-owned
 * inline styles, and large lists.
 */
import type { Page } from 'playwright';

import { close, data, morph, open, settle } from './browser';

afterAll(close);

/** Resolves when the page answers, or rejects if it is stuck in a microtask loop. */
async function responsive(page: Page, ms = 3000): Promise<void> {
  await Promise.race([
    page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50))),
    new Promise((_, reject) => setTimeout(() => reject(new Error('page hung')), ms)),
  ]);
}

describe('several sources on one node', () => {
  it('merges two parts of one widget on the same element', async () => {
    const { page, errors } = await open(`
<div id="d" x-data="apuiDialog()">
  <button id="t" x-apui:trigger>Open</button>
  <div id="p" x-apui:positioner x-apui:content><h2 x-apui:title>Both</h2></div>
</div>`);
    await page.$eval('#p', (el) => el.setAttribute('data-touched', ''));
    await responsive(page);
    // The later part wins plain attributes, as Zag's mergeProps does.
    expect(await page.$eval('#p', (el) => el.getAttribute('data-part'))).toBe('content');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('merges two widgets on the same element, such as a menu trigger inside a dialog', async () => {
    const { page, errors } = await open(`
<div x-data="apuiDialog()">
  <div x-data="apuiCombobox()">
    <button data-test="both" x-apui:trigger>Open</button>
  </div>
</div>`);
    // Bind the outer dialog's trigger to the same button from the outside.
    await page.evaluate(() => {
      const alpine = (
        window as unknown as {
          Alpine: {
            $data(el: Element): { apuiPart(p: string, el: Element, a: () => undefined): void };
          };
        }
      ).Alpine;
      const button = document.querySelector('[data-test="both"]')!;
      alpine
        .$data(button.parentElement!.parentElement!)
        .apuiPart('trigger', button, () => undefined);
    });
    await page.$eval('[data-test="both"]', (el) => el.setAttribute('data-touched', ''));
    await responsive(page);
    await settle(page);
    // The later binding wins shared attributes, as Zag's mergeProps does, and
    // attributes only one machine writes come through from both.
    const attrs = await page.$eval('[data-test="both"]', (el) => ({
      scope: el.getAttribute('data-scope'),
      haspopup: el.getAttribute('aria-haspopup'),
      tabindex: el.getAttribute('tabindex'),
    }));
    expect(attrs.scope).toBe('dialog');
    expect(attrs.haspopup).toBe('dialog');
    expect(attrs.tabindex).toBe('-1');
    expect(errors).toEqual([]);
    await page.close();
  });
});

describe('combobox items', () => {
  it('keeps item-text and item-indicator on the item when its expression changes', async () => {
    const { page } = await open(`
<div id="cb" x-data="apuiCombobox({ value: null })">
  <div x-apui:control><input id="i" x-apui:input /></div>
  <div x-apui:positioner>
    <ul x-apui:content x-data="{ v: 'a' }">
      <li data-test="item" x-apui:item="{ value: v, label: 'Item' }">
        <span data-test="text" x-apui:item-text>Item</span>
        <span data-test="mark" x-apui:item-indicator>✓</span>
      </li>
      <button id="switch" @click="v = 'b'">switch</button>
    </ul>
  </div>
</div>`);
    await page.$eval('#switch', (el) => (el as HTMLElement).click());
    await settle(page);
    await page.evaluate(() => {
      const alpine = (window as unknown as { Alpine: { $data(el: Element): { value: unknown } } })
        .Alpine;
      alpine.$data(document.querySelector('#cb')!).value = 'b';
    });
    await settle(page);
    expect(await page.$eval('[data-test="item"]', (el) => el.getAttribute('data-state'))).toBe(
      'checked',
    );
    expect(await page.$eval('[data-test="text"]', (el) => el.getAttribute('data-state'))).toBe(
      'checked',
    );
    expect(await page.$eval('[data-test="mark"]', (el) => el.hasAttribute('hidden'))).toBe(false);
    await page.close();
  });

  it('takes the label from item-text, not the indicator', async () => {
    const { page } = await open(`
<div id="cb" x-data="apuiCombobox({ value: 'fr' })">
  <div x-apui:control><input id="i" x-apui:input /></div>
  <div x-apui:positioner>
    <ul x-apui:content>
      <li x-apui:item="{ value: 'fr' }"><span x-apui:item-text>France</span><span x-apui:item-indicator>✓</span></li>
    </ul>
  </div>
</div>`);
    expect(await page.inputValue('#i')).toBe('France');
    await page.close();
  });

  it('stays quick with a long list', async () => {
    const items = Array.from(
      { length: 500 },
      (_, i) => `<li x-apui:item="{ value: 'v${i}', label: 'Item ${i}' }">Item ${i}</li>`,
    ).join('');
    const { page } = await open(`
<div x-data="apuiCombobox()">
  <div x-apui:control><input id="i" x-apui:input /></div>
  <div x-apui:positioner><ul x-apui:content>${items}</ul></div>
</div>`);
    await page.click('#i');
    await settle(page);
    const ms = await page.evaluate(async () => {
      const input = document.querySelector('#i')!;
      const start = performance.now();
      for (let n = 0; n < 10; n++) {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      return (performance.now() - start) / 10;
    });
    // A generous guard against quadratic work per render, not a benchmark.
    expect(ms).toBeLessThan(60);
    await page.close();
  });
});

describe('ids and server styles', () => {
  it('keeps the id of a part on the component element itself', async () => {
    const { page } = await open(`
<div id="picker" x-data="apuiCombobox()" x-apui:root>
  <div x-apui:control><input id="i" x-apui:input /></div>
</div>`);
    expect(await page.$eval('[x-apui\\:root]', (el) => el.id)).toBe('picker');
    expect(await page.$eval('#picker', (el) => el.getAttribute('data-part'))).toBe('root');
    await page.close();
  });

  it('keeps an open listbox positioned through a morph', async () => {
    const markup = `
<div id="cb" x-data="apuiCombobox()">
  <div id="cb-control" x-apui:control><input id="cb-input" x-apui:input /></div>
  <div id="cb-positioner" x-apui:positioner>
    <ul id="cb-list" x-apui:content><li x-apui:item="{ value: 'a', label: 'Alpha' }">Alpha</li></ul>
  </div>
</div>`;
    const { page } = await open(`<div style="padding-top: 300px">${markup}</div>`);
    await page.click('#cb-input');
    await settle(page);
    const before = await page.$eval('#cb-list', (el) => Math.round(el.getBoundingClientRect().top));
    await morph(page, '#cb', markup);
    const after = await page.$eval('#cb-list', (el) => Math.round(el.getBoundingClientRect().top));
    expect(
      await page.$eval('#cb-positioner', (el) => (el as HTMLElement).style.getPropertyValue('--y')),
    ).not.toBe('');
    expect(after).toBe(before);
    await page.close();
  });

  it('lets the server remove its own inline style from a part, and keeps the machine’s', async () => {
    const markup = (style: string) => `
<main id="app">
  <div x-data="apuiDialog()">
    <button id="t" x-apui:trigger>Open</button>
    <div x-apui:positioner>
      <div id="c" x-apui:content ${style}><h2 x-apui:title>T</h2><button id="x" x-apui:close-trigger>x</button></div>
    </div>
  </div>
</main>`;
    const { page } = await open(markup('style="max-height: 100px"'));
    await page.click('#t');
    await settle(page);
    await morph(page, '#app', markup(''));
    const style = await page.$eval('#c', (el) => ({
      max: (el as HTMLElement).style.maxHeight,
      events: (el as HTMLElement).style.pointerEvents,
    }));
    expect(style).toEqual({ max: '', events: 'auto' });
    expect(await data(page, '#app > div', 'open')).toBe(true);
    await page.close();
  });
});

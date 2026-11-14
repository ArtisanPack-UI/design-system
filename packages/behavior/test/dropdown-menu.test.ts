/**
 * DropdownMenu through the Alpine adapter (#50): the parts carry the
 * `dropdown-menu` scope, arrow keys and typeahead move between items,
 * choosing clicks the item and dispatches `select`, checkbox and radio items
 * report `checked-change`, Escape returns focus, open state binds to Alpine
 * data, and it survives a morph.
 */
import type { Page } from 'playwright';

import { close, data, morph, open, setData, settle } from './browser';

/** The menu as a server would render it: no machine attributes. */
const markup = (grid = false) => `
<div id="menu" x-data="apuiDropdownMenu({ open: false })">
  <button id="trigger" x-apui:trigger>Options</button>
  <div id="positioner" x-apui:positioner>
    <div id="content" x-apui:content>
      <div id="group" x-apui:item-group="{ id: 'edit' }">
        <div id="group-label" x-apui:item-group-label="{ htmlFor: 'edit' }">Edit</div>
        <div id="rename" x-apui:item="{ value: 'rename' }" onclick="window.clicked.push('rename')">
          <span x-apui:item-text="{ value: 'rename' }">Rename</span>
        </div>
        <div id="duplicate" x-apui:item="{ value: 'duplicate' }">
          <span x-apui:item-text="{ value: 'duplicate' }">Duplicate</span>
        </div>
        <div id="archive" x-apui:item="{ value: 'archive', disabled: true }">
          <span x-apui:item-text="{ value: 'archive' }">Archive</span>
        </div>
      </div>
      <hr id="separator" x-apui:separator>
      <div id="grid" x-apui:option-item="{ type: 'checkbox', value: 'grid', checked: ${grid} }">
        <span x-apui:item-indicator="{ value: 'grid', checked: ${grid} }">✓</span>
        <span x-apui:item-text="{ value: 'grid' }">Show grid</span>
      </div>
      <div id="delete" x-apui:item="{ value: 'delete' }">
        <span x-apui:item-text="{ value: 'delete' }">Delete</span>
      </div>
    </div>
  </div>
</div>
<button id="outside">Outside</button>`;

const isOpen = (page: Page) => page.$eval('#content', (el) => !el.hasAttribute('hidden'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
/** An item by value: the machine names items `<machine id>/<value>`, replacing authored ids. */
const item = (value: string) => `[data-part="item"][data-value="${value}"]`;
const highlighted = (page: Page) =>
  page.evaluate(
    () =>
      document.querySelector('[data-part="item"][data-highlighted]')?.getAttribute('data-value') ??
      '',
  );

/** Records events the menu dispatches, and clicks on items. */
async function record(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { events: unknown[]; clicked: string[] };
    w.events = [];
    w.clicked = [];
    const menu = document.querySelector('#menu')!;
    for (const name of ['select', 'open-change', 'checked-change']) {
      menu.addEventListener(name, (event) =>
        w.events.push([
          name,
          (event as CustomEvent).detail,
          (event.target as Element).getAttribute('data-value') ?? (event.target as Element).id,
        ]),
      );
    }
  });
}
const events = (page: Page) =>
  page.evaluate(() => (window as unknown as { events: unknown[] }).events);

afterAll(close);

describe('dropdown menu', () => {
  it('renders the parts closed, scoped dropdown-menu, with menu ARIA', async () => {
    const { page, errors } = await open(markup());
    expect(await isOpen(page)).toBe(false);
    const trigger = await page.$eval('#trigger', (el) => ({
      scope: el.getAttribute('data-scope'),
      part: el.getAttribute('data-part'),
      expanded: el.getAttribute('aria-expanded'),
      haspopup: el.getAttribute('aria-haspopup'),
      controls: el.getAttribute('aria-controls'),
    }));
    expect(trigger).toEqual({
      scope: 'dropdown-menu',
      part: 'trigger',
      expanded: 'false',
      haspopup: 'menu',
      controls: 'content',
    });
    const parts = await page.$$eval('#menu [data-part]', (els) =>
      els.map((el) => `${el.getAttribute('data-scope')}:${el.getAttribute('data-part')}`),
    );
    expect(new Set(parts.map((part) => part.split(':')[0]))).toEqual(new Set(['dropdown-menu']));
    expect(new Set(parts.map((part) => part.split(':')[1]))).toEqual(
      new Set([
        'trigger',
        'positioner',
        'content',
        'item-group',
        'item-group-label',
        'item',
        'item-text',
        'item-indicator',
        'separator',
      ]),
    );
    expect(await page.$eval('#content', (el) => el.getAttribute('role'))).toBe('menu');
    expect(await page.$eval(item('rename'), (el) => el.getAttribute('role'))).toBe('menuitem');
    expect(await page.$eval(item('grid'), (el) => el.getAttribute('role'))).toBe(
      'menuitemcheckbox',
    );
    expect(await page.$eval(item('archive'), (el) => el.getAttribute('aria-disabled'))).toBe(
      'true',
    );
    expect(await page.$eval('#group', (el) => el.getAttribute('aria-labelledby'))).toBe(
      await page.$eval('#group-label', (el) => el.id),
    );
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens from the keyboard on the first item and moves with arrows, skipping disabled items', async () => {
    const { page } = await open(markup());
    await page.focus('#trigger');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('true');
    expect(await highlighted(page)).toBe('rename');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    // Archive is disabled, so it's skipped.
    expect(await highlighted(page)).toBe('grid');
    await page.keyboard.press('End');
    await settle(page);
    expect(await highlighted(page)).toBe('delete');
    await page.keyboard.press('Home');
    await settle(page);
    expect(await highlighted(page)).toBe('rename');
    await page.close();
  });

  it('jumps by typeahead', async () => {
    const { page } = await open(markup());
    await page.focus('#trigger');
    await page.keyboard.press('Enter');
    await settle(page);
    await page.keyboard.type('du');
    await settle(page);
    expect(await highlighted(page)).toBe('duplicate');
    await page.close();
  });

  it('clicks the item on Enter, dispatches select and closes, returning focus', async () => {
    const { page } = await open(markup());
    await record(page);
    await page.focus('#trigger');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    await page.keyboard.press('Enter');
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(await focusedId(page)).toBe('trigger');
    expect(await page.evaluate(() => (window as unknown as { clicked: string[] }).clicked)).toEqual(
      ['rename'],
    );
    expect(await events(page)).toContainEqual(['select', { value: 'rename' }, 'menu']);
    expect(await events(page)).toContainEqual(['open-change', { open: false }, 'menu']);
    await page.close();
  });

  it('reports checked-change from a checkbox item, leaving checked to the page', async () => {
    const { page } = await open(markup());
    await record(page);
    await page.click('#trigger');
    await settle(page);
    await page.click(item('grid'));
    await settle(page);
    expect(await events(page)).toContainEqual([
      'checked-change',
      { value: 'grid', checked: true },
      'grid',
    ]);
    // The page sets checked (Livewire re-renders it); the item follows.
    await morph(page, '#menu', markup(true));
    expect(await page.$eval(item('grid'), (el) => el.getAttribute('aria-checked'))).toBe('true');
    await page.close();
  });

  it('closes on Escape and on an outside click', async () => {
    const { page } = await open(markup());
    await page.click('#trigger');
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(await focusedId(page)).toBe('trigger');

    await page.click('#trigger');
    await settle(page);
    await page.mouse.click(600, 500);
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    await page.close();
  });

  it('binds open to Alpine data both ways', async () => {
    const { page } = await open(markup());
    await setData(page, '#menu', 'open', true);
    expect(await isOpen(page)).toBe(true);
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await data(page, '#menu', 'open')).toBe(false);
    await page.close();
  });

  it('keeps the open state, ARIA and positioning through a morph', async () => {
    const { page, errors } = await open(markup());
    await page.click('#trigger');
    await settle(page);
    await morph(page, '#menu', markup());
    expect(await isOpen(page)).toBe(true);
    expect(await page.$eval('#content', (el) => el.getAttribute('role'))).toBe('menu');
    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('true');
    expect(
      await page.$eval('#positioner', (el) => (el as HTMLElement).style.position || ''),
    ).not.toBe('');
    // Keyboard navigation still runs over the morphed items.
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await highlighted(page)).not.toBe('');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens below the trigger at its start edge, mirrored in RTL', async () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const { page } = await open(
        `<div style="padding: 100px 200px">${markup()}</div>`.replace(
          'apuiDropdownMenu({ open: false })',
          'apuiDropdownMenu({ open: false })',
        ),
        { dir },
      );
      await page.click('#trigger');
      await settle(page);
      await settle(page);
      const [trigger, content] = await Promise.all(
        ['#trigger', '#content'].map((sel) =>
          page.$eval(sel, (el) => {
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
          }),
        ),
      );
      expect(content!.top).toBeGreaterThanOrEqual(trigger!.bottom);
      if (dir === 'ltr') expect(Math.round(content!.left)).toBe(Math.round(trigger!.left));
      else expect(Math.round(content!.right)).toBe(Math.round(trigger!.right));
      await page.close();
    }
  });
});

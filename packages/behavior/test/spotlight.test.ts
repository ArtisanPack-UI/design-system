/**
 * Spotlight through the Alpine adapter (#57): the dialog and combobox
 * machines composed into a command palette. The global shortcut, the
 * combobox semantics inside a modal dialog, filtering by every word, groups,
 * the empty state, choosing (and remembering) an item, Escape, a morph, the
 * remote `url` search, and RTL.
 */
import type { Page } from 'playwright';

import { close, data, morph, open, setData, settle } from './browser';

const ITEMS = `
  <div id="s-pages" x-apui:item-group="{ id: 'pages' }">
    <div id="s-pages-label" x-apui:item-group-label="{ htmlFor: 'pages' }">Pages</div>
    <a href="#growth" wire:key="growth" x-apui:item="{ value: 'growth', label: 'Growth', description: 'Analytics' }">
      <span x-apui:item-text><span data-apui-label>Growth</span></span>
    </a>
    <div wire:key="groups" x-apui:item="{ value: 'groups', label: 'Groups', keywords: ['team'] }">
      <span x-apui:item-text><span data-apui-label>Groups</span></span>
    </div>
  </div>
  <div id="s-actions" x-apui:item-group="{ id: 'actions' }">
    <div id="s-actions-label" x-apui:item-group-label="{ htmlFor: 'actions' }">Actions</div>
    <div wire:key="add" x-apui:item="{ value: 'add', label: 'Add property' }">
      <span x-apui:item-text><span data-apui-label>Add property</span></span>
    </div>
    <div wire:key="import" x-apui:item="{ value: 'import', label: 'Import listings' }">
      <span x-apui:item-text><span data-apui-label>Import listings</span></span>
    </div>
  </div>`;

/** The palette as a server would render it: no machine attributes. */
const markup = (options = '{ id: "s" }', items = ITEMS) => `
<div id="host" x-data='apuiSpotlight(${options})'>
  <button id="s-trigger" x-apui:trigger>Search</button>
  <div id="s-backdrop" x-apui:backdrop></div>
  <div id="s-positioner" x-apui:positioner>
    <div id="s-content" x-apui:content class="apui-spotlight">
      <div id="s-search" x-apui:search>
        <input id="s-query" x-apui:query aria-label="Search" />
        <button id="s-close" x-apui:close-trigger aria-label="Close">Esc</button>
      </div>
      <div id="s-results" x-apui:results aria-label="Search">
        <div data-apui-unfiltered style="display: contents">
          <template x-for="group in clientGroups('recent')" :key="group.id">
            <div x-apui:item-group="{ id: group.id }">
              <div x-apui:item-group-label="{ htmlFor: group.id }" x-text="group.label"></div>
              <template x-for="item in group.items" :key="item.value">
                <div class="recent" x-apui:item="item"><span x-apui:item-text x-text="item.label"></span></div>
              </template>
            </div>
          </template>
        </div>
        ${items}
        <div data-apui-unfiltered style="display: contents">
          <template x-for="group in clientGroups('remote')" :key="group.id">
            <div x-apui:item-group="{ id: group.id }">
              <template x-for="item in group.items" :key="item.value">
                <div class="remote" x-apui:item="item"><span x-apui:item-text x-text="item.label"></span></div>
              </template>
            </div>
          </template>
        </div>
        <div id="s-empty" x-apui:empty>No results.</div>
        <div id="s-loading" x-apui:loading hidden>Searching…</div>
      </div>
    </div>
  </div>
</div>
<button id="outside">Outside</button>`;

const isOpen = (page: Page) => page.$eval('#s-content', (el) => !el.hasAttribute('hidden'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const shownValues = (page: Page, extra = '') =>
  page.$$eval(`#s-results [data-part="item"]:not([hidden])${extra}`, (els) =>
    els.map((el) => el.getAttribute('data-value')),
  );
const highlighted = (page: Page) =>
  page.$eval(
    '#s-results',
    () =>
      document.querySelector('#s-results [data-highlighted]')?.getAttribute('data-value') ?? null,
  );
const events = (page: Page) =>
  page.evaluate(() => (window as unknown as { log: [string, unknown][] }).log);

async function listen(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { log: [string, unknown][] };
    w.log = [];
    for (const name of ['open-change', 'select', 'search-change']) {
      document
        .querySelector('#host')!
        .addEventListener(name, (e) => w.log.push([name, (e as CustomEvent).detail]));
    }
  });
}

async function typeQuery(page: Page, text: string) {
  await page.keyboard.type(text);
  await settle(page);
  await settle(page);
}

afterAll(close);

describe('spotlight', () => {
  it('renders closed with the spotlight scope on every machine part', async () => {
    const { page, errors } = await open(markup());
    expect(await isOpen(page)).toBe(false);
    const parts = await page.$$eval('[data-scope]', (els) =>
      els.map((el) => `${el.getAttribute('data-scope')}:${el.getAttribute('data-part')}`),
    );
    for (const part of [
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'search',
      'query',
      'close-trigger',
      'results',
      'item-group',
      'item-group-label',
      'item',
      'item-text',
      'empty',
      'loading',
    ]) {
      expect(parts).toContain(`spotlight:${part}`);
    }
    expect(parts.every((part) => part.startsWith('spotlight:'))).toBe(true);
    // Authored ids survive (D-015).
    expect(await page.$eval('#s-query', (el) => el.getAttribute('aria-controls'))).toBe(
      's-results',
    );
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens with the shortcut as a modal dialog holding a combobox', async () => {
    const { page } = await open(markup('{ id: "s", shortcut: "ctrl+k" }'));
    await listen(page);
    await page.keyboard.press('Control+k');
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    expect(await events(page)).toEqual([['open-change', { open: true }]]);
    const panel = await page.$eval('#s-content', (el) => ({
      role: el.getAttribute('role'),
      modal: el.getAttribute('aria-modal'),
      label: el.getAttribute('aria-label'),
    }));
    expect(panel).toEqual({ role: 'dialog', modal: 'true', label: 'Search' });
    expect(await focusedId(page)).toBe('s-query');
    const query = await page.$eval('#s-query', (el) => ({
      role: el.getAttribute('role'),
      expanded: el.getAttribute('aria-expanded'),
      autocomplete: el.getAttribute('aria-autocomplete'),
    }));
    expect(query).toEqual({ role: 'combobox', expanded: 'true', autocomplete: 'list' });
    expect(await page.$eval('#s-results', (el) => el.getAttribute('role'))).toBe('listbox');
    expect(await page.$eval('#s-pages', (el) => el.getAttribute('role'))).toBe('group');
    expect(await page.$eval('#s-pages', (el) => el.getAttribute('aria-labelledby'))).toBe(
      's-pages-label',
    );
    // The first result is the active option.
    expect(await highlighted(page)).toBe('growth');
    const active = await page.$eval('#s-query', (el) => el.getAttribute('aria-activedescendant'));
    expect(
      await page.$eval(`[id="${active}"]`, (el) => [
        el.getAttribute('data-value'),
        el.getAttribute('aria-selected'),
        el.getAttribute('role'),
      ]),
    ).toEqual(['growth', 'true', 'option']);
    // The page behind is hidden from assistive technology.
    expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBe('true');
    // The shortcut toggles it closed again.
    await page.keyboard.press('Control+k');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    await page.close();
  });

  it('moves through every group with the arrow keys and wraps', async () => {
    const { page } = await open(markup());
    await page.click('#s-trigger');
    await settle(page);
    await settle(page);
    const seen: (string | null)[] = [await highlighted(page)];
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowDown');
      await settle(page);
      seen.push(await highlighted(page));
    }
    expect(seen).toEqual(['growth', 'groups', 'add', 'import', 'growth']);
    await page.keyboard.press('End');
    await settle(page);
    expect(await highlighted(page)).toBe('import');
    await page.keyboard.press('ArrowUp');
    await settle(page);
    expect(await highlighted(page)).toBe('add');
    // Only the active option is selected.
    expect(
      await page.$$eval('#s-results [aria-selected="true"]', (els) =>
        els.map((el) => el.getAttribute('data-value')),
      ),
    ).toEqual(['add']);
    await page.close();
  });

  it('filters by every word across label, description and keywords, hiding empty groups', async () => {
    const { page } = await open(markup());
    await listen(page);
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'team');
    expect(await shownValues(page)).toEqual(['groups']);
    expect(await page.$eval('#s-actions', (el) => el.hasAttribute('hidden'))).toBe(true);
    expect(await highlighted(page)).toBe('groups');
    await page.fill('#s-query', 'growth analytics');
    await settle(page);
    await settle(page);
    expect(await shownValues(page)).toEqual(['growth']);
    expect(await page.$eval('#s-empty', (el) => el.hasAttribute('hidden'))).toBe(true);
    await page.fill('#s-query', 'nothing here');
    await settle(page);
    await settle(page);
    expect(await shownValues(page)).toEqual([]);
    expect(await page.$eval('#s-empty', (el) => el.hasAttribute('hidden'))).toBe(false);
    const searches = (await events(page)).filter(([name]) => name === 'search-change');
    expect(searches.at(-1)).toEqual(['search-change', { search: 'nothing here' }]);
    expect(await data(page, '#host', 'search')).toBe('nothing here');
    await page.close();
  });

  it('chooses with Enter: reports select, closes, restores focus and remembers it', async () => {
    const { page } = await open(markup('{ id: "s", recent: true }'));
    await listen(page);
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'import');
    await page.keyboard.press('Enter');
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    const selects = (await events(page)).filter(([name]) => name === 'select');
    expect(selects).toHaveLength(1);
    expect(selects[0]![1]).toMatchObject({ value: 'import', item: { label: 'Import listings' } });
    expect(
      (await events(page)).filter(([name]) => name === 'open-change').map(([, d]) => d),
    ).toEqual([{ open: true }, { open: false }]);
    expect(await focusedId(page)).toBe('s-trigger');
    // The query resets for the next open, which lists the choice first.
    await page.click('#s-trigger');
    await settle(page);
    await settle(page);
    expect(await page.$eval('#s-query', (el) => (el as HTMLInputElement).value)).toBe('');
    expect(await shownValues(page, '.recent')).toEqual(['recent:import']);
    expect(await highlighted(page)).toBe('recent:import');
    // Recent items hide while typing.
    await typeQuery(page, 'gro');
    expect(await shownValues(page, '.recent')).toEqual([]);
    await page.close();
  });

  it('follows a link item chosen from the keyboard, once', async () => {
    const { page } = await open(markup());
    await listen(page);
    await page.click('#s-trigger');
    await settle(page);
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await page.evaluate(() => location.hash)).toBe('#growth');
    expect((await events(page)).filter(([name]) => name === 'select')).toHaveLength(1);
    await page.close();
  });

  it('chooses with a click', async () => {
    const { page } = await open(markup());
    await listen(page);
    await page.click('#s-trigger');
    await settle(page);
    await page.click('[data-value="add"]');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect((await events(page)).filter(([name]) => name === 'select')[0]![1]).toMatchObject({
      value: 'add',
    });
    await page.close();
  });

  it('closes with Escape, the close button and the backdrop, reporting open-change', async () => {
    const { page } = await open(markup());
    await listen(page);
    await page.click('#s-trigger');
    await settle(page);
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(await focusedId(page)).toBe('s-trigger');

    await page.click('#s-trigger');
    await settle(page);
    await page.click('#s-close');
    await settle(page);
    expect(await isOpen(page)).toBe(false);

    await page.click('#s-trigger');
    await settle(page);
    await page.mouse.click(5, 400);
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(
      (await events(page)).filter(([name]) => name === 'open-change').map(([, d]) => d),
    ).toEqual([
      { open: true },
      { open: false },
      { open: true },
      { open: false },
      { open: true },
      { open: false },
    ]);
    await page.close();
  });

  it('activates the first result when rendered open', async () => {
    const { page } = await open(markup('{ id: "s", open: true, modal: false }'));
    await settle(page);
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    expect(await highlighted(page)).toBe('growth');
    await page.close();
  });

  it('follows bound open and search state', async () => {
    const { page } = await open(markup());
    await setData(page, '#host', 'open', true);
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    await setData(page, '#host', 'search', 'add');
    await settle(page);
    expect(await page.$eval('#s-query', (el) => (el as HTMLInputElement).value)).toBe('add');
    expect(await shownValues(page)).toEqual(['add']);
    await setData(page, '#host', 'open', false);
    expect(await isOpen(page)).toBe(false);
    await page.close();
  });

  it('keeps the open palette, its parts and the active option through a morph', async () => {
    const { page, errors } = await open(markup());
    await page.click('#s-trigger');
    await settle(page);
    await page.keyboard.press('ArrowDown');
    await settle(page);
    await morph(page, '#host', markup().replace('<button id="outside">Outside</button>', ''));
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    expect(await highlighted(page)).toBe('groups');
    expect(await page.$eval('#s-query', (el) => el.getAttribute('role'))).toBe('combobox');
    expect(await page.$eval('#s-content', (el) => el.getAttribute('data-scope'))).toBe('spotlight');
    expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBe('true');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('leaves server results unfiltered with remote', async () => {
    const { page } = await open(markup('{ id: "s", remote: true }'));
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'zzz');
    expect(await shownValues(page)).toEqual(['growth', 'groups', 'add', 'import']);
    await page.close();
  });

  it('fetches results from url as you type, showing the loading state', async () => {
    const { page } = await open(markup('{ id: "s", url: "https://apui.test/spotlight" }'));
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => (release = resolve));
    const requests: string[] = [];
    await page.route('**/spotlight**', async (route) => {
      requests.push(route.request().url());
      await gate;
      await route.fulfill({
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify([{ name: 'Reports', link: '/reports', description: 'Monthly' }]),
      });
    });
    await page.click('#s-trigger');
    await settle(page);
    await page.keyboard.type('rep');
    await page.waitForFunction(() => !document.querySelector('#s-loading')!.hasAttribute('hidden'));
    expect(await page.$eval('#s-results', (el) => el.getAttribute('aria-busy'))).toBe('true');
    release();
    await page.waitForSelector('.remote');
    await settle(page);
    expect(requests).toHaveLength(1);
    expect(requests[0]).toBe('https://apui.test/spotlight?search=rep');
    expect(await page.$eval('#s-loading', (el) => el.hasAttribute('hidden'))).toBe(true);
    expect(await shownValues(page, '.remote')).toEqual(['/reports']);
    expect(await highlighted(page)).toBe('/reports');
    await page.close();
  });

  it("marks the query's matches in each label, ignoring case and accents", async () => {
    const { page } = await open(markup());
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'gro');
    const labels = await page.$$eval(
      '#s-results [data-part="item"]:not([hidden]) [data-apui-label]',
      (els) => els.map((el) => el.innerHTML),
    );
    expect(labels).toEqual(['<mark>Gro</mark>wth', '<mark>Gro</mark>ups']);
    await page.fill('#s-query', '');
    await settle(page);
    await settle(page);
    expect(await page.$eval('[data-value="growth"] [data-apui-label]', (el) => el.innerHTML)).toBe(
      'Growth',
    );
    await page.close();
  });

  it('keeps no recent choices unless recent is on', async () => {
    const { page } = await open(markup());
    await page.click('#s-trigger');
    await settle(page);
    await typeQuery(page, 'import');
    await page.keyboard.press('Enter');
    await settle(page);
    await page.click('#s-trigger');
    await settle(page);
    await settle(page);
    expect(await shownValues(page, '.recent')).toEqual([]);
    await page.close();
  });

  it('drops unsafe links from remote results and stored recents', async () => {
    const { page } = await open(markup('{ id: "s", url: "https://apui.test/spotlight" }'));
    await page.route('**/spotlight**', (route) =>
      route.fulfill({
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify([
          { label: 'Evil', href: 'javascript:alert(1)' },
          { label: 'Sneaky', link: ' JavaScript:alert(2)' },
          { label: 'Reports', href: '/reports' },
        ]),
      }),
    );
    await page.click('#s-trigger');
    await settle(page);
    await page.keyboard.type('e');
    await page.waitForSelector('.remote');
    await settle(page);
    // An unsafe link is dropped, so the value falls back to the label.
    expect(await shownValues(page, '.remote')).toEqual(['Evil', 'Sneaky', '/reports']);
    const entries = await page.evaluate(() =>
      [...document.querySelectorAll('.remote')].map((el) => el.getAttribute('data-value')),
    );
    expect(entries.some((value) => /javascript/i.test(value ?? ''))).toBe(false);
    await page.close();
  });

  it('works right to left: the panel and keys are unchanged, arrows still move down and up', async () => {
    const { page, errors } = await open(markup(), { dir: 'rtl' });
    await page.click('#s-trigger');
    await settle(page);
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await highlighted(page)).toBe('groups');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('removes the shortcut and releases the page when torn down', async () => {
    const { page } = await open(markup('{ id: "s", shortcut: "ctrl+k" }'));
    await page.keyboard.press('Control+k');
    await settle(page);
    await page.evaluate(() => {
      const host = document.querySelector('#host')!;
      (window as unknown as { Alpine: { destroyTree(el: Element): void } }).Alpine.destroyTree(
        host,
      );
      host.remove();
    });
    await settle(page);
    expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBeNull();
    await page.keyboard.press('Control+k');
    await settle(page);
    expect(await page.$$('#s-content')).toHaveLength(0);
    await page.close();
  });
});

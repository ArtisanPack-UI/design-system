/**
 * Spotlight's CSS (#57) in Chromium: the panel, the active result, hidden
 * parts, the keys and RTL.
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

const palette = `
  <div data-scope="spotlight" data-part="positioner">
    <div class="apui-spotlight" data-scope="spotlight" data-part="content" data-state="open" role="dialog" aria-label="Search">
      <div data-scope="spotlight" data-part="search">
        <span data-scope="spotlight" data-part="icon"><svg viewBox="0 0 24 24"></svg></span>
        <input data-scope="spotlight" data-part="query" aria-label="Search" />
        <button data-scope="spotlight" data-part="close-trigger" aria-label="Close">Esc</button>
      </div>
      <div data-scope="spotlight" data-part="results" role="listbox">
        <div data-scope="spotlight" data-part="item-group" role="group">
          <div data-scope="spotlight" data-part="item-group-label">Pages</div>
          <div id="active" data-scope="spotlight" data-part="item" role="option" aria-selected="true" data-color="primary">
            <span data-scope="spotlight" data-part="tile"><svg viewBox="0 0 24 24"></svg></span>
            <span data-scope="spotlight" data-part="item-text">Reports<span data-scope="spotlight" data-part="item-description">Monthly</span></span>
            <span data-scope="spotlight" data-part="shortcut"><kbd>⌘</kbd><kbd>N</kbd></span>
            <span data-scope="spotlight" data-part="item-indicator" aria-hidden="true"><svg viewBox="0 0 24 24"></svg></span>
          </div>
          <div id="idle" data-scope="spotlight" data-part="item" role="option" aria-selected="false">
            <span data-scope="spotlight" data-part="item-text">Settings</span>
            <span data-scope="spotlight" data-part="item-indicator" aria-hidden="true"><svg viewBox="0 0 24 24"></svg></span>
          </div>
          <div id="filtered" data-scope="spotlight" data-part="item" role="option" hidden>Hidden</div>
        </div>
        <div id="empty" data-scope="spotlight" data-part="empty" hidden>No results.</div>
      </div>
      <div data-scope="spotlight" data-part="footer"><span>Navigate</span></div>
    </div>
  </div>`;

async function open(dir = 'ltr', theme = 'light'): Promise<Page> {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  await page.setContent(
    `<!doctype html><html dir="${dir}" data-theme="${theme}"><head><style>${apui}</style></head><body>${palette}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

/** A custom property's computed value, resolved as a color through a probe. */
const tokenColor = (page: Page, token: string) =>
  page.evaluate((name) => {
    const probe = document.createElement('div');
    probe.style.color = `var(${name})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

describe('Spotlight', () => {
  it('draws the panel at the spotlight width on the overlay surface', async () => {
    const page = await open();
    expect(await style(page, '.apui-spotlight', 'width')).toBe('640px');
    expect(await style(page, '.apui-spotlight', 'border-top-left-radius')).toBe('16px');
    expect(await style(page, '.apui-spotlight', 'background-color')).toBe(
      await tokenColor(page, '--apui-surface-overlay'),
    );
    expect(await style(page, '[data-part="search"]', 'height')).toBe('56px');
    await page.close();
  });

  it('tints the active result and keeps others plain', async () => {
    const page = await open();
    expect(await style(page, '#active', 'background-color')).toBe(
      await tokenColor(page, '--apui-selected-bg'),
    );
    expect(await style(page, '#idle', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await style(page, '#active', 'min-height')).toBe('44px');
    // The tile sits on the default surface inside the tinted row.
    expect(await style(page, '#active [data-part="tile"]', 'background-color')).toBe(
      await tokenColor(page, '--apui-surface-default'),
    );
    await page.close();
  });

  it('hides filtered results and the empty state while they carry hidden', async () => {
    const page = await open();
    expect(await style(page, '#filtered', 'display')).toBe('none');
    expect(await style(page, '#empty', 'display')).toBe('none');
    expect(await style(page, '[data-part="item-description"]', 'display')).toBe('block');
    await page.close();
  });

  it('draws keys as kbd and puts an item shortcut at the end', async () => {
    const page = await open();
    expect(await style(page, '[data-part="shortcut"] kbd', 'border-bottom-width')).toBe('2px');
    expect(await style(page, '[data-part="close-trigger"]', 'height')).toBe('18px');
    const [item, keys] = await Promise.all([
      page.$eval('#active', (el) => el.getBoundingClientRect().right),
      page.$eval('#active [data-part="shortcut"]', (el) => el.getBoundingClientRect().right),
    ]);
    expect(item - keys).toBeGreaterThan(10);
    await page.close();
  });

  it('shows the Enter glyph on the active result only, and marks matches', async () => {
    const page = await open();
    expect(await style(page, '#active [data-part="item-indicator"]', 'visibility')).toBe('visible');
    expect(await style(page, '#idle [data-part="item-indicator"]', 'visibility')).toBe('hidden');
    await page.evaluate(() => {
      document.querySelector('#idle [data-part="item-text"]')!.innerHTML = '<mark>Set</mark>tings';
    });
    expect(await style(page, '#idle mark', 'text-decoration-line')).toBe('underline');
    expect(await style(page, '#idle mark', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    await page.close();
  });

  it('mirrors the Enter glyph in RTL', async () => {
    const page = await open('rtl');
    expect(await style(page, '#active [data-part="item-indicator"] > svg', 'transform')).toBe(
      'matrix(-1, 0, 0, 1, 0, 0)',
    );
    await page.close();
  });

  it('mirrors in RTL: the search icon sits at the right', async () => {
    const page = await open('rtl');
    const [panel, icon] = await Promise.all([
      page.$eval('.apui-spotlight', (el) => el.getBoundingClientRect()),
      page.$eval('[data-part="icon"]', (el) => el.getBoundingClientRect()),
    ]);
    expect(panel.right - icon.right).toBeLessThan(30);
    await page.close();
  });

  it('shows the focus ring on the search row while the query has keyboard focus', async () => {
    const page = await open();
    await page.focus('[data-part="query"]');
    await page.keyboard.press('Shift');
    expect(await style(page, '[data-part="search"]', 'box-shadow')).toContain('inset');
    await page.close();
  });
});

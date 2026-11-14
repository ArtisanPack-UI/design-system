/**
 * ThemeToggle and ThemePreview (#65) in a real browser (Chromium): the
 * checked radio on the segmented track, square icon-only radios, and
 * miniatures drawn by the real tokens of the theme and preset they carry.
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

async function open(body: string): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html data-theme="light"><head><style>${apui}</style></head><body>${body}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

const radio = (value: string, checked: boolean, iconOnly = false) =>
  `<button id="${value}" type="button" data-scope="tabs" data-part="trigger" role="radio" data-value="${value}" aria-checked="${checked}" tabindex="${checked ? 0 : -1}"><span data-scope="tabs" data-part="icon" aria-hidden="true"><svg viewBox="0 0 24 24"></svg></span>${iconOnly ? `<span class="apui-sr-only">${value}</span>` : value}</button>`;

describe('ThemeToggle', () => {
  it('raises the checked radio on the segmented track, as a selected tab', async () => {
    const page = await open(`
      <div class="apui-theme-toggle apui-tabs" data-variant="segmented" data-size="md">
        <div data-scope="tabs" data-part="list" role="radiogroup" aria-label="Theme">${radio('light', false)}${radio('dark', true)}</div>
      </div>
      <div class="apui-tabs" data-variant="segmented"><div data-scope="tabs" data-part="list"><button id="tab" data-scope="tabs" data-part="trigger" aria-selected="true">Tab</button></div></div>`);
    expect(await style(page, '#dark', 'background-color')).toBe(
      await style(page, '#tab', 'background-color'),
    );
    expect(await style(page, '#dark', 'box-shadow')).toBe(await style(page, '#tab', 'box-shadow'));
    expect(await style(page, '#light', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await style(page, '.apui-theme-toggle', 'display')).toBe('inline-flex');
    await page.close();
  });

  it('keeps the focus ring on a checked radio', async () => {
    const page = await open(`
      <div class="apui-theme-toggle apui-tabs" data-variant="segmented">
        <div data-scope="tabs" data-part="list" role="radiogroup">${radio('dark', true)}</div>
      </div>`);
    await page.keyboard.press('Tab');
    expect(await style(page, '#dark', 'box-shadow')).toContain(', ');
    await page.close();
  });

  it('squares icon-only radios and hides their names visually', async () => {
    const page = await open(`
      <div class="apui-theme-toggle apui-tabs" data-variant="segmented" data-size="sm" data-icon-only>
        <div data-scope="tabs" data-part="list" role="radiogroup">${radio('light', true, true)}</div>
      </div>`);
    const box = await page.$eval('#light', (el) => el.getBoundingClientRect());
    expect(box.width).toBe(box.height);
    expect(await style(page, '#light .apui-sr-only', 'position')).toBe('absolute');
    await page.close();
  });
});

const miniature = (attributes: string, id: string) =>
  `<span id="${id}" data-scope="theme-preview" data-part="miniature" aria-hidden="true" ${attributes}><span data-scope="theme-preview" data-part="sidebar"><span data-scope="theme-preview" data-part="line" data-accent></span></span><span data-scope="theme-preview" data-part="main"></span></span>`;

describe('ThemePreview', () => {
  it('draws each miniature with the tokens of its theme and preset', async () => {
    const page = await open(`
      <div class="apui-theme-preview" role="radiogroup" aria-label="Theme">
        <label class="apui-theme-card" data-scope="theme-preview" data-part="card">
          <span data-scope="theme-preview" data-part="frame">${miniature('data-theme="dark"', 'dark')}</span>
        </label>
        <label class="apui-theme-card" data-scope="theme-preview" data-part="card">
          <span data-scope="theme-preview" data-part="frame">${miniature('data-theme="light"', 'light')}${miniature('data-theme="light" data-preset="harbor"', 'harbor')}</span>
        </label>
      </div>
      <div id="page-dark" data-theme="dark" style="background: var(--apui-surface-page)"></div>
      <div id="page-harbor" data-theme="light" data-preset="harbor" style="background: var(--apui-surface-page)"></div>`);
    expect(await style(page, '#dark', 'background-color')).toBe(
      await style(page, '#page-dark', 'background-color'),
    );
    expect(await style(page, '#harbor', 'background-color')).toBe(
      await style(page, '#page-harbor', 'background-color'),
    );
    expect(await style(page, '#light', 'background-color')).not.toBe(
      await style(page, '#dark', 'background-color'),
    );
    await page.close();
  });

  it('rings the checked card and fills its radio, following the native radio', async () => {
    const card = (value: string, checked: boolean) => `
      <label id="card-${value}" class="apui-theme-card" data-scope="theme-preview" data-part="card">
        <span id="frame-${value}" data-scope="theme-preview" data-part="frame">${miniature('data-theme="light"', `mini-${value}`)}</span>
        <span data-scope="theme-preview" data-part="label">
          <span id="box-${value}" data-scope="theme-preview" data-part="box"><input id="control-${value}" type="radio" name="t" value="${value}" data-scope="theme-preview" data-part="control" ${checked ? 'checked' : ''}><span data-scope="theme-preview" data-part="indicator"></span></span>
          <span data-scope="theme-preview" data-part="text">${value}</span>
        </span>
      </label>`;
    const page = await open(
      `<div class="apui-theme-preview" role="radiogroup" aria-label="Theme">${card('light', true)}${card('dark', false)}</div>`,
    );
    expect(await style(page, '#frame-light', 'box-shadow')).not.toBe('none');
    expect(await style(page, '#frame-dark', 'box-shadow')).toBe('none');
    expect(await style(page, '#box-light', 'background-color')).not.toBe(
      await style(page, '#box-dark', 'background-color'),
    );
    // The frame's ring transitions; reduced motion takes it out.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.click('#card-dark');
    expect(await style(page, '#frame-dark', 'box-shadow')).not.toBe('none');
    expect(await style(page, '#frame-light', 'box-shadow')).toBe('none');
    await page.close();
  });

  it('splits the system card into halves that follow the text direction', async () => {
    const page = await open(`
      <div dir="rtl" style="inline-size: 400px">
        <div class="apui-theme-preview" role="radiogroup" aria-label="Theme">
          <label class="apui-theme-card" data-scope="theme-preview" data-part="card">
            <span id="frame" data-scope="theme-preview" data-part="frame">${miniature('data-theme="light" data-half="start"', 'start')}${miniature('data-theme="dark" data-half="end"', 'end')}</span>
          </label>
        </div>
      </div>`);
    const frame = await page.$eval('#frame', (el) => el.getBoundingClientRect());
    const start = await page.$eval('#start', (el) => el.getBoundingClientRect());
    const end = await page.$eval('#end', (el) => el.getBoundingClientRect());
    expect(Math.round(start.right)).toBe(Math.round(frame.right - 1));
    expect(Math.round(end.left)).toBe(Math.round(frame.left + 1));
    expect(Math.round(start.width)).toBe(Math.round(end.width));
    await page.close();
  });
});

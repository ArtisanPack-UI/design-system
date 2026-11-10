/**
 * Presets at runtime (#23), in Chromium: data-preset swaps every token a
 * preset reassigns without touching component CSS, per subtree, and keeps
 * working with data-theme and data-density set around it, on it or inside it.
 */
import { chromium, type Browser, type Page } from 'playwright';

import { presets, tokens } from '@artisanpack-ui/tokens';

import { bundle } from '../build.mjs';

const apui = bundle();
let browser: Browser;

type Resolved = string | Record<string, string>;

/** A resolved value from the token map, or from a preset when it changes the token. */
function value(path: string, mode?: string, preset?: keyof typeof presets): string {
  const fromPreset = preset
    ? (presets[preset].tokens as Record<string, { resolved: Resolved }>)[path]
    : undefined;
  const resolved: Resolved = fromPreset?.resolved ?? tokens[path as keyof typeof tokens].resolved;
  return typeof resolved === 'string' ? resolved : resolved[mode!]!;
}

async function open(body: string, { htmlAttributes = '', appCss = '' } = {}): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${appCss}</style><style>${apui}</style></head><body>${body}</body></html>`,
  );
  return page;
}

const prop = (page: Page, selector: string, name: string) =>
  page.$eval(selector, (el, p) => getComputedStyle(el).getPropertyValue(p).trim(), name);

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
});

describe('presets (#23)', () => {
  it('ships Ledger and Harbor in the bundle, and leaves brand presets opt-in', () => {
    expect(apui).toContain('[data-preset="ledger"]');
    expect(apui).toContain('[data-preset="harbor"]');
    expect(apui).not.toContain('[data-preset="forest"]');
  });

  it('swaps at runtime, and swaps back', async () => {
    const page = await open('<div id="t" class="apui-x"></div>');
    const read = () => prop(page, '#t', '--apui-input-radius');
    expect(await read()).toBe(value('input.radius'));
    await page.evaluate(() => document.documentElement.setAttribute('data-preset', 'ledger'));
    expect(await read()).toBe(value('input.radius', undefined, 'ledger'));
    await page.evaluate(() => document.documentElement.setAttribute('data-preset', 'harbor'));
    expect(await read()).toBe(value('input.radius', undefined, 'harbor'));
    await page.evaluate(() => document.documentElement.removeAttribute('data-preset'));
    expect(await read()).toBe(value('input.radius'));
    await page.close();
  });

  it('applies to a subtree only', async () => {
    const page = await open(
      '<div id="out"></div><section data-preset="ledger"><div id="in"></div></section>',
    );
    expect(await prop(page, '#out', '--apui-card-radius')).toBe(value('card.radius'));
    expect(await prop(page, '#in', '--apui-card-radius')).toBe(
      value('card.radius', undefined, 'ledger'),
    );
    expect(await prop(page, '#in', '--apui-text-muted')).toBe(
      value('text.muted', 'light', 'ledger'),
    );
    await page.close();
  });

  it.each([
    ['on the same element', '<div id="t" data-preset="ledger" data-theme="dark"></div>', ''],
    [
      'inside the theme',
      '<div data-theme="dark"><div id="t" data-preset="ledger"></div></div>',
      '',
    ],
    [
      'around the theme',
      '<div data-preset="ledger"><div id="t" data-theme="dark"></div></div>',
      '',
    ],
    ['with the theme on <html>', '<div id="t" data-preset="ledger"></div>', 'data-theme="dark"'],
  ])('follows a theme set %s', async (_label, body, htmlAttributes) => {
    const page = await open(body, { htmlAttributes });
    expect(await prop(page, '#t', '--apui-color-primary')).toBe(
      value('color.primary', 'dark', 'ledger'),
    );
    expect(await prop(page, '#t', '--apui-selected-bg')).toBe(
      value('selected.bg', 'dark', 'ledger'),
    );
    expect(await prop(page, '#t', '--apui-surface-default')).toBe(
      value('surface.default', 'dark', 'ledger'),
    );
    await page.close();
  });

  it.each([
    ['around the preset', '<div id="t" data-preset="ledger"></div>', 'data-density="compact"'],
    [
      'inside the preset',
      '<div data-preset="ledger"><div id="t" data-density="compact"></div></div>',
      '',
    ],
  ])('follows a density set %s, including aliases', async (_label, body, htmlAttributes) => {
    const page = await open(body, { htmlAttributes });
    expect(await prop(page, '#t', '--apui-panel-padding')).toBe(
      value('panel.padding', 'compact', 'ledger'),
    );
    expect(await prop(page, '#t', '--apui-card-padding')).toBe(
      value('card.padding', 'compact', 'ledger'),
    );
    expect(await prop(page, '#t', '--apui-row-height')).toBe(
      value('row.height', 'compact', 'ledger'),
    );
    await page.close();
  });

  it('keeps Harbor ink in every theme, and its light canvas in light only', async () => {
    const page = await open(
      '<div data-preset="harbor"><div id="light"></div><div id="dark" data-theme="dark"></div></div>',
    );
    for (const [id, theme] of [
      ['#light', 'light'],
      ['#dark', 'dark'],
    ] as const) {
      expect(await prop(page, id, '--apui-color-primary')).toBe(value('color.neutral', theme));
      expect(await prop(page, id, '--apui-surface-page')).toBe(
        value('surface.page', theme, 'harbor'),
      );
    }
    expect(await prop(page, '#light', '--apui-surface-page')).toBe('#ebf1f7');
    expect(await prop(page, '#dark', '--apui-surface-page')).toBe(value('surface.page', 'dark'));
    await page.close();
  });

  it('lets app CSS override a preset token without !important', async () => {
    const page = await open('<div id="t" data-preset="ledger"></div>', {
      appCss: '#t { --apui-button-radius: 7px; }',
    });
    expect(await prop(page, '#t', '--apui-button-radius')).toBe('7px');
    await page.close();
  });

  it('changes the rendered component, not just the variable', async () => {
    const fixture = `@layer apui.components { .apui-fixture { border-radius: var(--apui-card-radius); padding: var(--apui-card-padding); } }`;
    const page = await open(
      `<style>${fixture}</style><div id="a" class="apui-fixture"></div><div data-preset="harbor"><div id="b" class="apui-fixture"></div></div>`,
    );
    expect(await prop(page, '#a', 'border-start-start-radius')).toBe(value('card.radius'));
    expect(await prop(page, '#b', 'border-start-start-radius')).toBe(
      value('card.radius', undefined, 'harbor'),
    );
    expect(await prop(page, '#b', 'padding-inline-start')).toBe(
      value('card.padding', 'default', 'harbor'),
    );
    await page.close();
  });
});

/**
 * The token playground (#29) in Chromium: every foundation shows, the preset,
 * theme and density switchers drive the preview, and edited semantic tokens
 * reach the sample UI, including tokens that alias them.
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, type Browser, type Page } from 'playwright';

import { presets, tokens } from '@artisanpack-ui/tokens';

import { writePlayground } from '../build.mjs';

let browser: Browser;
let dir: string;
let url: string;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), 'apui-playground-'));
  url = pathToFileURL(writePlayground(dir)).href;
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  rmSync(dir, { recursive: true, force: true });
});

const errors: string[] = [];

async function open(query = ''): Promise<Page> {
  const page = await browser.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  // Fonts come from Google Fonts; keep the tests offline.
  await page.route(/^https?:/, (route) => route.abort());
  await page.goto(`${url}${query}`);
  await page.waitForSelector('[data-pg-ready]');
  // Read end states, not values mid-transition.
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
  return page;
}

afterEach(() => {
  expect(errors.splice(0)).toEqual([]);
});

/** A custom property's value on the preview. */
const stageVar = (page: Page, name: string) =>
  page.$eval('#pg-stage', (stage, n) => getComputedStyle(stage).getPropertyValue(n).trim(), name);

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, p) => getComputedStyle(element).getPropertyValue(p).trim(),
    property,
  );

const resolved = (path: keyof typeof tokens, mode: string) =>
  (tokens[path].resolved as Record<string, string>)[mode];

describe('foundations', () => {
  it.each(['color', 'type', 'space', 'radius', 'elevation', 'motion', 'focus', 'glass'])(
    'shows %s',
    async (section) => {
      const page = await open();
      expect(await page.$$eval(`#pg-${section} > *`, (nodes) => nodes.length)).toBeGreaterThan(0);
      await page.close();
    },
  );

  it('shows every type style and every role', async () => {
    const page = await open();
    const styles = new Set(
      Object.keys(tokens)
        .filter((path) => path.startsWith('type.'))
        .map((path) => path.split('.')[1]),
    );
    expect(await page.$$eval('.pg-type-row', (rows) => rows.length)).toBe(styles.size);
    expect(await page.$$eval('.pg-role', (rows) => rows.length)).toBe(8);
    await page.close();
  });

  it('shows the computed value next to each token', async () => {
    const page = await open();
    expect(await page.textContent('#pg-color [data-pg-value="--apui-surface-page"]')).toBe(
      resolved('surface.page', 'light'),
    );
    await page.close();
  });
});

describe('switchers', () => {
  it('switches the theme on the preview only', async () => {
    const page = await open();
    await page.click('label[for="pg-theme-dark"]');
    expect(await page.getAttribute('#pg-stage', 'data-theme')).toBe('dark');
    expect(await stageVar(page, '--apui-surface-page')).toBe(resolved('surface.page', 'dark'));
    expect(await page.getAttribute('html', 'data-theme')).toBe('light');
    await page.close();
  });

  it('switches density, and component tokens that alias it follow', async () => {
    const page = await open();
    await page.click('label[for="pg-density-compact"]');
    expect(await stageVar(page, '--apui-panel-padding')).toBe(resolved('panel.padding', 'compact'));
    expect(await style(page, '.pg-density-card', 'padding-top')).toBe(
      resolved('panel.padding', 'compact'),
    );
    await page.close();
  });

  it('switches the preset', async () => {
    const page = await open();
    await page.selectOption('#pg-preset', 'ledger');
    expect(await page.getAttribute('#pg-stage', 'data-preset')).toBe('ledger');
    const radius = presets.ledger.tokens['button.radius' as keyof typeof presets.ledger.tokens];
    expect(await style(page, '.pg-btn-solid', 'border-top-left-radius')).toBe(
      (radius as { resolved: string }).resolved,
    );
    await page.selectOption('#pg-preset', '');
    expect(await page.getAttribute('#pg-stage', 'data-preset')).toBeNull();
    await page.close();
  });

  it('switches direction', async () => {
    const page = await open();
    await page.click('label[for="pg-dir-rtl"]');
    expect(await page.getAttribute('#pg-stage', 'dir')).toBe('rtl');
    await page.close();
  });

  it('starts from the query string', async () => {
    const page = await open('?preset=harbor&theme=dark&density=comfortable');
    expect(await page.getAttribute('#pg-stage', 'data-preset')).toBe('harbor');
    expect(await page.getAttribute('#pg-stage', 'data-theme')).toBe('dark');
    expect(await page.getAttribute('#pg-stage', 'data-density')).toBe('comfortable');
    expect(await page.inputValue('#pg-preset')).toBe('harbor');
    expect(await page.isChecked('#pg-theme-dark')).toBe(true);
    await page.close();
  });

  it('ignores unknown values in the query string', async () => {
    const page = await open('?preset=nope&theme=sepia');
    expect(await page.getAttribute('#pg-stage', 'data-preset')).toBeNull();
    expect(await page.getAttribute('#pg-stage', 'data-theme')).toBe('light');
    await page.close();
  });
});

describe('editing tokens', () => {
  /** Types a value into a token's row in the editor. */
  async function edit(page: Page, path: string, value: string) {
    await page.fill('#pg-filter', path);
    await page.fill(`#pg-edit-${path.replace(/\./g, '-')}`, value);
    await page.press(`#pg-edit-${path.replace(/\./g, '-')}`, 'Enter');
  }

  it('lists every semantic token', async () => {
    const page = await open();
    const semantic = Object.values(tokens).filter((token) => token.tier === 'semantic').length;
    expect(await page.$$eval('[data-pg-token]', (rows) => rows.length)).toBe(semantic);
    await page.close();
  });

  it('applies an override to the sample UI', async () => {
    const page = await open();
    await edit(page, 'color.primary', '#ff0000');
    expect(await style(page, '.pg-btn-solid', 'background-color')).toBe('rgb(255, 0, 0)');
    expect(await page.textContent('#pg-overrides')).toContain('--apui-color-primary: #ff0000;');
    await page.close();
  });

  it('reaches tokens that alias the edited one, even ones declared on :root', async () => {
    const page = await open();
    await edit(page, 'radius.control', '3px');
    // --apui-button-radius: var(--apui-radius-control) is declared on :root only.
    expect(await style(page, '.pg-btn-solid', 'border-top-left-radius')).toBe('3px');
    await page.close();
  });

  it('keeps overrides across theme and preset changes, using that mode’s aliases', async () => {
    const page = await open();
    await edit(page, 'color.primary-soft', '#00ff00');
    await page.click('label[for="pg-theme-dark"]');
    // selected.bg aliases color.primary-soft in every theme.
    expect(await stageVar(page, '--apui-selected-bg')).toBe('#00ff00');
    await page.selectOption('#pg-preset', 'harbor');
    expect(await stageVar(page, '--apui-color-primary-soft')).toBe('#00ff00');
    // Harbor's dark primary is the neutral ink, not the base steel.
    expect(await stageVar(page, '--apui-color-primary')).toBe(resolved('color.neutral', 'dark'));
    await page.close();
  });

  it('picks a color with the swatch', async () => {
    const page = await open();
    await page.fill('#pg-filter', 'color.primary');
    await page
      .locator('[data-pg-token="color.primary"] input[type="color"]')
      .evaluate((input: HTMLInputElement) => {
        input.value = '#123456';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    expect(await stageVar(page, '--apui-color-primary')).toBe('#123456');
    await page.close();
  });

  it('resets one token and all tokens', async () => {
    const page = await open();
    await edit(page, 'color.primary', '#ff0000');
    await edit(page, 'radius.control', '3px');
    await page.click('[aria-label="Reset radius.control"]');
    expect(await page.textContent('#pg-overrides')).not.toContain('radius-control');
    await page.click('#pg-reset');
    expect(await page.textContent('#pg-overrides')).toBe('');
    expect(await stageVar(page, '--apui-color-primary')).toBe(resolved('color.primary', 'light'));
    expect(await page.$eval('#pg-stage', (stage) => stage.getAttribute('style'))).toBeFalsy();
    await page.close();
  });
});

/**
 * Headless mode (#25): the same stylesheet without the apui.components layer.
 * Markup, ARIA and behavior are identical; only the visual CSS goes. The
 * reset, tokens, presets and utilities (.apui-sr-only, the focus ring) stay,
 * so hidden text stays hidden and headless markup can still use the tokens.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium, type Browser, type Page } from 'playwright';

import { buildDist, bundle, formatAssetsPhp, LAYERS } from '../build.mjs';

const fixtures = join(__dirname, 'fixtures', 'headless');
const fixture = join(fixtures, 'index.css');
const full = bundle(fixture);
const headless = bundle(fixture, { headless: true });
const dist = buildDist();
let browser: Browser;

/** Markup the Livewire, React and Vue packages render identically in both modes. */
const MARKUP = `
  <div id="root" class="apui-disclosure" data-state="open">
    <button id="trigger" type="button" data-scope="disclosure" data-part="trigger"
      aria-expanded="true" aria-controls="panel">
      Shipping details
      <span class="apui-sr-only">(expanded)</span>
    </button>
    <div id="panel" role="region" aria-labelledby="trigger" data-scope="disclosure" data-part="content">
      Ships in two days.
    </div>
  </div>`;

/** The disclosure's behavior: toggles state and ARIA, as the behavior engine will. */
const BEHAVIOR = `
  document.getElementById('trigger').addEventListener('click', (event) => {
    const root = document.getElementById('root');
    const open = root.dataset.state !== 'open';
    root.dataset.state = open ? 'open' : 'closed';
    event.currentTarget.setAttribute('aria-expanded', String(open));
    document.getElementById('panel').hidden = !open;
  });`;

async function open(css: string): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html><head><style>${css}</style></head><body>${MARKUP}<script>${BEHAVIOR}</script></body></html>`,
  );
  return page;
}

/** The DOM, the accessibility tree and the trigger's state, before and after a click. */
async function snapshot(page: Page) {
  const read = async () => ({
    html: await page.$eval('#root', (el) => el.outerHTML),
    aria: await page.locator('body').ariaSnapshot(),
  });
  const before = await read();
  await page.click('#trigger');
  const after = await read();
  await page.keyboard.press('Tab');
  return { before, after };
}

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
});

describe('the headless bundle', () => {
  it('leaves out component stylesheets and nothing else', () => {
    expect(full).toContain('.apui-disclosure {');
    expect(headless).not.toContain('.apui-disclosure');
    expect(headless).toContain('/* headless: ./components/disclosure.css left out */');
    const component = readFileSync(join(fixtures, 'components', 'disclosure.css'), 'utf8');
    expect(headless).toBe(
      full.replace(component.trimEnd(), '/* headless: ./components/disclosure.css left out */'),
    );
  });

  it('keeps the layer order, reset, tokens and utilities', () => {
    expect(headless).toContain('@layer apui.reset, apui.tokens, apui.components, apui.utilities;');
    for (const layer of ['apui.reset', 'apui.tokens', 'apui.utilities']) {
      expect(headless).toContain(`@layer ${layer} {`);
    }
    expect(headless).toContain('.apui-sr-only {');
  });

  it('ships as dist/headless.css, built from the same entry as dist/index.css', () => {
    expect(dist['headless.css']).toBe(bundle(undefined, { headless: true }));
    expect(dist['index.css']).toBe(bundle());
    expect(dist['headless.css']).toContain('[data-preset="ledger"]');
  });
});

describe('markup, ARIA and behavior are unchanged', () => {
  it('in the DOM and the accessibility tree, before and after interaction', async () => {
    const styled = await open(full);
    const bare = await open(headless);
    const [a, b] = [await snapshot(styled), await snapshot(bare)];
    expect(b).toEqual(a);
    expect(a.after.html).toContain('aria-expanded="false"');
    expect(a.before.aria).toContain('region "Shipping details (expanded)"');
    await Promise.all([styled.close(), bare.close()]);
  });

  it('while the visual CSS is gone', async () => {
    const styled = await open(full);
    const bare = await open(headless);
    const background = (page: Page) =>
      page.$eval('#trigger', (el) => getComputedStyle(el).backgroundColor);
    expect(await background(styled)).not.toBe(await background(bare));
    await Promise.all([styled.close(), bare.close()]);
  });

  it('keeps visually hidden text hidden', async () => {
    const bare = await open(headless);
    expect(await bare.$eval('.apui-sr-only', (el) => getComputedStyle(el).position)).toBe(
      'absolute',
    );
    await bare.close();
  });
});

describe('the Livewire switch', () => {
  it('lists the entry points for the published assets (#42)', () => {
    const php = formatAssetsPhp();
    expect(php).toContain("'default'  => 'index.css',");
    expect(php).toContain("'headless' => 'headless.css',");
    expect(php).toContain(`'layers'  => [ ${LAYERS.map((l: string) => `'${l}'`).join(', ')} ],`);
    expect(dist['assets.php']).toBe(php);
  });
});

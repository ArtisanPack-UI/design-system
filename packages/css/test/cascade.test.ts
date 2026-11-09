/**
 * Cascade behavior in a real browser (Chromium through Playwright):
 *
 * - App CSS overrides every apui layer without !important (#21).
 * - The layers stack in order: reset, tokens, components, utilities.
 * - Theme and density switch globally and per subtree, and component tokens
 *   that alias density tokens follow them (#22).
 */
import { chromium, type Browser, type Page } from 'playwright';

import { tokens } from '@artisanpack-ui/tokens';

import { bundle } from '../build.mjs';

const apui = bundle();
let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
});

/**
 * Opens a page. `appCss` loads before the design system, so it wins only
 * because it is unlayered, not because it comes later.
 */
async function open(
  body: string,
  { appCss = '', fixtureCss = '', htmlAttributes = '' } = {},
): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${appCss}</style><style>${apui}</style><style>${fixtureCss}</style></head><body>${body}</body></html>`,
  );
  return page;
}

async function style(page: Page, selector: string, property: string): Promise<string> {
  return page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );
}

const resolved = (path: keyof typeof tokens, mode: string) =>
  (tokens[path].resolved as Record<string, string>)[mode];

describe('app CSS wins without !important', () => {
  it('overrides a token, even one set by a theme attribute', async () => {
    const page = await open('<div id="target"></div>', {
      appCss: ':root { --apui-color-primary: #010203; }',
      htmlAttributes: 'data-theme="dark"',
    });
    expect(await style(page, 'html', '--apui-color-primary')).toBe('#010203');
    await page.close();
  });

  it('overrides a component rule of much higher specificity', async () => {
    const page = await open('<div id="target" class="apui-fixture" data-variant="soft"></div>', {
      appCss: '.apui-fixture { color: rgb(0, 128, 0); }',
      fixtureCss:
        '@layer apui.components { #target.apui-fixture[data-variant="soft"] { color: rgb(255, 0, 0); } }',
    });
    expect(await style(page, '#target', 'color')).toBe('rgb(0, 128, 0)');
    await page.close();
  });

  it('overrides a utility', async () => {
    const page = await open('<span id="target" class="apui-sr-only">Hidden</span>', {
      appCss: '.apui-sr-only { position: static; }',
    });
    expect(await style(page, '#target', 'position')).toBe('static');
    await page.close();
  });

  it('overrides the reset', async () => {
    const page = await open('<div id="target" class="apui-fixture"></div>', {
      appCss: '#target { box-sizing: content-box; }',
    });
    expect(await style(page, '#target', 'box-sizing')).toBe('content-box');
    await page.close();
  });
});

describe('layer order', () => {
  it('lets utilities beat components and components beat the reset', async () => {
    const page = await open(
      '<span id="a" class="apui-sr-only">A</span><div id="b" class="apui-fixture"></div>',
      {
        fixtureCss: `@layer apui.components {
        #a.apui-sr-only { position: relative; }
        #b.apui-fixture { box-sizing: content-box; }
      }`,
      },
    );
    expect(await style(page, '#a', 'position')).toBe('absolute');
    expect(await style(page, '#b', 'box-sizing')).toBe('content-box');
    await page.close();
  });

  it('scopes the reset to design-system markup', async () => {
    const page = await open(
      '<div id="app"></div><div id="ds" class="apui-fixture"><span id="part"></span></div>',
    );
    expect(await style(page, '#app', 'box-sizing')).toBe('content-box');
    expect(await style(page, '#ds', 'box-sizing')).toBe('border-box');
    expect(await style(page, '#part', 'box-sizing')).toBe('border-box');
    await page.close();
  });
});

describe('density (#22)', () => {
  const fixture = `
    <div id="page" class="apui-fixture" style="padding-inline: var(--apui-card-padding)"></div>
    <section id="comfortable" data-density="comfortable">
      <div id="card" class="apui-fixture" style="padding-inline: var(--apui-card-padding)"></div>
      <section id="compact" data-density="compact">
        <div id="inner" class="apui-fixture" style="padding-inline: var(--apui-card-padding)"></div>
      </section>
    </section>`;

  it('defaults to the default mode', async () => {
    const page = await open(fixture);
    expect(await style(page, 'html', '--apui-density')).toBe('1');
    expect(await style(page, '#page', 'padding-inline-start')).toBe(
      resolved('card.padding', 'default'),
    );
    await page.close();
  });

  it('switches globally from <html>', async () => {
    const page = await open(fixture, { htmlAttributes: 'data-density="compact"' });
    expect(await style(page, 'html', '--apui-density')).toBe('0.8');
    expect(await style(page, '#page', 'padding-inline-start')).toBe(
      resolved('card.padding', 'compact'),
    );
    expect(await style(page, '#page', '--apui-row-height')).toBe(resolved('row.height', 'compact'));
    await page.close();
  });

  it('switches per subtree, and nested subtrees switch back', async () => {
    const page = await open(fixture, { htmlAttributes: 'data-density="compact"' });
    expect(await style(page, '#card', 'padding-inline-start')).toBe(
      resolved('card.padding', 'comfortable'),
    );
    expect(await style(page, '#card', '--apui-table-row-height')).toBe(
      resolved('table.row-height', 'comfortable'),
    );
    expect(await style(page, '#card', '--apui-table-cell-padding-x')).toBe(
      resolved('table.cell-padding-x', 'comfortable'),
    );
    expect(await style(page, '#inner', 'padding-inline-start')).toBe(
      resolved('card.padding', 'compact'),
    );
    await page.close();
  });

  it('does not change control sizes', async () => {
    const page = await open(fixture);
    const heights = await Promise.all(
      ['#page', '#card', '#inner'].map((selector) =>
        style(page, selector, '--apui-control-height-md'),
      ),
    );
    expect(heights).toEqual(Array(3).fill(tokens['control-height.md'].resolved));
    await page.close();
  });
});

describe('theme', () => {
  it('switches per subtree, including tokens that alias theme tokens', async () => {
    const page = await open(
      '<div id="light" class="apui-fixture"></div><div data-theme="dark"><div id="dark" class="apui-fixture"></div></div>',
    );
    expect(await style(page, '#light', '--apui-selected-bg')).toBe(
      resolved('selected.bg', 'light'),
    );
    expect(await style(page, '#dark', '--apui-selected-bg')).toBe(resolved('selected.bg', 'dark'));
    expect(await style(page, '#dark', '--apui-focus-ring-offset-color')).toBe(
      resolved('surface.default', 'dark'),
    );
    await page.close();
  });

  it('resets inherited text color and color-scheme in a themed region', async () => {
    const page = await open(
      '<div data-theme="dark"><strong id="dark">Heading</strong></div><div data-theme="high-contrast"><span id="hc">Text</span></div>',
      { appCss: 'body { color: var(--apui-text-default); }' },
    );
    const rgb = (hex: string) =>
      `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
    expect(await style(page, '#dark', 'color')).toBe(rgb(resolved('text.default', 'dark')!));
    expect(await style(page, '#dark', 'color-scheme')).toBe('dark');
    expect(await style(page, '#hc', 'color')).toBe(rgb(resolved('text.default', 'high-contrast')!));
    expect(await style(page, '#hc', 'color-scheme')).toBe('light');
    await page.close();
  });

  it('lets app CSS override the themed-region color', async () => {
    const page = await open('<div id="target" data-theme="dark">Text</div>', {
      appCss: '#target { color: rgb(1, 2, 3); }',
    });
    expect(await style(page, '#target', 'color')).toBe('rgb(1, 2, 3)');
    await page.close();
  });

  it('combines with density on the same element', async () => {
    const page = await open('<div id="target" class="apui-fixture"></div>', {
      htmlAttributes: 'data-theme="high-contrast" data-density="comfortable"',
    });
    expect(await style(page, '#target', '--apui-surface-default')).toBe(
      resolved('surface.default', 'high-contrast'),
    );
    expect(await style(page, '#target', '--apui-card-padding')).toBe(
      resolved('card.padding', 'comfortable'),
    );
    await page.close();
  });
});

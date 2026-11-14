/**
 * The optional Tailwind v4 preset (#24):
 *
 * - It is generated from the tokens, so every mapping points at a real token,
 *   and it only adds to Tailwind's theme.
 * - In a Tailwind app, components render identically with and without it.
 * - With the documented layer order, Preflight never overrides what a
 *   component sets, so components render as they do without Tailwind.
 * - Utilities resolve to the token values, follow data-theme, data-density
 *   and data-preset at runtime, and win over component rules.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { compile } from '@tailwindcss/node';
import { chromium, type Browser, type Page } from 'playwright';

import { presets, tokens } from '@artisanpack-ui/tokens';

import { buildDist } from '../build.mjs';
import { formatTailwind, tailwindMappings } from '../tailwind.mjs';

const packageRoot = join(__dirname, '..');
const dist = buildDist();
const mappings = tailwindMappings();
const dir = mkdtempSync(join(tmpdir(), 'apui-tailwind-'));
let browser: Browser;

/** Components as the pilot will write them: tokens in the apui.components layer. */
const FIXTURE_COMPONENT = `@layer apui.components {
  .apui-fixture-button {
    display: inline-flex;
    block-size: var(--apui-control-height-md);
    padding-inline: var(--apui-space-4);
    border: 1px solid transparent;
    border-radius: var(--apui-button-radius);
    background: var(--apui-color-primary);
    color: var(--apui-color-primary-foreground);
    font-family: var(--apui-font-family-sans);
    font-size: var(--apui-type-label-md-font-size);
    line-height: var(--apui-type-label-md-line-height);
  }
  .apui-fixture-card {
    padding: var(--apui-card-padding);
    border: 1px solid var(--apui-border-muted);
    border-radius: var(--apui-card-radius);
    background: var(--apui-surface-default);
    box-shadow: var(--apui-elevation-raised);
    color: var(--apui-text-default);
  }
  [data-scope='fixture-card'][data-part='title'] {
    margin: 0;
    font-size: var(--apui-type-heading-md-font-size);
    line-height: var(--apui-type-heading-md-line-height);
    font-weight: var(--apui-type-heading-md-font-weight);
  }
}`;

const MARKUP = `
  <div id="card" class="apui-fixture-card">
    <h2 id="title" data-scope="fixture-card" data-part="title">Orders</h2>
    <ul id="list"><li>One</li></ul>
    <button id="button" class="apui-fixture-button" type="button">Save</button>
  </div>`;

/** Every property worth comparing, set by the component or not. */
const ALL = [
  'display',
  'box-sizing',
  'block-size',
  'inline-size',
  'margin-block-start',
  'padding-inline-start',
  'padding-block-start',
  'border-start-start-radius',
  'border-block-start-width',
  'border-block-start-color',
  'background-color',
  'box-shadow',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'list-style-type',
];

/** The properties each fixture element sets itself. */
const OWN: Record<string, string[]> = {
  card: [
    'padding-inline-start',
    'padding-block-start',
    'border-start-start-radius',
    'border-block-start-width',
    'border-block-start-color',
    'background-color',
    'box-shadow',
    'color',
  ],
  title: ['margin-block-start', 'font-size', 'line-height', 'font-weight'],
  button: [
    'display',
    'block-size',
    'padding-inline-start',
    'border-start-start-radius',
    'border-block-start-width',
    'background-color',
    'color',
    'font-family',
    'font-size',
    'line-height',
  ],
};

/** Tailwind's output for the documented setup, with or without the preset. */
async function tailwindCss(candidates: string[], { preset = true } = {}): Promise<string> {
  const input = [
    '@layer theme, base, apui, components, utilities;',
    "@import 'tailwindcss';",
    `@import '${join(dir, 'index.css')}';`,
    preset ? `@import '${join(dir, 'tailwind.css')}';` : '',
  ].join('\n');
  const compiler = await compile(input, { base: packageRoot, onDependency: () => {} });
  return compiler.build(candidates);
}

async function open(css: string, body: string, htmlAttributes = ''): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${css}</style><style>${FIXTURE_COMPONENT}</style></head><body>${body}</body></html>`,
  );
  return page;
}

async function styles(page: Page, properties: (id: string) => string[]) {
  const result: Record<string, Record<string, string>> = {};
  for (const id of ['card', 'title', 'list', 'button']) {
    const props = properties(id);
    if (!props.length) continue;
    result[id] = await page.$eval(
      `#${id}`,
      (element, list) =>
        Object.fromEntries(list.map((p) => [p, getComputedStyle(element).getPropertyValue(p)])),
      props,
    );
  }
  return result;
}

const rgb = (hex: string) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;

const resolved = (path: keyof typeof tokens, mode?: string) => {
  const value = tokens[path].resolved;
  return typeof value === 'string' ? value : value[mode as keyof typeof value]!;
};

beforeAll(async () => {
  for (const [file, contents] of Object.entries(dist)) writeFileSync(join(dir, file), contents);
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  rmSync(dir, { recursive: true, force: true });
});

describe('generated from the tokens', () => {
  it('maps only semantic tokens that exist, to their custom property', () => {
    expect(mappings.length).toBeGreaterThan(150);
    for (const [, path, cssVar] of mappings) {
      const token = tokens[path as keyof typeof tokens];
      expect(token.tier, path).toBe('semantic');
      expect(cssVar).toBe(token.cssVar);
    }
  });

  it('maps every semantic color', () => {
    const mapped = new Set(mappings.map(([, path]) => path));
    const unmapped = Object.entries(tokens)
      .filter(
        ([path, token]) => token.tier === 'semantic' && token.type === 'color' && !mapped.has(path),
      )
      .map(([path]) => path);
    expect(unmapped).toEqual([]);
  });

  it('gives every utility a unique name, and keeps text colors apart from text sizes', () => {
    const names = mappings.map(([variable]) => variable);
    expect(new Set(names).size).toBe(names.length);
    const colors = names.filter((n) => n.startsWith('--text-color-')).map((n) => n.slice(13));
    expect(colors.filter((color) => names.includes(`--text-${color}`))).toEqual([]);
  });

  it('only adds to Tailwind: it redefines none of the default theme variables', () => {
    const require = createRequire(join(packageRoot, 'package.json'));
    const theme = readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8');
    const defaults = new Set([...theme.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]));
    expect(defaults.size).toBeGreaterThan(100);
    expect(mappings.map(([variable]) => variable).filter((v) => defaults.has(v))).toEqual([]);
  });

  it('is one @theme inline block of var() references, in the dist', () => {
    expect(dist['tailwind.css']).toBe(formatTailwind());
    expect(dist['tailwind.css']).toMatch(/^@theme inline \{$/m);
    expect(dist['tailwind.css']).toContain('--color-primary: var(--apui-color-primary);');
    expect(dist['tailwind.css']).toContain('--radius-control: var(--apui-radius-control);');
    expect(dist['tailwind.css']).toContain('--font-ui: var(--apui-font-family-sans);');
    expect(dist['tailwind.css']).not.toMatch(/--apui-(gray|steel|space)-/);
  });
});

describe('components render identically', () => {
  const MODES: [string, string][] = [
    ['by default', ''],
    ['in dark', 'data-theme="dark"'],
    ['in Ledger', 'data-preset="ledger"'],
    ['in Harbor, compact', 'data-preset="harbor" data-density="compact"'],
  ];

  it.each(MODES)('with and without the preset, %s', async (_label, htmlAttributes) => {
    const without = await open(await tailwindCss([], { preset: false }), MARKUP, htmlAttributes);
    const withPreset = await open(await tailwindCss([]), MARKUP, htmlAttributes);
    expect(await styles(withPreset, () => ALL)).toEqual(await styles(without, () => ALL));
    await Promise.all([without.close(), withPreset.close()]);
  });

  it.each(MODES)('with and without Tailwind, %s', async (_label, htmlAttributes) => {
    const plain = await open(dist['index.css']!, MARKUP, htmlAttributes);
    const tailwind = await open(await tailwindCss([]), MARKUP, htmlAttributes);
    const own = (id: string) => OWN[id] ?? [];
    expect(await styles(tailwind, own)).toEqual(await styles(plain, own));
    await Promise.all([plain.close(), tailwind.close()]);
  });
});

describe('utilities', () => {
  const CLASSES = {
    u: 'bg-primary text-muted rounded-control shadow-overlay border border-muted text-body-md font-ui',
    pad: 'p-panel-padding',
    h: 'h-control-md',
  };
  const BODY = Object.entries(CLASSES)
    .map(([id, classes]) => `<div id="${id}" class="${classes}">x</div>`)
    .join('');

  async function utilityStyles(htmlAttributes = '') {
    const css = await tailwindCss(Object.values(CLASSES).join(' ').split(' '));
    const page = await open(css, BODY, htmlAttributes);
    const get = (id: string, prop: string) =>
      page.$eval(`#${id}`, (el, p) => getComputedStyle(el).getPropertyValue(p), prop);
    const values = {
      background: await get('u', 'background-color'),
      color: await get('u', 'color'),
      radius: await get('u', 'border-start-start-radius'),
      border: await get('u', 'border-block-start-color'),
      fontSize: await get('u', 'font-size'),
      lineHeight: await get('u', 'line-height'),
      fontFamily: await get('u', 'font-family'),
      shadow: await get('u', 'box-shadow'),
      padding: await get('pad', 'padding-inline-start'),
      height: await get('h', 'block-size'),
    };
    await page.close();
    return values;
  }

  it('resolve to the token values', async () => {
    const values = await utilityStyles();
    expect(values.background).toBe(rgb(resolved('color.primary', 'light')));
    expect(values.color).toBe(rgb(resolved('text.muted', 'light')));
    expect(values.border).toBe(rgb(resolved('border.muted', 'light')));
    expect(values.radius).toBe(resolved('radius.control'));
    expect(values.padding).toBe(resolved('panel.padding', 'default'));
    expect(values.height).toBe(resolved('control-height.md'));
    expect(values.fontSize).toBe(resolved('type.body-md.font-size'));
    expect(values.lineHeight).toBe(resolved('type.body-md.line-height'));
    expect(values.fontFamily).toBe(resolved('font-family.sans'));
    expect(values.shadow).not.toBe('none');
  });

  it('follow data-theme, data-density and data-preset at runtime', async () => {
    const dark = await utilityStyles('data-theme="dark" data-density="compact"');
    expect(dark.background).toBe(rgb(resolved('color.primary', 'dark')));
    expect(dark.padding).toBe(resolved('panel.padding', 'compact'));

    const ledger = await utilityStyles('data-preset="ledger"');
    const ledgerTokens = presets.ledger.tokens as Record<string, { resolved: unknown }>;
    expect(ledger.background).toBe(
      rgb((ledgerTokens['color.primary']!.resolved as Record<string, string>).light!),
    );
    expect(ledger.height).toBe(ledgerTokens['control-height.md']!.resolved);
    expect(ledger.padding).toBe(
      (ledgerTokens['panel.padding']!.resolved as Record<string, string>).default,
    );
    expect(ledger.fontFamily).toContain('IBM Plex Sans');
  });

  it('win over component rules', async () => {
    const css = await tailwindCss(['bg-error']);
    const page = await open(css, '<button id="b" class="apui-fixture-button bg-error">x</button>');
    expect(await page.$eval('#b', (el) => getComputedStyle(el).backgroundColor)).toBe(
      rgb(resolved('color.error', 'light')),
    );
    await page.close();
  });
});

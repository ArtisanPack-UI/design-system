/**
 * Presets (#23, D-005, D-010): what a preset may reassign, what the build
 * emits for it, and that Ledger and Harbor match the spec in design/presets.md.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { loadTokens, readPreset, resolvedCss, TokenError } from '../scripts/lib/model.mjs';
import {
  formatPresetCss,
  loadPresets,
  presetChanges,
  presetData,
} from '../scripts/lib/presets.mjs';
import { presets } from '../src';

const root = join(__dirname, '..');
const tokensRoot = join(root, 'tokens');
const base = loadTokens(tokensRoot);
const all = loadPresets(tokensRoot, join(root, 'presets'));
const ledger = all.get('ledger')!;
const harbor = all.get('harbor')!;

const dirs: string[] = [];
afterAll(() => dirs.forEach((dir) => rmSync(dir, { recursive: true, force: true })));

/** Writes a preset directory and returns the problems loading it reports. */
function problems(files: Record<string, unknown>, name = 'fixture'): string[] {
  const dir = mkdtempSync(join(tmpdir(), 'apui-preset-'));
  dirs.push(dir);
  for (const [file, data] of Object.entries(files)) {
    const path = join(dir, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, typeof data === 'string' ? data : JSON.stringify(data));
  }
  try {
    loadTokens(tokensRoot, { preset: readPreset(dir, name) });
  } catch (error) {
    if (error instanceof TokenError) return error.problems;
    throw error;
  }
  return [];
}

const px = (value: number) => ({ $value: { value, unit: 'px' } });
const resolved = (model: typeof base, path: string, context = {}) =>
  resolvedCss(model, path, context);

describe('what a preset may reassign', () => {
  it('accepts semantic and component tokens', () => {
    expect(
      problems({ 'base.json': { button: { radius: px(4) }, panel: { 'gap-compact': px(4) } } }),
    ).toEqual([]);
  });

  it('accepts color ramps and the radius scale (D-010)', () => {
    expect(
      problems({
        'base.json': {
          radius: { md: px(4) },
          gray: {
            '500': { $value: { colorSpace: 'srgb', components: [0.5, 0.5, 0.5], hex: '#808080' } },
          },
        },
      }),
    ).toEqual([]);
  });

  it('rejects other primitives', () => {
    expect(problems({ 'base.json': { space: { '4': px(15) } } })).toEqual([
      expect.stringContaining(
        'space.4 is a primitive; presets reassign only color ramps and the radius scale',
      ),
    ]);
  });

  it('rejects tokens that do not exist', () => {
    expect(problems({ 'base.json': { button: { glow: px(4) } } })).toEqual([
      expect.stringContaining('button.glow does not exist'),
    ]);
  });

  it('rejects a type change', () => {
    expect(
      problems({ 'base.json': { button: { radius: { $type: 'number', $value: 4 } } } }),
    ).toEqual([expect.stringContaining('button.radius is number here but dimension')]);
  });

  it('rejects a broken alias, through the normal validation', () => {
    expect(problems({ 'base.json': { button: { radius: { $value: '{radius.huge}' } } } })).toEqual([
      expect.stringContaining('references {radius.huge}, which does not exist'),
    ]);
  });

  it('keeps the tier rules: a semantic token cannot alias a component token', () => {
    expect(
      problems({ 'base.json': { radius: { control: { $value: '{button.radius}' } } } }),
    ).toEqual([expect.stringContaining('(semantic) cannot reference {button.radius} (component)')]);
  });

  it('only reassigns mode tokens in their own axis', () => {
    expect(problems({ 'density/compact.json': { button: { radius: px(4) } } })).toEqual([
      expect.stringContaining('button.radius is not a density token; reassign it in base.json'),
    ]);
    expect(problems({ 'theme/dark.json': { panel: { padding: px(4) } } })).toEqual([
      expect.stringContaining('panel.padding is not a theme token'),
    ]);
  });

  it('rejects unknown files, modes and names', () => {
    expect(problems({ 'extra.json': {} })).toEqual([expect.stringContaining('unexpected entry')]);
    expect(problems({ 'theme/sepia.json': {} })).toEqual([
      expect.stringContaining('unknown theme mode'),
    ]);
    expect(problems({ 'base.json': {} }, 'Bad_Name')).toEqual([
      expect.stringContaining('preset names follow'),
    ]);
  });

  it('applies a mode token in base.json to every mode, and a mode file wins for its mode', () => {
    const dir = mkdtempSync(join(tmpdir(), 'apui-preset-'));
    dirs.push(dir);
    mkdirSync(join(dir, 'theme'));
    const color = (hex: string) => ({
      $value: {
        colorSpace: 'srgb',
        components: [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255),
        hex,
      },
    });
    writeFileSync(join(dir, 'base.json'), JSON.stringify({ color: { primary: color('#112233') } }));
    writeFileSync(
      join(dir, 'theme', 'dark.json'),
      JSON.stringify({ color: { primary: color('#445566') } }),
    );
    const model = loadTokens(tokensRoot, { preset: readPreset(dir, 'fixture') });
    expect(resolved(model, 'color.primary', { theme: 'light' })).toBe('#112233');
    expect(resolved(model, 'color.primary', { theme: 'high-contrast' })).toBe('#112233');
    expect(resolved(model, 'color.primary', { theme: 'dark' })).toBe('#445566');
  });
});

describe('changes', () => {
  it('separates reassigned tokens from the tokens that follow them', () => {
    const { changed, affected } = presetChanges(base, ledger);
    expect(changed.has('radius.md')).toBe(true);
    expect(changed.has('radius.field')).toBe(false);
    expect(affected.has('radius.field')).toBe(true);
    expect(affected.has('input.radius')).toBe(true);
    expect(affected.has('space.4')).toBe(false);
  });

  it('includes only reassigned tokens and tokens that reference an affected one', () => {
    const { changed, affected } = presetChanges(base, ledger);
    for (const path of affected) {
      if (changed.has(path)) continue;
      const references = [...ledger.tokens.get(path)!.references];
      expect(
        references.some((ref) => affected.has(ref)),
        path,
      ).toBe(true);
    }
    expect(affected.has('color.success')).toBe(false);
  });
});

describe('CSS', () => {
  const css = formatPresetCss(base, ledger);

  it('sits in the apui.tokens layer', () => {
    expect(css).toMatch(/^@layer apui\.tokens \{$/m);
  });

  it('declares tokens with one value on [data-preset]', () => {
    expect(css).toContain('[data-preset="ledger"] {\n    --apui-gray-25: #fcfcfc;');
    expect(css).toContain('--apui-radius-field: var(--apui-radius-md);');
  });

  it('matches every mode on the same element, around the preset and inside it', () => {
    expect(css).toContain(
      '[data-preset="ledger"][data-theme="dark"],\n  [data-theme="dark"] [data-preset="ledger"],\n  [data-preset="ledger"] [data-theme="dark"] {',
    );
    expect(css).toContain(
      '  [data-preset="ledger"],\n  [data-preset="ledger"][data-density="default"],',
    );
  });

  it('re-declares density dependents in every density block', () => {
    for (const mode of ['default', 'compact', 'comfortable']) {
      const start = css.indexOf(`[data-preset="ledger"][data-density="${mode}"]`);
      const block = css.slice(start, css.indexOf('}', start));
      expect(block).toContain('--apui-card-padding: var(--apui-panel-padding);');
    }
  });

  it('only uses the apui namespace (D-002)', () => {
    expect(css).not.toMatch(/--ap-|\.ap-/);
  });
});

describe('outputs', () => {
  it('exports every preset to TypeScript', () => {
    expect(Object.keys(presets).sort()).toEqual([...all.keys()].sort());
    expect(presets.ledger.attribute).toBe('data-preset');
    expect(presets.ledger.tokens['radius.md']).toEqual({
      changed: true,
      value: '4px',
      resolved: '4px',
    });
    expect(presets.ledger.tokens['radius.field']).toMatchObject({
      changed: false,
      resolved: '4px',
    });
  });

  it.runIf(hasPhp())('writes valid PHP that matches the TypeScript map', () => {
    const json = execFileSync(
      'php',
      ['-r', `echo json_encode(require '${join(root, 'generated/presets.php')}');`],
      { encoding: 'utf8' },
    );
    const data = JSON.parse(json);
    expect(data.attribute).toBe('data-preset');
    expect(data.presets.harbor).toEqual(JSON.parse(JSON.stringify(presets.harbor)));
  });

  it('builds the same data the build wrote', () => {
    expect(JSON.parse(JSON.stringify(presetData(base, harbor)))).toEqual(
      JSON.parse(JSON.stringify(presets.harbor)),
    );
  });

  it('commits a stylesheet per preset', () => {
    for (const name of all.keys()) {
      expect(readFileSync(join(root, 'generated/presets', `${name}.css`), 'utf8')).toBe(
        formatPresetCss(base, all.get(name)!),
      );
    }
  });
});

/** Values from the tables in design/presets.md. */
describe('Ledger matches the spec', () => {
  it.each([
    ['radius.xs', '2px'],
    ['radius.sm', '3px'],
    ['radius.md', '4px'],
    ['radius.lg', '6px'],
    ['radius.xl', '8px'],
    ['button.radius', '4px'],
    ['tabs.radius', '0'],
    ['badge.radius', '2px'],
    ['input.radius', '4px'],
    ['card.radius', '6px'],
    ['table.radius', '6px'],
    ['alert.radius', '6px'],
    ['dialog.radius', '8px'],
    ['menu.radius', '8px'],
    ['toast.radius', '8px'],
    ['menu.item-radius', '2px'],
    ['control-height.xs', '22px'],
    ['control-height.md', '32px'],
    ['control-height.xl', '44px'],
    ['type.stat-md.font-weight', '400'],
    ['gray.500', '#808080'],
    ['font-family.sans', '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif'],
  ])('%s is %s', (path, value) => {
    expect(resolved(ledger, path)).toBe(value);
  });

  it.each([
    ['compact', '12px', '28px'],
    ['default', '16px', '36px'],
    ['comfortable', '20px', '44px'],
  ])('panel padding and row height in %s density', (density, padding, row) => {
    expect(resolved(ledger, 'panel.padding', { density })).toBe(padding);
    expect(resolved(ledger, 'card.padding', { density })).toBe(padding);
    expect(resolved(ledger, 'row.height', { density })).toBe(row);
  });

  it('uses the Ledger primary and focus ring in light and dark', () => {
    expect(resolved(ledger, 'color.primary', { theme: 'light' })).toBe('#366bd3');
    expect(resolved(ledger, 'color.primary', { theme: 'dark' })).toBe('#72a3fe');
    expect(resolved(ledger, 'focus-ring.color', { theme: 'dark' })).toBe('#a0c1fe');
    expect(resolved(ledger, 'border.muted', { theme: 'light' })).toBe(resolved(ledger, 'gray.200'));
  });

  it('has pure grays', () => {
    for (const entry of ledger.tokens.values()) {
      if (!entry.path.startsWith('gray.')) continue;
      const hex = resolved(ledger, entry.path);
      expect(hex.slice(1, 3), entry.path).toBe(hex.slice(3, 5));
      expect(hex.slice(3, 5), entry.path).toBe(hex.slice(5, 7));
    }
  });
});

describe('Harbor matches the spec', () => {
  it.each([
    ['radius.md', '12px'],
    ['radius.lg', '20px'],
    ['radius.xl', '24px'],
    ['card.radius', '20px'],
    ['dialog.radius', '24px'],
    ['menu.radius', '20px'],
    ['toast.radius', '20px'],
    ['control-height.xs', '28px'],
    ['control-height.xl', '56px'],
    ['shell.gutter', '16px'],
    ['type.body-md.font-size', '15px'],
    ['type.body-md.line-height', '22px'],
    ['type.stat-md.font-size', '30px'],
    ['type.stat-lg.font-size', '38px'],
    ['type.stat-lg.font-weight', '600'],
    ['type.stat-lg.letter-spacing', '-0.03em'],
    ['type.heading-lg.font-family', '"Bricolage Grotesque", "Hanken Grotesk", sans-serif'],
  ])('%s is %s', (path, value) => {
    expect(resolved(harbor, path)).toBe(value);
  });

  it('makes the primary ink in every theme', () => {
    for (const theme of ['light', 'dark', 'high-contrast']) {
      for (const suffix of [
        '',
        '-hover',
        '-foreground',
        '-soft',
        '-soft-foreground',
        '-text',
        '-border',
      ]) {
        expect(resolved(harbor, `color.primary${suffix}`, { theme })).toBe(
          resolved(harbor, `color.neutral${suffix}`, { theme }),
        );
      }
    }
  });

  it('floats white islands on a tinted canvas in light, and keeps tone in dark', () => {
    expect(resolved(harbor, 'surface.page', { theme: 'light' })).toBe('#ebf1f7');
    expect(resolved(harbor, 'surface.default', { theme: 'light' })).toBe('#ffffff');
    expect(resolved(harbor, 'border.muted', { theme: 'light' })).toBe('rgb(0 0 0 / 0)');
    expect(resolved(harbor, 'elevation.raised', { theme: 'light' })).not.toBe('none');
    for (const path of ['surface.page', 'border.muted', 'elevation.raised']) {
      expect(resolved(harbor, path, { theme: 'dark' })).toBe(
        resolved(base, path, { theme: 'dark' }),
      );
    }
  });

  it('keeps the steel focus ring', () => {
    expect(resolved(harbor, 'focus-ring.color', { theme: 'light' })).toBe(
      resolved(base, 'focus-ring.color', { theme: 'light' }),
    );
  });

  it.each([
    ['compact', '20px', '36px'],
    ['default', '24px', '48px'],
    ['comfortable', '32px', '56px'],
  ])('panel padding and row height in %s density', (density, padding, row) => {
    expect(resolved(harbor, 'panel.padding', { density })).toBe(padding);
    expect(resolved(harbor, 'row.height', { density })).toBe(row);
  });
});

function hasPhp(): boolean {
  try {
    execFileSync('php', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

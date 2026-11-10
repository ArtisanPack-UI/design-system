/**
 * The brand preset generator (#27): luminance-matched ramps, validated
 * contrast, inputs, output formats and the committed example preset.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { renderPreset } from '../scripts/generate-preset.mjs';
import { buildFixtures, FIXTURE_DIR } from '../scripts/generator-fixtures.mjs';
import { formatFailures } from '../scripts/lib/contrast-pairs.mjs';
import {
  buildPreset,
  generatePreset,
  generateRamp,
  GeneratorError,
  GENERATOR_EXTENSION,
  luminance,
  matchLuminance,
  parseHex,
  rampFor,
  srgbToOklch,
  toHex,
} from '../scripts/lib/generator.mjs';
import { loadTokens, readPreset, resolveValue } from '../scripts/lib/model.mjs';

const root = join(__dirname, '..');
const tokensRoot = join(root, 'tokens');
const base = loadTokens(tokensRoot);
const cli = join(root, 'scripts', 'generate-preset.mjs');

const hexOf = (model: typeof base, path: string, theme = 'light') =>
  (resolveValue(model, path, { theme }) as { hex: string }).hex;

describe('color math', () => {
  it('parses short and long hex', () => {
    expect(toHex(parseHex('#abc'))).toBe('#aabbcc');
    expect(toHex(parseHex('1F6F3D'))).toBe('#1f6f3d');
  });

  it.each(['red', '#12345', 'rgb(0 0 0)', ''])('rejects %j', (input) => {
    expect(() => parseHex(input)).toThrow(GeneratorError);
  });

  it('converts sRGB to OKLCH', () => {
    const [l, c] = srgbToOklch([1, 1, 1]);
    expect(l).toBeCloseTo(1, 3);
    expect(c).toBeCloseTo(0, 3);
  });

  it.each([
    [0.18, 0.12, 30],
    [0.5, 0.2, 140],
    [0.02, 0.05, 260],
  ])('hits luminance %s at chroma %s, hue %s', (target, c, h) => {
    const rgb = matchLuminance(target, c, h);
    expect(Math.abs(luminance(rgb) - target)).toBeLessThan(0.003);
  });
});

describe('ramps', () => {
  it('finds the ramp under each color role', () => {
    expect(rampFor(base, 'primary')).toBe('steel');
    expect(rampFor(base, 'secondary')).toBe('slate');
    expect(rampFor(base, 'accent')).toBe('marigold');
  });

  it('keeps the default luminance per step and the input hue', () => {
    const input = parseHex('#c2185b');
    const { steps } = generateRamp(base, 'steel', input);
    const inputHue = srgbToOklch(input)[2];
    for (const [step, rgb] of steps) {
      const target = luminance(parseHex(hexOf(base, `steel.${step}`)));
      expect(Math.abs(luminance(rgb) - target), `steel.${step}`).toBeLessThan(0.004);
      const [, c, h] = srgbToOklch(rgb);
      if (c > 0.03)
        expect(Math.abs(((h - inputHue + 540) % 360) - 180), `steel.${step}`).toBeLessThan(25);
    }
  });

  it('anchors the input on the step nearest its luminance', () => {
    expect(generateRamp(base, 'steel', parseHex('#1f6f3d')).anchor).toBe('700');
    expect(generateRamp(base, 'steel', parseHex('#eff7f1')).anchor).toBe('50');
  });
});

describe('generated presets', () => {
  it.each([
    ['#1f6f3d'],
    ['#e88761'],
    ['#ff0000'],
    ['#ffee00'],
    ['#00e5ff'],
    ['#7c3aed'],
    ['#111111'],
    ['#fafafa'],
    ['#808080'],
  ])('a %s primary passes every contrast pair in every theme', (primary) => {
    const { failures } = generatePreset(tokensRoot, { name: 'brand', primary });
    expect(failures, formatFailures(failures)).toEqual([]);
  });

  it('passes with secondary and accent colors too', () => {
    const { failures, anchors } = generatePreset(tokensRoot, {
      name: 'brand',
      primary: '#0055ff',
      secondary: '#ff0066',
      accent: '#22cc88',
    });
    expect(failures, formatFailures(failures)).toEqual([]);
    expect(Object.keys(anchors)).toEqual(['primary', 'secondary', 'accent']);
  });

  it('puts the input color exactly on its anchor step when that passes', () => {
    const { model, anchors } = generatePreset(tokensRoot, { name: 'brand', primary: '#1f6f3d' });
    expect(anchors.primary).toEqual({ ramp: 'steel', step: '700', exact: true });
    expect(hexOf(model, 'steel.700')).toBe('#1f6f3d');
    expect(hexOf(model, 'color.primary-hover')).toBe('#1f6f3d');
  });

  it('tints grays and the neutral literals toward the primary hue by default', () => {
    const { preset } = buildPreset(base, { name: 'brand', primary: '#1f6f3d' });
    const files = preset.sources.map((source) => source.file);
    expect(files).toEqual(['base.json', 'theme/light.json', 'theme/dark.json']);
    const hue = srgbToOklch(parseHex('#1f6f3d'))[2];
    const glass = preset.sources[1]!.tree.surface.glass.$value;
    expect(glass.components[2]).toBeCloseTo(hue, 1);
    expect(preset.sources[0]!.tree.gray['500']).toBeDefined();
  });

  it('makes grays pure with neutral: pure', () => {
    const { model } = generatePreset(tokensRoot, {
      name: 'brand',
      primary: '#1f6f3d',
      neutral: 'pure',
    });
    const gray = hexOf(model, 'gray.600');
    expect(gray.slice(1, 3)).toBe(gray.slice(3, 5));
    expect(
      (resolveValue(model, 'state.hover', { theme: 'light' }) as { components: number[] })
        .components[1],
    ).toBe(0);
  });

  it('keeps the default grays with neutral: keep', () => {
    const { preset } = buildPreset(base, { name: 'brand', primary: '#1f6f3d', neutral: 'keep' });
    expect(preset.sources).toHaveLength(1);
    expect(preset.sources[0]!.tree.gray).toBeUndefined();
  });

  it('sets font families', () => {
    const { model } = generatePreset(tokensRoot, {
      name: 'brand',
      primary: '#1f6f3d',
      fontSans: '"Inter", system-ui, sans-serif',
      fontDisplay: ['Fraunces', 'serif'],
    });
    expect(resolveValue(model, 'font-family.sans')).toEqual(['Inter', 'system-ui', 'sans-serif']);
    expect(resolveValue(model, 'type.display-lg.font-family')).toEqual(['Fraunces', 'serif']);
  });

  it('records its inputs for regeneration', () => {
    const { preset } = buildPreset(base, { name: 'brand', primary: '#1f6f3d', accent: '#ffcc00' });
    expect(preset.sources[0]!.tree.$extensions[GENERATOR_EXTENSION]).toEqual({
      primary: '#1f6f3d',
      accent: '#ffcc00',
      neutral: 'tinted',
    });
  });

  it.each([
    [{ name: 'Brand', primary: '#1f6f3d' }, 'not a valid preset name'],
    [{ name: 'brand' }, 'a primary color is required'],
    [
      { name: 'brand', primary: '#1f6f3d', neutral: 'warm' },
      'neutral must be tinted, pure or keep',
    ],
    [{ name: 'brand', primary: 'green' }, 'is not a hex color'],
    [{ name: 'brand', primary: '#1f6f3d', fontSans: ' , ' }, 'must not be empty'],
  ])('rejects bad input %j', (options, message) => {
    expect(() => generatePreset(tokensRoot, options as never)).toThrow(message);
  });
});

describe('the example brand preset', () => {
  it('is what the generator makes from its recorded inputs', () => {
    const committed = readPreset(join(root, 'presets', 'forest'), 'forest');
    const tree = committed.sources[0]!.tree;
    const { preset } = generatePreset(tokensRoot, {
      name: 'forest',
      description: tree.$description,
      ...tree.$extensions[GENERATOR_EXTENSION],
    });
    const byFile = (sources: { file: string }[]) =>
      JSON.parse(JSON.stringify([...sources].sort((a, b) => a.file.localeCompare(b.file))));
    expect(byFile(preset.sources)).toEqual(byFile(committed.sources));
  });
});

describe('output formats', () => {
  const result = generatePreset(tokensRoot, { name: 'brand', primary: '#7c3aed' });

  it('renders CSS for [data-preset]', () => {
    const css = renderPreset(result, 'css')['']!;
    expect(css).toContain('@layer apui.tokens {');
    expect(css).toContain('[data-preset="brand"] {');
    expect(css).toContain('Generated by apui-generate-preset');
  });

  it('renders DTCG source files', () => {
    expect(Object.keys(renderPreset(result, 'dtcg'))).toEqual([
      'base.json',
      'theme/light.json',
      'theme/dark.json',
    ]);
  });

  it('renders JSON data', () => {
    const data = JSON.parse(renderPreset(result, 'json')['']!);
    expect(data).toMatchObject({ name: 'brand', attribute: 'data-preset' });
    expect(data.tokens['color.primary'].changed).toBe(false);
    expect(data.tokens['steel.600'].changed).toBe(true);
  });

  it.runIf(hasPhp())('renders a PHP array that matches the JSON', () => {
    const php = renderPreset(result, 'php')['']!;
    const json = execFileSync(
      'php',
      ['-r', `echo json_encode(eval(${JSON.stringify(php.replace(/^<\?php/, ''))}));`],
      {
        encoding: 'utf8',
      },
    );
    expect(JSON.parse(json)).toEqual(JSON.parse(renderPreset(result, 'json')['']!));
  });
});

describe('CLI', () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

  it('prints CSS', () => {
    const { status, stdout, stderr } = run('--name', 'brand', '--primary', '#7c3aed');
    expect(status).toBe(0);
    expect(stdout).toContain('[data-preset="brand"]');
    expect(stderr).toContain('primary: steel ramp');
  });

  it('fails on bad input without a stack trace', () => {
    const { status, stderr } = run('--name', 'brand', '--primary', 'nope');
    expect(status).toBe(1);
    expect(stderr.trim()).toBe('"nope" is not a hex color (#rgb or #rrggbb)');
  });

  it('keeps a description from ending the CSS comment', () => {
    const { status, stdout } = run(
      '--name',
      'brand',
      '--primary',
      '#7c3aed',
      '--description',
      'evil */ body { display: none } /*\nsecond line',
    );
    expect(status).toBe(0);
    expect(stdout).toContain(' * evil * / body { display: none } /* second line');
    expect(stdout.split('*/')).toHaveLength(2);
  });

  it('rejects font names that would break out of the declaration', () => {
    const { status, stderr } = run(
      '--name',
      'brand',
      '--primary',
      '#7c3aed',
      '--font-sans',
      'Evil\\',
    );
    expect(status).toBe(1);
    expect(stderr).toContain('must not contain');
  });

  it('needs a directory for DTCG output', () => {
    const { status, stderr } = run('--name', 'brand', '--primary', '#7c3aed', '--format', 'dtcg');
    expect(status).toBe(1);
    expect(stderr).toContain('--format dtcg needs --out');
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

describe('golden fixtures for ports', () => {
  it('are committed and up to date', () => {
    for (const [file, contents] of Object.entries(buildFixtures())) {
      expect(readFileSync(join(FIXTURE_DIR, file), 'utf8'), file).toBe(contents);
    }
  });

  it('all pass contrast', () => {
    for (const contents of Object.values(buildFixtures())) {
      expect(JSON.parse(contents).failures).toBe(0);
    }
  });
});

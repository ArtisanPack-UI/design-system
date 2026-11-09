/**
 * The DTCG schema (#18): what the loader accepts and what it rejects.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { loadTokens, TokenError } from '../scripts/lib/model.mjs';

const roots: string[] = [];

function fixture(files: Record<string, unknown>): string {
  const root = mkdtempSync(join(tmpdir(), 'apui-tokens-'));
  roots.push(root);
  for (const [file, data] of Object.entries(files)) {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, typeof data === 'string' ? data : JSON.stringify(data));
  }
  return root;
}

function problems(files: Record<string, unknown>): string[] {
  try {
    loadTokens(fixture(files));
  } catch (error) {
    if (error instanceof TokenError) return error.problems;
    throw error;
  }
  return [];
}

const px = (value: number) => ({ value, unit: 'px' });
const hex = (h: string) => ({
  colorSpace: 'srgb',
  components: [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255),
  hex: h,
});
const space = { space: { $type: 'dimension', '1': { $value: px(4) }, '2': { $value: px(8) } } };
const gray = {
  gray: { $type: 'color', '0': { $value: hex('#ffffff') }, '900': { $value: hex('#23272b') } },
};
const themes = (light: unknown, dark: unknown, hc: unknown) => ({
  'modes/theme/light.json': light,
  'modes/theme/dark.json': dark,
  'modes/theme/high-contrast.json': hc,
});

afterAll(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })));

describe('valid source', () => {
  it('loads tiers, inherited group types and aliases', () => {
    const model = loadTokens(
      fixture({
        'primitive/space.json': space,
        'semantic/gap.json': { gap: { $type: 'dimension', md: { $value: '{space.2}' } } },
        'component/card.json': { card: { padding: { $value: '{gap.md}' } } },
      }),
    );
    expect(model.tokens.get('card.padding')).toMatchObject({
      cssVar: '--apui-card-padding',
      tier: 'component',
      type: 'dimension',
    });
  });

  it('loads mode tokens from every mode file of an axis', () => {
    const color = (ref: string) => ({ text: { default: { $type: 'color', $value: ref } } });
    const model = loadTokens(
      fixture({
        'primitive/color.json': gray,
        ...themes(color('{gray.900}'), color('{gray.0}'), color('{gray.900}')),
      }),
    );
    expect(model.tokens.get('text.default')).toMatchObject({ axis: 'theme', varies: 'theme' });
  });

  it('marks a token that aliases a mode token as varying by that axis', () => {
    const color = (ref: string) => ({ text: { default: { $type: 'color', $value: ref } } });
    const model = loadTokens(
      fixture({
        'primitive/color.json': gray,
        'component/link.json': { link: { color: { $value: '{text.default}' } } },
        ...themes(color('{gray.900}'), color('{gray.0}'), color('{gray.900}')),
      }),
    );
    expect(model.tokens.get('link.color')).toMatchObject({ axis: null, varies: 'theme' });
  });
});

describe('rejected source', () => {
  it.each([
    ['invalid JSON', { 'primitive/a.json': '{ nope' }, /Unexpected|JSON/],
    ['an unknown directory', { 'extra/a.json': {} }, /unexpected entry/],
    ['a non-JSON file in a tier', { 'primitive/a.txt': 'x' }, /only \.json files/],
    [
      'an unknown $type',
      { 'primitive/a.json': { a: { $type: 'gradient', $value: [] } } },
      /unsupported \$type/,
    ],
    ['a missing $type', { 'primitive/a.json': { a: { $value: 1 } } }, /has no \$type/],
    [
      'an invalid name',
      { 'primitive/a.json': { Space: { $type: 'number', $value: 1 } } },
      /not a valid name/,
    ],
    [
      'a dot in a name',
      { 'primitive/a.json': { 'a.b': { $type: 'number', $value: 1 } } },
      /not a valid name/,
    ],
    [
      'an unknown $ key',
      { 'primitive/a.json': { a: { $type: 'number', $value: 1, $foo: 1 } } },
      /"\$foo" is not allowed/,
    ],
    [
      'a token with children',
      { 'primitive/a.json': { a: { $type: 'number', $value: 1, b: { $value: 2 } } } },
      /cannot contain children/,
    ],
    [
      'a bad dimension unit',
      { 'primitive/a.json': { a: { $type: 'dimension', $value: { value: 1, unit: 'vw' } } } },
      /dimension must be/,
    ],
    [
      'a string dimension',
      { 'primitive/a.json': { a: { $type: 'dimension', $value: '4px' } } },
      /dimension must be/,
    ],
    [
      'a hex that does not match its components',
      {
        'primitive/a.json': {
          a: { $type: 'color', $value: { ...hex('#ffffff'), hex: '#000000' } },
        },
      },
      /do not match hex/,
    ],
    [
      'an unsupported color space',
      {
        'primitive/a.json': {
          a: { $type: 'color', $value: { colorSpace: 'hsl', components: [0, 0, 0] } },
        },
      },
      /colorSpace must be/,
    ],
    [
      'an out-of-range alpha',
      { 'primitive/a.json': { a: { $type: 'color', $value: { ...hex('#ffffff'), alpha: 2 } } } },
      /alpha/,
    ],
    [
      'a bad font weight',
      { 'primitive/a.json': { a: { $type: 'fontWeight', $value: 'bold' } } },
      /fontWeight/,
    ],
    [
      'a font family that would break the CSS',
      {
        'primitive/a.json': { a: { $type: 'fontFamily', $value: ['Geist; } body { color: red'] } },
      },
      /must not contain/,
    ],
    [
      'a bad cubic bezier',
      { 'primitive/a.json': { a: { $type: 'cubicBezier', $value: [2, 0, 1, 1] } } },
      /x values/,
    ],
    [
      'an incomplete shadow',
      { 'primitive/a.json': { a: { $type: 'shadow', $value: [{ offsetX: px(0) }] } } },
      /missing "color"/,
    ],
    [
      'a missing reference',
      { 'semantic/a.json': { a: { $type: 'number', $value: '{nope}' } } },
      /does not exist/,
    ],
    [
      'a reference of the wrong type',
      {
        'primitive/space.json': space,
        'semantic/a.json': { a: { $type: 'color', $value: '{space.1}' } },
      },
      /expects a color/,
    ],
    [
      'a primitive that references a token',
      { 'primitive/space.json': { ...space, s: { $type: 'dimension', $value: '{space.1}' } } },
      /primitive and cannot reference/,
    ],
    [
      'a semantic token that references a component token',
      {
        'semantic/a.json': { a: { $type: 'number', $value: '{b.c}' } },
        'component/b.json': { b: { c: { $type: 'number', $value: 1 } } },
      },
      /\(semantic\) cannot reference \{b\.c\} \(component\)/,
    ],
    [
      'a duplicate token',
      { 'primitive/a.json': space, 'primitive/b.json': space },
      /already defined/,
    ],
    [
      'two paths with the same custom property',
      {
        'primitive/a.json': {
          a: { 'b-c': { $type: 'number', $value: 1 } },
          'a-b': { c: { $type: 'number', $value: 2 } },
        },
      },
      /both become --apui-a-b-c/,
    ],
    [
      'a reference cycle',
      {
        'semantic/a.json': {
          a: { $type: 'number', $value: '{b}' },
          b: { $type: 'number', $value: '{a}' },
        },
      },
      /reference cycle/,
    ],
    ['an unknown mode axis', { 'modes/size/large.json': {} }, /unknown mode axis/],
    [
      'an unknown mode',
      { 'modes/theme/sepia.json': {}, ...themes({}, {}, {}) },
      /unknown theme mode/,
    ],
    ['a missing mode file', { 'modes/theme/light.json': {} }, /dark\.json: missing/],
  ])('rejects %s', (_label, files, message) => {
    expect(problems(files as Record<string, unknown>).join('\n')).toMatch(message as RegExp);
  });

  it('rejects a token missing from one mode', () => {
    const text = { text: { $type: 'color', default: { $value: '{gray.0}' } } };
    expect(
      problems({ 'primitive/color.json': gray, ...themes(text, text, {}) }).join('\n'),
    ).toMatch(/defined for theme light, dark but not high-contrast/);
  });

  it('rejects a mode token that is also defined outside the modes', () => {
    const text = { text: { $type: 'color', default: { $value: '{gray.0}' } } };
    expect(
      problems({
        'primitive/color.json': gray,
        'semantic/text.json': text,
        ...themes(text, text, text),
      }).join('\n'),
    ).toMatch(/already defined/);
  });

  it('rejects a mode token that varies by a second axis', () => {
    const text = { text: { $type: 'dimension', size: { $value: '{gap}' } } };
    const gap = (value: number) => ({ gap: { $type: 'dimension', $value: px(value) } });
    expect(
      problems({
        ...themes(text, text, text),
        'modes/density/compact.json': gap(1),
        'modes/density/default.json': gap(2),
        'modes/density/comfortable.json': gap(3),
      }).join('\n'),
    ).toMatch(/is a theme token but also varies by density/);
  });

  it('reports every problem at once', () => {
    expect(
      problems({
        'primitive/a.json': {
          a: { $type: 'number', $value: 'x' },
          B: { $type: 'number', $value: 1 },
        },
      }),
    ).toHaveLength(2);
  });
});

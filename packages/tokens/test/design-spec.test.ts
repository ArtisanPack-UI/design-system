/**
 * The DTCG source matches the Phase 1 design spec (#20): every token in
 * design/tokens/tokens.json exists under its name and resolves to the same
 * value in every theme and density.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { toRgba } from '../scripts/lib/contrast.mjs';
import { loadTokens, resolvedCss, resolveValue } from '../scripts/lib/model.mjs';

type DesignValue = string | Record<string, string>;
interface DesignToken {
  name: string;
  value: DesignValue;
}

const repo = join(__dirname, '..', '..', '..');
const design = JSON.parse(readFileSync(join(repo, 'design/tokens/tokens.json'), 'utf8'));
const model = loadTokens(join(__dirname, '..', 'tokens'));
const byCssVar = new Map([...model.tokens.values()].map((entry) => [entry.cssVar, entry]));
const THEMES: string[] = design.color.themes.map((theme: { id: string }) => theme.id);

const designTokens: DesignToken[] = [
  'color',
  'shadow',
  'spacing',
  'radius',
  'size',
  'density',
  'border',
  'glass',
  'component',
  'zIndex',
  'font',
].flatMap((group) => design[group].tokens);
const designByName = new Map(designTokens.map((token) => [token.name, token]));

function designResolve(value: DesignValue, theme: string): string {
  const raw = typeof value === 'string' ? value : value[theme]!;
  const ref = raw.match(/^\{(apui-[\w-]+)\}$/);
  return ref ? designResolve(designByName.get(ref[1]!)!.value, theme) : raw;
}

function parseColor(css: string): number[] {
  if (css.startsWith('#'))
    return toRgba({ colorSpace: 'srgb', hex: css.slice(0, 7), components: [0, 0, 0] });
  let m = css.match(/^oklch\(([\d.]+)% ([\d.]+) ([\d.]+) \/ ([\d.]+)\)$/);
  if (m)
    return toRgba({
      colorSpace: 'oklch',
      components: [+m[1]! / 100, +m[2]!, +m[3]!],
      alpha: +m[4]!,
    });
  m = css.match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/);
  if (m) return [+m[1]! / 255, +m[2]! / 255, +m[3]! / 255, +m[4]!];
  throw new Error(`unparsed color ${css}`);
}

const close = (a: number[], b: number[]) =>
  a.length === b.length && a.every((x, i) => Math.abs(x - b[i]!) < 0.002);

function matches(path: string, expected: string, context: Record<string, string>): boolean {
  const entry = model.tokens.get(path)!;
  const value = resolveValue(model, path, context);
  switch (entry.type) {
    case 'color':
      return close(toRgba(value), parseColor(expected));
    case 'shadow': {
      if (expected === 'none') return Array.isArray(value) && value.length === 0;
      const layers = expected
        .split(/(?<=\)),\s/)
        .map((part) => part.match(/^(\S+) (\S+) (\S+) (rgba\(.*\))$/)!);
      return layers.every((layer, i) => {
        const ours = value[i];
        return (
          resolvedCss(model, path, context).split(', ').length >= layers.length &&
          [ours.offsetX, ours.offsetY, ours.blur]
            .map((d: { value: number; unit: string }) =>
              d.value === 0 ? '0' : `${d.value}${d.unit}`,
            )
            .join(' ') === layer.slice(1, 4).join(' ') &&
          close(toRgba(ours.color), parseColor(layer[4]!))
        );
      });
    }
    case 'fontFamily': {
      const list = (css: string) => css.split(',').map((f) => f.trim().replace(/^"|"$/g, ''));
      return list(resolvedCss(model, path, context)).join('|') === list(expected).join('|');
    }
    case 'number':
      return value === (expected.endsWith('%') ? parseFloat(expected) / 100 : Number(expected));
    default:
      return resolvedCss(model, path, context) === expected;
  }
}

describe.each(designTokens.map((token) => [token.name, token] as const))('%s', (name, token) => {
  const entry = byCssVar.get(`--${name}`);

  it('exists under the same name', () => {
    expect(entry, `--${name}`).toBeDefined();
  });

  it.each(THEMES)('matches the spec in %s', (theme) => {
    expect(matches(entry!.path, designResolve(token.value, theme), { theme })).toBe(true);
  });
});

describe('density', () => {
  it.each([
    ['panel.padding', 'apui-panel-padding'],
    ['panel.gap', 'apui-panel-gap'],
    ['row.height', 'apui-row-height'],
    ['cell.padding-x', 'apui-cell-padding-x'],
    ['field.gap', 'apui-field-gap'],
  ])('%s resolves to the spec value in each mode', (path, name) => {
    for (const [mode, suffix] of [
      ['compact', '-compact'],
      ['default', ''],
      ['comfortable', '-comfortable'],
    ]) {
      const expected = designResolve(designByName.get(`${name}${suffix}`)!.value, 'light');
      expect(resolvedCss(model, path, { density: mode! }), `${path} in ${mode}`).toBe(expected);
    }
  });

  it('sets the multiplier per mode', () => {
    expect(
      ['compact', 'default', 'comfortable'].map((density) =>
        resolvedCss(model, 'density', { density }),
      ),
    ).toEqual(['0.8', '1', '1.2']);
  });
});

describe('type styles', () => {
  interface Style {
    name: string;
    family: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
    letterSpacing?: string;
  }
  const styles: [string, Style][] = design.type.groups.flatMap(
    (group: { family: string; styles: Style[] }) =>
      group.styles.map((style) => [style.name, { ...style, family: group.family }]),
  );

  it.each(styles)('%s', (name, style) => {
    const css = (prop: string) => resolvedCss(model, `type.${name}.${prop}`);
    expect(css('font-size')).toBe(style.fontSize);
    expect(css('line-height')).toBe(style.lineHeight);
    expect(css('font-weight')).toBe(String(style.fontWeight));
    expect(css('letter-spacing')).toBe(style.letterSpacing ?? '0');
    expect(css('font-family')).toBe(resolvedCss(model, `font-family.${style.family}`));
  });
});

/**
 * WCAG 2.2 AA contrast for semantic pairs (#20), in every theme. Text pairs
 * need 4.5:1; control edges, focus rings and non-text marks need 3:1
 * (WCAG 1.4.3 and 1.4.11).
 */
import { join } from 'node:path';

import { contrast, over, toRgba } from '../scripts/lib/contrast.mjs';
import { loadTokens, resolveValue } from '../scripts/lib/model.mjs';

const model = loadTokens(join(__dirname, '..', 'tokens'));
const THEMES = ['light', 'dark', 'high-contrast'];
const SURFACES = [
  'surface.sunken',
  'surface.page',
  'surface.default',
  'surface.raised',
  'surface.overlay',
];
const COLORS = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'];
const SYNTAX = ['keyword', 'string', 'number', 'function', 'property', 'comment'];
const BACKDROPS: Record<string, number[]> = {
  black: [0, 0, 0, 1],
  white: [1, 1, 1, 1],
  red: [1, 0, 0, 1],
  blue: [0, 0, 1, 1],
};

const rgba = (path: string, theme: string) => toRgba(resolveValue(model, path, { theme }));

/** Contrast of `fg` on `bg`, compositing translucent colors over what sits below them. */
function ratio(fg: string, bg: string, theme: string, backdrop = BACKDROPS.white!) {
  const background = over(rgba(bg, theme), backdrop);
  return contrast(over(rgba(fg, theme), background), background);
}

type Pair = [fg: string, bg: string, min: number];

function pairs(): Pair[] {
  const list: Pair[] = [];
  for (const surface of SURFACES) {
    list.push(['text.default', surface, 4.5], ['text.muted', surface, 4.5]);
    list.push(['border.default', surface, 3], ['focus-ring.color', surface, 3]);
    for (const color of COLORS) {
      list.push([`color.${color}-text`, surface, 4.5], [`color.${color}-border`, surface, 3]);
    }
  }
  list.push(['text.inverse', 'surface.inverse', 4.5]);
  list.push(['text.default', 'selected.bg', 4.5]);
  for (const color of COLORS) {
    list.push([`color.${color}-foreground`, `color.${color}`, 4.5]);
    list.push([`color.${color}-soft-foreground`, `color.${color}-soft`, 4.5]);
  }
  for (const token of SYNTAX) list.push([`syntax.${token}`, 'surface.sunken', 4.5]);
  return list;
}

describe.each(THEMES)('%s theme', (theme) => {
  it.each(pairs())('%s on %s reaches %s:1', (fg, bg, min) => {
    expect(ratio(fg, bg, theme)).toBeGreaterThanOrEqual(min);
  });

  it.each(Object.keys(BACKDROPS))('glass text holds over a %s backdrop', (name) => {
    const backdrop = BACKDROPS[name]!;
    expect(ratio('text.default', 'surface.glass', theme, backdrop)).toBeGreaterThanOrEqual(4.5);
    expect(ratio('text.muted-glass', 'surface.glass', theme, backdrop)).toBeGreaterThanOrEqual(4.5);
  });
});

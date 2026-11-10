/**
 * The WCAG 2.2 AA pairs every theme, preset and generated brand preset must
 * pass (#20, #23, #27). Text pairs need 4.5:1; control edges, focus rings and
 * non-text marks need 3:1 (WCAG 1.4.3 and 1.4.11). Glass text is checked over
 * black, white, red and blue backdrops (D-005).
 */
import { AXES } from './config.mjs';
import { contrast, over, toRgba } from './contrast.mjs';
import { resolveValue } from './model.mjs';

export const THEMES = AXES.theme.modes;

export const SURFACES = [
  'surface.sunken',
  'surface.page',
  'surface.default',
  'surface.raised',
  'surface.overlay',
];

export const COLORS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
];

export const SYNTAX = ['keyword', 'string', 'number', 'function', 'property', 'comment'];

export const BACKDROPS = {
  black: [0, 0, 0, 1],
  white: [1, 1, 1, 1],
  red: [1, 0, 0, 1],
  blue: [0, 0, 1, 1],
};

/**
 * `[foreground, background, minimum ratio]` for every opaque pair.
 *
 * @returns {[string, string, number][]}
 */
export function contrastPairs() {
  const list = [];
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

/**
 * `[foreground, minimum ratio]` for text on `surface.glass`, checked over every backdrop.
 *
 * @type {[string, number][]}
 */
export const GLASS_PAIRS = [
  ['text.default', 4.5],
  ['text.muted-glass', 4.5],
];

const rgba = (model, path, theme) => toRgba(resolveValue(model, path, { theme }));

/** Contrast of `fg` on `bg`, compositing translucent colors over what sits below them. */
export function ratio(model, fg, bg, theme, backdrop = BACKDROPS.white) {
  const background = over(rgba(model, bg, theme), backdrop);
  return contrast(over(rgba(model, fg, theme), background), background);
}

/**
 * Every failing pair in every theme. An empty list means the model passes.
 *
 * @returns {{ theme: string, fg: string, bg: string, backdrop?: string, ratio: number, min: number }[]}
 */
export function checkContrast(model) {
  const failures = [];
  for (const theme of THEMES) {
    for (const [fg, bg, min] of contrastPairs()) {
      const value = ratio(model, fg, bg, theme);
      if (value < min) failures.push({ theme, fg, bg, ratio: value, min });
    }
    for (const [name, backdrop] of Object.entries(BACKDROPS)) {
      for (const [fg, min] of GLASS_PAIRS) {
        const value = ratio(model, fg, 'surface.glass', theme, backdrop);
        if (value < min)
          failures.push({ theme, fg, bg: 'surface.glass', backdrop: name, ratio: value, min });
      }
    }
  }
  return failures;
}

/** One line per failure, for error messages. */
export function formatFailures(failures) {
  return failures
    .map(
      (f) =>
        `${f.theme}: ${f.fg} on ${f.bg}${f.backdrop ? ` over ${f.backdrop}` : ''} is ${f.ratio.toFixed(2)}:1, needs ${f.min}:1`,
    )
    .join('\n');
}

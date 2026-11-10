/**
 * Brand preset generator (#27). Turns a few inputs (a primary color, optional
 * secondary and accent colors, a neutral treatment and font families) into a
 * preset: semantic-token and ramp reassignments (D-010), in the same format
 * as the presets in packages/tokens/presets.
 *
 * Each generated ramp keeps the input's hue and chroma but matches the WCAG
 * relative luminance of the default ramp step for step. Contrast depends only
 * on luminance, so every pair that passes in the default theme still passes.
 * The input color itself lands exactly on the step nearest its luminance when
 * that also clears every check. The result is validated either way.
 */
import { checkContrast } from './contrast-pairs.mjs';
import { loadTokens, NAME_PATTERN, TokenError } from './model.mjs';

export class GeneratorError extends Error {}

/** The `$extensions` key that records a generated preset's inputs. */
export const GENERATOR_EXTENSION = 'dev.artisanpackui.generator';

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const EPSILON = 1e-7;

/** Parses `#rgb` or `#rrggbb` into gamma-encoded sRGB channels from 0 to 1. */
export function parseHex(input) {
  const match = String(input)
    .trim()
    .match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) throw new GeneratorError(`"${input}" is not a hex color (#rgb or #rrggbb)`);
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

export function toHex(rgb) {
  return `#${rgb
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/**
 * Gamma-encoded sRGB to OKLCH `[l, c, h]`.
 *
 * @param {number[]} rgb
 * @returns {[number, number, number]}
 */
export function srgbToOklch(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(A, B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return [L, c, h];
}

/** OKLCH to linear sRGB, unclamped. */
function oklchToLinear([L, c, h]) {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (linear) => linear.every((c) => c >= -EPSILON && c <= 1 + EPSILON);
const luminanceOfLinear = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** WCAG relative luminance of gamma-encoded sRGB. */
export function luminance(rgb) {
  return luminanceOfLinear(rgb.map(srgbToLinear));
}

/** The color at lightness `L` and hue `h`, with chroma reduced until it fits sRGB. */
function fitGamut(L, c, h) {
  let linear = oklchToLinear([L, c, h]);
  if (inGamut(linear)) return linear;
  let lo = 0;
  let hi = c;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear([L, mid, h]))) lo = mid;
    else hi = mid;
  }
  linear = oklchToLinear([L, lo, h]);
  return linear.map((x) => Math.min(1, Math.max(0, x)));
}

/**
 * The sRGB color with hue `h` and (at most) chroma `c` whose relative
 * luminance is `target`, rounded to the 8-bit color closest to that luminance.
 */
export function matchLuminance(target, c, h) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (luminanceOfLinear(fitGamut(mid, c, h)) < target) lo = mid;
    else hi = mid;
  }
  const encoded = fitGamut((lo + hi) / 2, c, h).map((x) => linearToSrgb(Math.max(0, x)) * 255);
  // Of the floor/ceil roundings, keep the one nearest the target luminance. A
  // gray rounds all three channels together, so it stays a pure gray.
  const gray = c < 1e-6;
  let best = null;
  for (let mask = 0; mask < (gray ? 2 : 8); mask++) {
    const rgb = encoded.map(
      (x, i) =>
        Math.min(255, Math.max(0, mask & (gray ? 1 : 1 << i) ? Math.ceil(x) : Math.floor(x))) / 255,
    );
    const error = Math.abs(luminance(rgb) - target);
    if (!best || error < best.error) best = { rgb, error };
  }
  return best.rgb;
}

/** An sRGB DTCG color value from gamma-encoded channels. */
export function dtcgColor(rgb, alpha = 1) {
  return {
    colorSpace: 'srgb',
    components: rgb.map((c) => Number(c.toFixed(4))),
    alpha,
    hex: toHex(rgb),
  };
}

const rgbOf = (value) => [1, 3, 5].map((i) => parseInt(value.hex.slice(i, i + 2), 16) / 255);

/** The steps of a primitive color ramp, such as `steel`, as `[step, rgb]`. */
function rampSteps(model, ramp) {
  return [...model.tokens.values()]
    .filter((entry) => entry.tier === 'primitive' && entry.path.startsWith(`${ramp}.`))
    .map((entry) => [entry.path.slice(ramp.length + 1), rgbOf(entry.value)]);
}

/** The primitive ramp a semantic color role is built on, such as `steel` for `primary`. */
export function rampFor(model, role) {
  let entry = model.tokens.get(`color.${role}`);
  while (entry) {
    const raw = entry.axis ? entry.values.light : entry.value;
    const match = typeof raw === 'string' && raw.match(/^\{([^{}]+)\}$/);
    if (!match) break;
    entry = model.tokens.get(match[1]);
    if (entry?.tier === 'primitive') return entry.path.split('.')[0];
  }
  throw new GeneratorError(`color.${role} does not alias a primitive ramp`);
}

/**
 * Rebuilds a ramp around a color: the input's hue and chroma, the default
 * ramp's luminance per step. Returns the steps and the one nearest the input.
 */
export function generateRamp(model, ramp, input) {
  const steps = rampSteps(model, ramp);
  const [, inputChroma, inputHue] = srgbToOklch(input);
  const inputLuminance = luminance(input);
  const anchor = steps.reduce((best, step) =>
    Math.abs(luminance(step[1]) - inputLuminance) < Math.abs(luminance(best[1]) - inputLuminance)
      ? step
      : best,
  );
  const [, anchorChroma, anchorHue] = srgbToOklch(anchor[1]);
  const scale = anchorChroma > 1e-4 ? inputChroma / anchorChroma : 0;
  const generated = steps.map(([step, rgb]) => {
    const [, c, h] = srgbToOklch(rgb);
    // Keep the default ramp's hue drift between steps, around the input's hue.
    const hue = (inputHue + (h - anchorHue) + 360) % 360;
    return [step, matchLuminance(luminance(rgb), c * scale, hue)];
  });
  return { steps: generated, anchor: anchor[0] };
}

/** The gray ramp at a hue: the default grays' chroma (or none) and luminance. */
export function generateNeutral(model, hue, treatment) {
  return rampSteps(model, 'gray')
    .filter(([, rgb]) => luminance(rgb) > 0 && luminance(rgb) < 1)
    .map(([step, rgb]) => {
      const [, c] = srgbToOklch(rgb);
      return [step, matchLuminance(luminance(rgb), treatment === 'pure' ? 0 : c, hue)];
    });
}

/** OKLCH literals at or below this chroma are tinted neutrals, not colors. */
const NEUTRAL_CHROMA = 0.02;

/**
 * Theme tokens with a literal, tinted-neutral OKLCH value (glass, hover and
 * pressed washes, the backdrop), re-hued to the primary or desaturated so
 * they follow the neutral treatment like the gray ramp.
 */
function tintedLiterals(model, hue, treatment) {
  const overrides = {};
  for (const entry of model.tokens.values()) {
    if (entry.axis !== 'theme' || entry.type !== 'color') continue;
    for (const [mode, value] of Object.entries(entry.values)) {
      if (value?.colorSpace !== 'oklch') continue;
      const [l, c] = value.components;
      if (c === 0 || c > NEUTRAL_CHROMA) continue;
      const components = treatment === 'pure' ? [l, 0, 0] : [l, c, Number(hue.toFixed(2))];
      (overrides[mode] ??= {})[entry.path] = { ...value, components };
    }
  }
  return overrides;
}

/** Sets a value at a dotted path in a DTCG tree. */
function setPath(tree, path, value) {
  const segments = path.split('.');
  let node = tree;
  for (const segment of segments.slice(0, -1)) node = node[segment] ??= {};
  node[segments.at(-1)] = { $value: value };
}

function parseFamilies(input) {
  const list = Array.isArray(input) ? input : String(input).split(',');
  const families = list.map((f) => f.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  if (!families.length) throw new GeneratorError('a font family list must not be empty');
  return families;
}

/**
 * @typedef {object} GeneratorOptions
 * @property {string} name The preset name (`data-preset` value).
 * @property {string} primary Primary brand color, as hex.
 * @property {string} [secondary] Secondary color, as hex. Default: keep the default.
 * @property {string} [accent] Accent color, as hex. Default: keep the default.
 * @property {'tinted' | 'pure' | 'keep'} [neutral] Grays tinted toward the primary
 *   hue (default), pure gray, or the default grays.
 * @property {string | string[]} [fontSans]
 * @property {string | string[]} [fontMono]
 * @property {string | string[]} [fontDisplay]
 * @property {string} [description]
 */

/**
 * Builds a brand preset's sources, without validating it.
 *
 * @param {import('./model.mjs').TokenModel} model The default token model.
 * @param {GeneratorOptions} options
 * @param {{ exact?: boolean }} [flags] Whether to place each input color exactly on its nearest step.
 * @returns {{ preset: import('./model.mjs').Preset, anchors: Record<string, { ramp: string, step: string, exact: boolean }> }}
 */
export function buildPreset(model, options, { exact = true } = {}) {
  const { name, neutral = 'tinted' } = options;
  if (!name || !NAME_PATTERN.test(name)) {
    throw new GeneratorError(
      `"${name}" is not a valid preset name (lowercase letters, digits, single hyphens)`,
    );
  }
  if (!['tinted', 'pure', 'keep'].includes(neutral)) {
    throw new GeneratorError(`neutral must be tinted, pure or keep, not "${neutral}"`);
  }
  if (!options.primary) throw new GeneratorError('a primary color is required');

  const inputs = Object.fromEntries(
    Object.entries({ ...options, neutral }).filter(
      ([key, value]) => value !== undefined && key !== 'name' && key !== 'description',
    ),
  );
  const base = {
    $description:
      options.description ??
      `Brand preset generated from ${options.primary} by apui-generate-preset.`,
    // The inputs, so the preset can be regenerated and checked for drift.
    $extensions: { [GENERATOR_EXTENSION]: inputs },
  };
  const anchors = {};
  const roles = { primary: options.primary, secondary: options.secondary, accent: options.accent };
  for (const [role, color] of Object.entries(roles)) {
    if (!color) continue;
    const input = parseHex(color);
    const ramp = rampFor(model, role);
    const { steps, anchor } = generateRamp(model, ramp, input);
    for (const [step, rgb] of steps) {
      setPath(base, `${ramp}.${step}`, dtcgColor(step === anchor && exact ? input : rgb));
    }
    anchors[role] = { ramp, step: anchor, exact };
  }

  const sources = [];
  if (neutral !== 'keep') {
    const hue = srgbToOklch(parseHex(options.primary))[2];
    for (const [step, rgb] of generateNeutral(model, hue, neutral)) {
      setPath(base, `gray.${step}`, dtcgColor(rgb));
    }
    for (const [mode, tokens] of Object.entries(tintedLiterals(model, hue, neutral))) {
      const tree = {};
      for (const [path, value] of Object.entries(tokens)) setPath(tree, path, value);
      sources.push({ file: `theme/${mode}.json`, axis: 'theme', mode, tree });
    }
  }

  for (const [key, path] of [
    ['fontSans', 'font-family.sans'],
    ['fontMono', 'font-family.mono'],
    ['fontDisplay', 'font-family.display'],
  ]) {
    if (options[key]) setPath(base, path, parseFamilies(options[key]));
  }

  return {
    preset: {
      name,
      sources: [{ file: 'base.json', axis: null, mode: null, tree: base }, ...sources],
    },
    anchors,
  };
}

/**
 * Generates and validates a brand preset. Each input color is placed exactly
 * on its nearest step when the result passes every contrast check; otherwise
 * the luminance-matched ramp is used. `failures` lists the pairs that still
 * fail (empty when the preset passes); callers must not ship a preset with
 * failures.
 *
 * @param {string} tokensRoot The DTCG source directory.
 * @param {GeneratorOptions} options
 */
export function generatePreset(tokensRoot, options) {
  const base = loadTokens(tokensRoot);
  const attempt = (exact) => {
    const { preset, anchors } = buildPreset(base, options, { exact });
    let model;
    try {
      model = loadTokens(tokensRoot, { preset });
    } catch (error) {
      if (error instanceof TokenError) throw new GeneratorError(error.message);
      throw error;
    }
    return { preset, anchors, model, base, failures: checkContrast(model) };
  };
  const exact = attempt(true);
  return exact.failures.length ? attempt(false) : exact;
}

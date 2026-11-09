/**
 * WCAG 2.2 contrast for resolved DTCG colors, including translucent colors
 * composited over a backdrop.
 */

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp = (c) => Math.min(1, Math.max(0, c));

function oklchToSrgb([l, c, h]) {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((channel) => clamp(linearToSrgb(channel)));
}

/** A resolved DTCG color as gamma-encoded sRGB channels from 0 to 1, plus alpha. */
export function toRgba(color) {
  const alpha = color.alpha ?? 1;
  if (color.colorSpace === 'oklch') return [...oklchToSrgb(color.components), alpha];
  const hex = color.hex;
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).concat(alpha);
}

/** Composites a translucent color over an opaque backdrop. */
export function over(top, backdrop) {
  const [r, g, b, a] = top;
  return [r, g, b].map((c, i) => c * a + backdrop[i] * (1 - a)).concat(1);
}

export function luminance([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(srgbToLinear);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** The WCAG contrast ratio of two opaque colors. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

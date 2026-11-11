/**
 * The icon registry every stack resolves string icon names against (D-017).
 *
 * Components take icons as a string name or as a slot/node (vocabulary,
 * Icons). A string resolves here: the default set is the Lucide subset in
 * `icons/lucide.json`, and apps register more names, or replace one, with
 * `registerIcons()`. React and Vue read this registry directly; Livewire UI
 * Components copies the same JSON into PHP, so a name renders the same
 * pixels in every stack.
 *
 * An icon is the inner markup of a 24x24 SVG drawn with `currentColor`.
 */
import lucide from '../icons/lucide.json';

/** Icon name to inner SVG markup. */
export type IconSet = Record<string, string>;

/** The default set, without the JSON's `$comment`. */
export const defaultIcons: Readonly<IconSet> = Object.freeze(
  Object.fromEntries(Object.entries(lucide).filter(([name]) => !name.startsWith('$'))),
);

/**
 * One registry per page, even when a bundle holds two copies of this module
 * (the CJS and ESM builds, or the package entry and the `icons` entry), so a
 * name registered through one is resolved through the other.
 */
const REGISTRY_KEY = Symbol.for('artisanpack-ui.behavior.icons');
const globalStore = globalThis as typeof globalThis & { [REGISTRY_KEY]?: Map<string, string> };
const registry: Map<string, string> = (globalStore[REGISTRY_KEY] ??= new Map(
  Object.entries(defaultIcons),
));

/** The only elements an icon body may contain: static SVG shapes. */
export const ICON_SHAPE_TAGS = Object.freeze([
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
  'g',
] as const);

/**
 * Attribute-level markup an icon body must not contain: event handlers (after
 * any separator a parser accepts), links, inline styles, character references
 * (which could spell a scheme) and script-capable URL schemes.
 */
const UNSAFE_ATTRIBUTES =
  /[\s/"'](on[a-z]+|href|xlink:href|style)\s*=|&|(javascript|vbscript|data)\s*:/i;

/**
 * Whether a body is safe to inject: every element is an allowed shape tag and
 * no attribute can run script or load anything. Every stack injects bodies as
 * HTML (`dangerouslySetInnerHTML`, `innerHTML`, `{!! !!}`), so this is an
 * allowlist rather than a denylist. Livewire UI Components applies the same
 * rules in PHP (D-017).
 */
export function isSafeIconBody(body: unknown): body is string {
  if (typeof body !== 'string' || UNSAFE_ATTRIBUTES.test(body)) return false;
  const shapes: readonly string[] = ICON_SHAPE_TAGS;
  for (const match of body.matchAll(/<\s*\/?\s*([^\s/>]*)/g)) {
    if (!shapes.includes((match[1] ?? '').toLowerCase())) return false;
  }
  return !/<\s*[!?]/.test(body);
}

/** Thrown by `registerIcons` for a body that could run script. */
export class UnsafeIconError extends Error {
  override name = 'UnsafeIconError';
}

/**
 * Adds icons to the registry, or replaces ones with the same name.
 *
 * Bodies are injected as markup in every stack, so register trusted, static
 * SVG shapes only (path, circle, rect, line, polyline, polygon, ellipse, g),
 * never user or CMS input. Any other element, event handlers, links, inline
 * styles, character references and `javascript:`, `vbscript:` or `data:`
 * URLs are rejected (`isSafeIconBody`).
 *
 * @throws {UnsafeIconError} When a body contains unsafe markup.
 */
export function registerIcons(icons: IconSet): void {
  for (const [name, body] of Object.entries(icons)) {
    if (!isSafeIconBody(body)) {
      throw new UnsafeIconError(
        `Icon "${name}" was not registered: icon bodies must be static SVG shapes (D-017)`,
      );
    }
  }
  for (const [name, body] of Object.entries(icons)) registry.set(name, body);
}

/** The inner SVG markup for a name, or `undefined` when it isn't registered. */
export function resolveIcon(name: string): string | undefined {
  return registry.get(name);
}

/** Every registered name. */
export function iconNames(): string[] {
  return [...registry.keys()];
}

/**
 * The attributes every stack puts on an icon's `<svg>`. Lucide's stroke is
 * 1.5 (brand book, Iconography); CSS sizes the icon through its part.
 */
export const ICON_SVG_ATTRIBUTES = Object.freeze({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
  focusable: 'false',
} as const);

/** A complete `<svg>` string for a name, or an empty string when it isn't registered. */
export function iconSvg(name: string): string {
  const body = resolveIcon(name);
  if (body === undefined) return '';
  const attributes = Object.entries(ICON_SVG_ATTRIBUTES)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<svg ${attributes}>${body}</svg>`;
}

/** Restores the registry to the default set. For tests. */
export function resetIcons(): void {
  registry.clear();
  for (const [name, body] of Object.entries(defaultIcons)) registry.set(name, body);
}

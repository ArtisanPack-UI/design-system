/**
 * Output formats: CSS custom properties, a typed TypeScript map and a PHP array.
 * Every output is a pure function of the model, so the build is deterministic.
 */
import { AXES, LAYER, PREFIX } from './config.mjs';
import { cssValue, resolvedCss } from './model.mjs';

const NOTICE =
  'Generated from the DTCG source in packages/tokens/tokens. Do not edit; run `npm run tokens`.';

function selector(axis, mode) {
  const attribute = `[${AXES[axis].attribute}="${mode}"]`;
  return mode === AXES[axis].default ? `:root,\n  ${attribute}` : attribute;
}

function block(selectorText, declarations) {
  return `  ${selectorText} {\n${declarations.map((line) => `    ${line}`).join('\n')}\n  }`;
}

/**
 * CSS custom properties in the `apui.tokens` layer.
 *
 * Mode tokens are declared on `:root` (default mode) and on `[data-<axis>]`,
 * so a mode can be set on any element. A custom property that references
 * another is computed where it is declared, so every token that depends on a
 * mode token is declared again in each mode block. That keeps aliases such as
 * `--apui-card-padding: var(--apui-panel-padding)` correct inside a subtree.
 */
export function formatCss(model) {
  const entries = [...model.tokens.values()];
  const declare = (entry, mode) => `${entry.cssVar}: ${cssValue(model, entry.path, mode)};`;
  const blocks = [
    block(
      ':root',
      entries.filter((e) => !e.varies).map((e) => declare(e)),
    ),
  ];

  for (const [axis, config] of Object.entries(AXES)) {
    // The default mode block also matches :root, so it comes first: a later
    // [data-<axis>] block on <html> then wins at equal specificity.
    for (const mode of [config.default, ...config.modes.filter((m) => m !== config.default)]) {
      const own = entries.filter((e) => e.axis === axis).map((e) => declare(e, mode));
      const dependent = entries.filter((e) => !e.axis && e.varies === axis).map((e) => declare(e));
      blocks.push(block(selector(axis, mode), [...own, ...dependent]));
    }
  }

  return `/*\n * @artisanpack-ui/tokens\n * ${NOTICE}\n */\n@layer ${LAYER} {\n${blocks.join('\n\n')}\n}\n`;
}

function definition(model, entry) {
  const value = entry.axis
    ? Object.fromEntries(
        AXES[entry.axis].modes.map((mode) => [mode, cssValue(model, entry.path, mode)]),
      )
    : cssValue(model, entry.path);
  const resolved = entry.varies
    ? Object.fromEntries(
        AXES[entry.varies].modes.map((mode) => [
          mode,
          resolvedCss(model, entry.path, { [entry.varies]: mode }),
        ]),
      )
    : resolvedCss(model, entry.path);
  return {
    cssVar: entry.cssVar,
    type: entry.type,
    tier: entry.tier,
    axis: entry.axis,
    varies: entry.varies,
    value,
    resolved,
  };
}

function axesData() {
  return Object.fromEntries(
    Object.entries(AXES).map(([axis, config]) => [
      axis,
      { attribute: config.attribute, default: config.default, modes: config.modes },
    ]),
  );
}

/** A typed token map. */
export function formatTs(model) {
  const lines = [...model.tokens.values()].map(
    (entry) => `  ${JSON.stringify(entry.path)}: ${JSON.stringify(definition(model, entry))},`,
  );
  return [
    `/*\n * ${NOTICE}\n */`,
    `import type { TokenDefinition, TokenAxisDefinition } from '../types';`,
    '',
    `export const prefix = ${JSON.stringify(PREFIX)};`,
    '',
    `export const layer = ${JSON.stringify(LAYER)};`,
    '',
    `export const axes = ${JSON.stringify(axesData(), null, 2)} as const satisfies Record<string, TokenAxisDefinition>;`,
    '',
    `export const tokens = {\n${lines.join('\n')}\n} as const satisfies Record<string, TokenDefinition>;`,
    '',
  ].join('\n');
}

const phpString = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function phpValue(value, depth) {
  if (value === null) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return phpString(value);
  if (Array.isArray(value)) return `[ ${value.map((item) => phpValue(item, depth)).join(', ')} ]`;
  const indent = '\t'.repeat(depth + 1);
  const keys = Object.keys(value).map(phpString);
  const width = Math.max(...keys.map((key) => key.length));
  const rows = Object.values(value).map(
    (item, i) => `${indent}${keys[i].padEnd(width)} => ${phpValue(item, depth + 1)},`,
  );
  return `[\n${rows.join('\n')}\n${'\t'.repeat(depth)}]`;
}

/** A PHP array for the Livewire package and the theme generator. */
export function formatPhp(model) {
  const data = {
    prefix: PREFIX,
    layer: LAYER,
    axes: axesData(),
    tokens: Object.fromEntries(
      [...model.tokens.values()].map((entry) => [entry.path, definition(model, entry)]),
    ),
  };
  return `<?php\n\n/**\n * ${NOTICE}\n *\n * @package ArtisanPack_UI\n */\n\nreturn ${phpValue(data, 0)};\n`;
}

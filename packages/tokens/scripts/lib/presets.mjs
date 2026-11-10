/**
 * Presets (#23, D-005, D-010): named sets of token reassignments, switched by
 * `data-preset` on any element. A preset never adds a token and never touches
 * component CSS, so swapping one at runtime restyles every component.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { AXES, LAYER } from './config.mjs';
import { NOTICE, phpValue } from './formats.mjs';
import { cssValue, loadTokens, readPreset, resolvedCss } from './model.mjs';

/** The attribute that switches presets. */
export const PRESET_ATTRIBUTE = 'data-preset';

/** Preset directories under `root`, sorted by name. */
export function presetNames(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .filter((name) => !name.startsWith('.') && statSync(join(root, name)).isDirectory())
    .sort();
}

/**
 * Loads every preset in `presetsRoot` against the token source in `tokensRoot`.
 *
 * @returns {Map<string, import('./model.mjs').TokenModel>}
 */
export function loadPresets(tokensRoot, presetsRoot) {
  return new Map(
    presetNames(presetsRoot).map((name) => [
      name,
      loadTokens(tokensRoot, { preset: readPreset(join(presetsRoot, name), name) }),
    ]),
  );
}

const modesOf = (entry) => (entry.axis ? AXES[entry.axis].modes : [undefined]);

/**
 * What a preset changes. `changed` holds the tokens whose own value differs
 * from the source. `affected` adds every token that references one of them,
 * directly or not: a custom property is computed where it is declared, so a
 * dependent has to be declared again under `data-preset` to pick up the change.
 *
 * @returns {{ changed: Set<string>, affected: Set<string> }}
 */
export function presetChanges(base, model) {
  const changed = new Set();
  for (const [path, entry] of model.tokens) {
    if (modesOf(entry).some((mode) => cssValue(base, path, mode) !== cssValue(model, path, mode))) {
      changed.add(path);
    }
  }

  const dependents = new Map();
  for (const entry of model.tokens.values()) {
    for (const ref of entry.references) {
      if (!dependents.has(ref)) dependents.set(ref, []);
      dependents.get(ref).push(entry.path);
    }
  }
  const affected = new Set(changed);
  const queue = [...changed];
  while (queue.length) {
    for (const dependent of dependents.get(queue.pop()) ?? []) {
      if (affected.has(dependent)) continue;
      affected.add(dependent);
      queue.push(dependent);
    }
  }
  return { changed, affected };
}

/** Text that can't end the CSS comment it sits in, on one line. */
export function commentSafe(text) {
  return String(text)
    .replace(/\*\//g, '* /')
    .replace(/\s*[\r\n]+\s*/g, ' ');
}

function block(selectors, declarations) {
  return `  ${selectors.join(',\n  ')} {\n${declarations.map((line) => `    ${line}`).join('\n')}\n  }`;
}

/**
 * The preset's CSS, in `@layer apui.tokens` so it stacks with the token
 * output and app CSS still wins.
 *
 * Tokens with one value are declared on `[data-preset]`. Tokens that vary by
 * a mode axis get one block per mode, matching the preset and the mode on the
 * same element, the preset inside the mode, and the mode inside the preset.
 * Those selectors are more specific than the plain mode blocks, so a theme or
 * density switched anywhere around a preset keeps the preset's values.
 *
 * `source` is the line that says where the file came from.
 */
export function formatPresetCss(
  base,
  model,
  {
    source = `Generated from packages/tokens/presets/${model.preset.name}. Do not edit; run \`npm run tokens\`.`,
  } = {},
) {
  const { name } = model.preset;
  const { affected } = presetChanges(base, model);
  const entries = [...model.tokens.values()].filter((entry) => affected.has(entry.path));
  const declare = (entry, mode) => `${entry.cssVar}: ${cssValue(model, entry.path, mode)};`;
  const preset = `[${PRESET_ATTRIBUTE}="${name}"]`;

  const blocks = [];
  const flat = entries.filter((entry) => !entry.varies).map((entry) => declare(entry));
  if (flat.length) blocks.push(block([preset], flat));

  for (const [axis, config] of Object.entries(AXES)) {
    const own = entries.filter((entry) => entry.axis === axis);
    const dependent = entries.filter((entry) => !entry.axis && entry.varies === axis);
    if (!own.length && !dependent.length) continue;
    for (const mode of [config.default, ...config.modes.filter((m) => m !== config.default)]) {
      const attribute = `[${config.attribute}="${mode}"]`;
      const selectors = [
        ...(mode === config.default ? [preset] : []),
        `${preset}${attribute}`,
        `${attribute} ${preset}`,
        `${preset} ${attribute}`,
      ];
      blocks.push(
        block(selectors, [
          ...own.map((entry) => declare(entry, mode)),
          ...dependent.map((entry) => declare(entry)),
        ]),
      );
    }
  }

  const description = model.preset.description
    ? `\n * ${commentSafe(model.preset.description)}`
    : '';
  return `/*\n * @artisanpack-ui/tokens preset "${name}".${description}\n * ${source}\n */\n@layer ${LAYER} {\n${blocks.join('\n\n')}\n}\n`;
}

/**
 * A preset as data for the TypeScript and PHP outputs: every affected token
 * with its CSS value (aliases as `var()`) and its resolved value, one per mode
 * when it varies.
 */
export function presetData(base, model) {
  const { changed, affected } = presetChanges(base, model);
  const tokens = {};
  for (const entry of model.tokens.values()) {
    if (!affected.has(entry.path)) continue;
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
    tokens[entry.path] = { changed: changed.has(entry.path), value, resolved };
  }
  return {
    name: model.preset.name,
    description: model.preset.description ?? null,
    attribute: PRESET_ATTRIBUTE,
    tokens,
  };
}

/** The presets as a typed TypeScript map. */
export function formatPresetsTs(base, presets) {
  const lines = [...presets.values()].map(
    (model) =>
      `  ${JSON.stringify(model.preset.name)}: ${JSON.stringify(presetData(base, model))},`,
  );
  return [
    `/*\n * ${NOTICE}\n */`,
    `import type { PresetDefinition } from '../types';`,
    '',
    `export const presetAttribute = ${JSON.stringify(PRESET_ATTRIBUTE)};`,
    '',
    `export const presets = {\n${lines.join('\n')}\n} as const satisfies Record<string, PresetDefinition>;`,
    '',
  ].join('\n');
}

/** The presets as a PHP array, for the Livewire package and the theme generator. */
export function formatPresetsPhp(base, presets) {
  const data = {
    attribute: PRESET_ATTRIBUTE,
    presets: Object.fromEntries(
      [...presets.values()].map((model) => [model.preset.name, presetData(base, model)]),
    ),
  };
  return `<?php\n\n/**\n * ${NOTICE}\n *\n * @package ArtisanPack_UI\n */\n\nreturn ${phpValue(data, 0)};\n`;
}

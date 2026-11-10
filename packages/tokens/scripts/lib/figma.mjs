/**
 * Figma variables from the DTCG tokens (#28).
 *
 * Figma follows the code tokens and never edits them: this module turns the
 * token model and the presets into a payload that `figma/sync-variables.js`
 * writes into a Figma file. Nothing reads variables back out of Figma.
 *
 * Three collections, one per axis, so a designer switches preset, theme and
 * density independently, as `data-preset`, `data-theme` and `data-density` do:
 *
 * | Collection | Modes                         | Holds                                          |
 * |------------|-------------------------------|------------------------------------------------|
 * | Tokens     | Strata, then one per preset   | Every primitive, flat semantic and component token |
 * | Theme      | Light, Dark, High contrast    | Theme tokens                                    |
 * | Density    | Compact, Default, Comfortable | Density tokens                                  |
 *
 * Aliases stay aliases, so Figma resolves them through the modes the way CSS
 * resolves `var()`. A theme or density token that a preset changes can't vary
 * by two collections at once, so its value is routed through a hidden variable
 * in Tokens (`theme/dark/color/primary`), which does vary by preset.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AXES } from './config.mjs';
import { toRgba } from './contrast.mjs';
import { resolvedCss, resolveValue } from './model.mjs';
import { presetChanges } from './presets.mjs';
import { aliasTarget, isAlias } from './values.mjs';

/** Bumped when the payload shape changes, so the sync script can refuse old payloads. */
export const FIGMA_PAYLOAD_VERSION = 1;

/** The collection that varies by preset. */
export const TOKENS_COLLECTION = 'Tokens';

/** The Figma mode name of the source itself, which has no `data-preset`. */
export const DEFAULT_PRESET_MODE = 'Strata';

const AXIS_COLLECTIONS = { theme: 'Theme', density: 'Density' };

/** `high-contrast` → `High contrast`. */
export function modeLabel(name) {
  const words = name.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** The Figma variable name of a token: tier-grouped in Tokens, plain in an axis collection. */
export function variableName(entry) {
  const name = entry.path.split('.').join('/');
  return entry.axis ? name : `${entry.tier}/${name}`;
}

function collectionOf(entry) {
  return entry.axis ? AXIS_COLLECTIONS[entry.axis] : TOKENS_COLLECTION;
}

/** The hidden Tokens variable that carries a preset's value for one mode of an axis token. */
export function routeName(entry, mode) {
  return `${entry.axis}/${mode}/${entry.path.split('.').join('/')}`;
}

const round = (n, places = 6) => Number(n.toFixed(places));

/**
 * The Figma type of a token. Figma has COLOR, FLOAT, STRING and BOOLEAN, so
 * dimensions in `em` or `ch`, durations' easings and shadows become strings
 * that hold the CSS value.
 */
export function figmaType(model, entry) {
  switch (entry.type) {
    case 'color':
      return 'COLOR';
    case 'dimension': {
      const value = resolveValue(model, entry.path);
      return value.unit === 'px' || value.unit === 'rem' ? 'FLOAT' : 'STRING';
    }
    case 'duration':
    case 'fontWeight':
    case 'number':
      return 'FLOAT';
    default:
      return 'STRING';
  }
}

/** A resolved DTCG value as a Figma literal of `type`. */
function literal(model, entry, type, context) {
  const value = resolveValue(model, entry.path, context);
  switch (entry.type) {
    case 'color': {
      const [r, g, b, a] = toRgba(value);
      return { r: round(r), g: round(g), b: round(b), a: round(a) };
    }
    case 'dimension':
      if (type === 'FLOAT') return value.unit === 'rem' ? value.value * 16 : value.value;
      return resolvedCss(model, entry.path, context);
    case 'duration':
      return value.unit === 's' ? value.value * 1000 : value.value;
    case 'fontWeight':
    case 'number':
      return value;
    case 'fontFamily':
      // Figma's font family scope wants one family name, not a CSS stack.
      return Array.isArray(value) ? value[0] : value;
    default:
      return resolvedCss(model, entry.path, context);
  }
}

/**
 * A token's Figma value in one mode: an alias when the source aliases a token
 * of the same Figma type, otherwise the resolved literal.
 */
function figmaValue(model, entry, mode, types) {
  const raw = entry.axis ? entry.values[mode] : entry.value;
  const type = types.get(entry.path);
  if (isAlias(raw)) {
    const target = model.tokens.get(aliasTarget(raw));
    if (types.get(target.path) === type) {
      return { alias: { collection: collectionOf(target), name: variableName(target) } };
    }
  }
  if (!entry.axis && entry.varies) {
    // A flat token that varies by an axis only works in Figma as an alias.
    throw new Error(
      `${entry.path} varies by ${entry.varies} but is not a whole alias, so it can't be a Figma variable`,
    );
  }
  return literal(model, entry, type, entry.axis ? { [entry.axis]: mode } : {});
}

/** Where a variable shows up in Figma's pickers. Primitives show nowhere: components read semantic tokens. */
export function scopesFor(entry, type) {
  if (entry.tier === 'primitive') return [];
  const path = entry.path;
  const last = path.split('.').at(-1);
  if (type === 'COLOR') {
    if (path.startsWith('text.') || last.endsWith('foreground') || last.endsWith('-text')) {
      return ['TEXT_FILL'];
    }
    if (path.startsWith('border.') || /(^|-)(border|ring|edge|rim)(-|$)/.test(last)) {
      return ['STROKE_COLOR'];
    }
    if (path.startsWith('surface.')) return ['FRAME_FILL', 'SHAPE_FILL'];
    return ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'];
  }
  if (type === 'FLOAT') {
    if (entry.type === 'fontWeight') return ['FONT_WEIGHT'];
    if (entry.type === 'duration' || entry.type === 'number') return [];
    if (/radius/.test(path)) return ['CORNER_RADIUS'];
    if (/font-size/.test(last)) return ['FONT_SIZE'];
    if (/line-height/.test(last)) return ['LINE_HEIGHT'];
    if (/(^|-)width$/.test(last) && /border|ring|stroke|outline/.test(path)) {
      return ['STROKE_FLOAT'];
    }
    if (/padding|gap|space|inset|offset/.test(path)) return ['GAP', 'WIDTH_HEIGHT'];
    return ['WIDTH_HEIGHT', 'GAP'];
  }
  if (entry.type === 'fontFamily') return ['FONT_FAMILY'];
  return [];
}

function describe(entry) {
  return [entry.description, `CSS: ${entry.cssVar}`].filter(Boolean).join('\n');
}

/**
 * Builds the payload.
 *
 * @param {import('./model.mjs').TokenModel} base The token source.
 * @param {Map<string, import('./model.mjs').TokenModel>} presets From `loadPresets`.
 */
export function figmaPayload(base, presets) {
  const presetModes = [
    [DEFAULT_PRESET_MODE, base],
    ...[...presets].map(([name, model]) => [modeLabel(name), model]),
  ];
  const types = new Map([...base.tokens.values()].map((e) => [e.path, figmaType(base, e)]));
  // A variable has one type in every mode, so a preset can't change it (a
  // dimension from px to em, say).
  for (const [name, model] of presets) {
    for (const entry of model.tokens.values()) {
      const type = figmaType(model, entry);
      if (type !== types.get(entry.path)) {
        throw new Error(
          `Preset "${name}" makes ${entry.path} a ${type} in Figma, but it is a ${types.get(entry.path)} in the source. A Figma variable has one type in every mode.`,
        );
      }
    }
  }
  const changedByPreset = new Set();
  for (const model of presets.values()) {
    for (const path of presetChanges(base, model).changed) changedByPreset.add(path);
  }

  const collections = [
    { name: TOKENS_COLLECTION, modes: presetModes.map(([label]) => label), variables: [] },
    ...Object.entries(AXIS_COLLECTIONS).map(([axis, name]) => ({
      name,
      modes: AXES[axis].modes.map(modeLabel),
      variables: [],
    })),
  ];
  const byName = Object.fromEntries(collections.map((c) => [c.name, c]));

  const common = (entry, type) => ({
    type,
    description: describe(entry),
    scopes: scopesFor(entry, type),
    codeSyntax: { WEB: `var(${entry.cssVar})` },
  });

  for (const entry of base.tokens.values()) {
    const type = types.get(entry.path);
    if (!entry.axis) {
      byName[TOKENS_COLLECTION].variables.push({
        name: variableName(entry),
        ...common(entry, type),
        values: Object.fromEntries(
          presetModes.map(([label, model]) => [
            label,
            figmaValue(model, model.tokens.get(entry.path), undefined, types),
          ]),
        ),
      });
      continue;
    }

    const routed = changedByPreset.has(entry.path);
    const values = {};
    for (const mode of AXES[entry.axis].modes) {
      if (!routed) {
        values[modeLabel(mode)] = figmaValue(base, entry, mode, types);
        continue;
      }
      const route = routeName(entry, mode);
      values[modeLabel(mode)] = { alias: { collection: TOKENS_COLLECTION, name: route } };
      byName[TOKENS_COLLECTION].variables.push({
        name: route,
        ...common(entry, type),
        description: `${modeLabel(mode)} value of ${variableName(entry)} for each preset. Use the ${AXIS_COLLECTIONS[entry.axis]} variable instead.`,
        scopes: [],
        hidden: true,
        values: Object.fromEntries(
          presetModes.map(([label, model]) => [
            label,
            figmaValue(model, model.tokens.get(entry.path), mode, types),
          ]),
        ),
      });
    }
    byName[collectionOf(entry)].variables.push({
      name: variableName(entry),
      ...common(entry, type),
      values,
    });
  }

  return {
    version: FIGMA_PAYLOAD_VERSION,
    source: '@artisanpack-ui/tokens',
    note: 'Generated from packages/tokens/tokens and packages/tokens/presets. Do not edit; run `npm run tokens`.',
    collections,
  };
}

/** The payload as committed JSON. */
export function formatFigmaJson(base, presets) {
  return `${JSON.stringify(figmaPayload(base, presets), null, 2)}\n`;
}

/** The Plugin API source that writes a payload into a file: `figma/sync-variables.js`. */
export function syncSource() {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../figma/sync-variables.js'),
    'utf8',
  ).replace(/^\/\/ eslint-disable-next-line .*\n/m, '');
}

/** The Plugin API source that builds the Reference page: `figma/reference-page.js`. */
export function referenceSource() {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../figma/reference-page.js'),
    'utf8',
  ).replace(/^\/\/ eslint-disable-next-line .*\n/m, '');
}

/**
 * A development plugin that syncs the payload into the open file and rebuilds
 * the Reference page, for running the sync from Figma desktop without the
 * connector.
 */
export function formatFigmaPlugin(base, presets) {
  const payload = JSON.stringify(figmaPayload(base, presets));
  return `${syncSource()}
${referenceSource().replace(/^\/\* global figma \*\/\n/, '')}
// Generated by packages/tokens/scripts/build-tokens.mjs. Do not edit; run \`npm run tokens\`.
apuiSyncVariables(${payload})
  .then((summary) => apuiBuildReferencePage().then(() => summary))
  .then((summary) => figma.closePlugin(\`ArtisanPack UI tokens synced: \${JSON.stringify(summary)}\`))
  .catch((error) => figma.closePlugin(\`ArtisanPack UI tokens sync failed: \${error.message}\`));
`;
}

/** The development plugin's manifest. */
export function formatFigmaManifest() {
  const manifest = {
    name: 'ArtisanPack UI tokens sync',
    id: 'artisanpack-ui-tokens-sync',
    api: '1.0.0',
    main: 'plugin.js',
    editorType: ['figma'],
    documentAccess: 'dynamic-page',
    networkAccess: { allowedDomains: ['none'] },
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

/** The sync source without comments or indentation, to leave room for data in a chunk. */
function minifiedSource() {
  return syncSource()
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/^\s+/, '').replace(/^\/\/.*$/, ''))
    .filter(Boolean)
    .join('\n');
}

const TYPE_CODES = { COLOR: 'c', FLOAT: 'f', STRING: 's' };

/** A color as `#rrggbb` when that is exact, otherwise unchanged. */
function compactColor(value) {
  if (value.a !== 1) return value;
  const bytes = [value.r, value.g, value.b].map((c) => c * 255);
  if (bytes.some((b) => Math.abs(b - Math.round(b)) > 1e-3)) return value;
  const hex = `#${bytes.map((b) => Math.round(b).toString(16).padStart(2, '0')).join('')}`;
  const back = [1, 3, 5].map((i) => Number((parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(6)));
  return back.every((c, i) => c === [value.r, value.g, value.b][i]) ? hex : value;
}

/**
 * Splits the payload into Plugin API scripts of at most `limit` characters,
 * for tools that run one script at a time with a size cap, like the Figma
 * connector's `use_figma` (50,000). Run them in order: every declare chunk,
 * then every values chunk, then the prune chunk. Each script carries the sync
 * source and one compact chunk (see `apuiExpandChunk`), so it needs nothing
 * from an earlier run.
 *
 * @returns {{ step: 'declare' | 'values' | 'prune' | 'reference', code: string }[]}
 */
export function figmaChunks(base, presets, { limit = 45000 } = {}) {
  const payload = figmaPayload(base, presets);
  const source = minifiedSource();
  const index = Object.fromEntries(payload.collections.map((c, i) => [c.name, i]));
  const c = payload.collections.map(({ name, modes }) => [name, modes]);
  const script = (chunk, options) =>
    `${source}\nreturn await apuiSyncVariables(apuiExpandChunk(${JSON.stringify({ version: payload.version, c, ...chunk })}), ${JSON.stringify(options)});\n`;

  const encodeValue = (type, value) => {
    if (value && typeof value === 'object' && 'alias' in value) {
      return `=${index[value.alias.collection]}:${value.alias.name}`;
    }
    if (typeof value === 'string' && value.startsWith('=')) return `=${value}`;
    return type === 'COLOR' ? compactColor(value) : value;
  };
  const declare = (variable) => {
    const cssVar = variable.codeSyntax.WEB.slice(4, -1);
    const item = {
      n: variable.name,
      t: TYPE_CODES[variable.type],
      c: cssVar,
    };
    const description = variable.description
      .replace(`\nCSS: ${cssVar}`, '')
      .replace(`CSS: ${cssVar}`, '');
    if (description) item.d = description;
    if (variable.scopes.length) item.s = variable.scopes;
    if (variable.hidden) item.h = 1;
    return item;
  };
  const values = (variable) => {
    const encoded = Object.values(variable.values).map((v) => encodeValue(variable.type, v));
    const same = encoded.every((v) => JSON.stringify(v) === JSON.stringify(encoded[0]));
    return { n: variable.name, t: TYPE_CODES[variable.type], v: same ? encoded[0] : encoded };
  };
  const steps = [
    ['declare', declare, { declare: true, values: false, prune: false }],
    ['values', values, { declare: false, values: true, prune: false }],
  ];

  const chunks = [];
  for (const [step, encode, options] of steps) {
    let current = payload.collections.map(() => []);
    let size = script({ v: current }, options).length;
    const flush = () => {
      if (current.some((list) => list.length)) {
        chunks.push({ step, code: script({ v: current }, options) });
      }
      current = payload.collections.map(() => []);
      size = script({ v: current }, options).length;
    };
    for (const [i, collection] of payload.collections.entries()) {
      for (const variable of collection.variables) {
        const item = encode(variable);
        const added = JSON.stringify(item).length + 1;
        if (size + added > limit) flush();
        current[i].push(item);
        size += added;
      }
    }
    flush();
  }

  chunks.push(
    {
      step: 'prune',
      code: script(
        { k: payload.collections.map((collection) => collection.variables.map((v) => v.name)) },
        { declare: false, values: false, prune: true },
      ),
    },
    {
      // Last: the Reference page binds to the variables the steps above wrote.
      step: 'reference',
      code: `${referenceSource()}\nreturn await apuiBuildReferencePage();\n`,
    },
  );
  return chunks;
}

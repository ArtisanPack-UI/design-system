/**
 * Loads the DTCG source, validates it against the schema in docs/tokens.md and
 * resolves aliases.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { AXES, PREFIX, TIERS } from './config.mjs';
import { forEachAlias, mapAliases, toCss, TYPES, validateValue } from './values.mjs';

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GROUP_KEYS = new Set(['$type', '$description', '$extensions']);
const TOKEN_KEYS = new Set(['$value', '$type', '$description', '$extensions', '$deprecated']);

export class TokenError extends Error {
  constructor(problems) {
    super(`Token validation failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    this.problems = problems;
  }
}

function readJson(file, root, problems) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    problems.push(`${relative(root, file)}: ${error.message}`);
    return null;
  }
}

function jsonFiles(dir) {
  return readdirSync(dir)
    .filter((name) => !name.startsWith('.'))
    .sort();
}

function order(entry) {
  const tier = TIERS.indexOf(entry);
  if (tier !== -1) return tier;
  return entry === 'modes' ? TIERS.length : TIERS.length + 1;
}

/**
 * Reads every source file. Returns `{ file, tier, axis, mode, tree }` entries.
 */
function readSources(root, problems) {
  const sources = [];
  const entries = jsonFiles(root);
  // Tiers first, in dependency order, then modes, so outputs follow the tiers.
  entries.sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  for (const entry of entries) {
    const path = join(root, entry);
    if (TIERS.includes(entry) && statSync(path).isDirectory()) {
      for (const name of jsonFiles(path)) {
        if (!name.endsWith('.json')) {
          problems.push(`${entry}/${name}: only .json files belong in tokens/${entry}`);
          continue;
        }
        const tree = readJson(join(path, name), root, problems);
        if (tree)
          sources.push({ file: `${entry}/${name}`, tier: entry, axis: null, mode: null, tree });
      }
    } else if (entry === 'modes' && statSync(path).isDirectory()) {
      for (const axis of jsonFiles(path)) {
        if (!AXES[axis]) {
          problems.push(
            `modes/${axis}: unknown mode axis (expected ${Object.keys(AXES).join(', ')})`,
          );
          continue;
        }
        const present = jsonFiles(join(path, axis));
        for (const name of present) {
          if (!AXES[axis].modes.includes(name.replace(/\.json$/, ''))) {
            problems.push(`modes/${axis}/${name}: unknown ${axis} mode`);
          }
        }
        for (const mode of AXES[axis].modes) {
          const file = join(path, axis, `${mode}.json`);
          if (!existsSync(file)) {
            problems.push(`modes/${axis}/${mode}.json: missing`);
            continue;
          }
          const tree = readJson(file, root, problems);
          if (tree)
            sources.push({
              file: `modes/${axis}/${mode}.json`,
              tier: 'semantic',
              axis,
              mode,
              tree,
            });
        }
      }
    } else {
      problems.push(`${entry}: unexpected entry (expected ${TIERS.join(', ')} or modes)`);
    }
  }
  return sources;
}

/**
 * Flattens a DTCG tree into tokens, checking names and reserved keys.
 */
function flatten(source, problems) {
  const tokens = [];
  const walk = (node, path, inheritedType) => {
    const at = `${source.file}: ${path.join('.') || '(root)'}`;
    if (node === null || typeof node !== 'object' || Array.isArray(node)) {
      problems.push(`${at}: groups and tokens must be objects`);
      return;
    }
    const isToken = '$value' in node;
    const allowed = isToken ? TOKEN_KEYS : GROUP_KEYS;
    for (const key of Object.keys(node)) {
      if (key.startsWith('$') && !allowed.has(key)) {
        problems.push(`${at}: "${key}" is not allowed on a ${isToken ? 'token' : 'group'}`);
      }
    }
    if (node.$type !== undefined && !TYPES.includes(node.$type)) {
      problems.push(`${at}: unsupported $type "${node.$type}" (expected ${TYPES.join(', ')})`);
    }
    if (node.$description !== undefined && typeof node.$description !== 'string') {
      problems.push(`${at}: $description must be a string`);
    }
    const type = node.$type ?? inheritedType;

    if (isToken) {
      const children = Object.keys(node).filter((key) => !key.startsWith('$'));
      if (children.length)
        problems.push(`${at}: a token cannot contain children (${children.join(', ')})`);
      if (!path.length) problems.push(`${at}: the file root cannot be a token`);
      tokens.push({
        path: path.join('.'),
        segments: path,
        type,
        value: node.$value,
        description: node.$description,
        source,
      });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      if (!NAME.test(key)) {
        problems.push(
          `${at}: "${key}" is not a valid name (lowercase letters, digits and single hyphens)`,
        );
        continue;
      }
      walk(child, [...path, key], type);
    }
  };
  walk(source.tree, [], undefined);
  return tokens;
}

/**
 * @typedef {object} TokenEntry
 * @property {string} path Dotted path, such as `color.primary`.
 * @property {string} cssVar Custom property, such as `--apui-color-primary`.
 * @property {'primitive' | 'semantic' | 'component'} tier
 * @property {string | null} axis Axis whose mode files define the token.
 * @property {string | null} varies Axis the value varies by, directly or through aliases.
 * @property {string} type DTCG type.
 * @property {any} [value] Source value, for tokens without an axis.
 * @property {Record<string, any>} [values] Source value per mode, for mode tokens.
 * @property {string | undefined} description
 * @property {string[]} files Source files that define the token.
 * @property {Set<string>} references Paths this token aliases.
 * @property {Set<string>} [dependsOn]
 */

/**
 * @typedef {object} TokenModel
 * @property {Map<string, TokenEntry>} tokens
 * @property {typeof AXES} axes
 */

export function cssName(path) {
  return `--${PREFIX}-${path.split('.').join('-')}`;
}

/**
 * Loads, validates and indexes the token source in `root`.
 *
 * @param {string} root
 * @returns {TokenModel}
 */
export function loadTokens(root) {
  const problems = [];
  const sources = readSources(root, problems);
  const tokens = new Map();

  for (const source of sources) {
    for (const token of flatten(source, problems)) {
      const existing = tokens.get(token.path);
      if (!source.axis) {
        if (existing) {
          problems.push(
            `${source.file}: ${token.path} is already defined in ${existing.files.join(', ')}`,
          );
          continue;
        }
        tokens.set(token.path, {
          path: token.path,
          cssVar: cssName(token.path),
          tier: source.tier,
          axis: null,
          type: token.type,
          value: token.value,
          description: token.description,
          files: [source.file],
        });
        continue;
      }
      if (existing && existing.axis !== source.axis) {
        problems.push(
          `${source.file}: ${token.path} is already defined in ${existing.files.join(', ')}`,
        );
        continue;
      }
      const entry = existing ?? {
        path: token.path,
        cssVar: cssName(token.path),
        tier: 'semantic',
        axis: source.axis,
        type: token.type,
        values: {},
        description: undefined,
        files: [],
      };
      if (entry.type !== token.type && token.type !== undefined && entry.type !== undefined) {
        problems.push(
          `${source.file}: ${token.path} is ${token.type} here but ${entry.type} in ${entry.files[0]}`,
        );
      }
      entry.type ??= token.type;
      entry.values[source.mode] = token.value;
      entry.files.push(source.file);
      if (source.mode === AXES[source.axis].default || entry.description === undefined) {
        entry.description = token.description ?? entry.description;
      }
      tokens.set(token.path, entry);
    }
  }

  // Every mode of an axis defines the same tokens.
  for (const entry of tokens.values()) {
    if (!entry.axis) continue;
    const missing = AXES[entry.axis].modes.filter((mode) => !(mode in entry.values));
    if (missing.length) {
      problems.push(
        `${entry.path}: defined for ${entry.axis} ${Object.keys(entry.values).join(', ')} but not ${missing.join(', ')}`,
      );
    }
  }

  // Unique custom property names.
  const names = new Map();
  for (const entry of tokens.values()) {
    const other = names.get(entry.cssVar);
    if (other) problems.push(`${entry.path} and ${other} both become ${entry.cssVar}`);
    names.set(entry.cssVar, entry.path);
  }

  const rawValues = (entry) => (entry.axis ? Object.values(entry.values) : [entry.value]);

  // Types: inherited, declared, or taken from a whole-value alias target.
  const typeOf = (entry, seen = new Set()) => {
    if (entry.type) return entry.type;
    if (seen.has(entry.path)) return undefined;
    seen.add(entry.path);
    for (const value of rawValues(entry)) {
      const match = typeof value === 'string' && value.match(/^\{([^{}]+)\}$/);
      const target = match && tokens.get(match[1]);
      if (target) return typeOf(target, seen);
    }
    return undefined;
  };
  for (const entry of tokens.values()) {
    entry.type = typeOf(entry);
    if (!entry.type) problems.push(`${entry.files[0]}: ${entry.path} has no $type`);
  }

  // Values, references and tier direction.
  for (const entry of tokens.values()) {
    if (!entry.type) continue;
    entry.references = new Set();
    for (const value of rawValues(entry)) {
      for (const error of validateValue(entry.type, value)) {
        problems.push(`${entry.files[0]}: ${entry.path}: ${error}`);
      }
      forEachAlias(entry.type, value, (target, expectedType) => {
        const ref = tokens.get(target);
        if (!ref) {
          problems.push(
            `${entry.files[0]}: ${entry.path} references {${target}}, which does not exist`,
          );
          return;
        }
        entry.references.add(target);
        if (ref.type && ref.type !== expectedType) {
          problems.push(
            `${entry.files[0]}: ${entry.path} expects a ${expectedType} but {${target}} is a ${ref.type}`,
          );
        }
        if (entry.tier === 'primitive') {
          problems.push(
            `${entry.files[0]}: ${entry.path} is a primitive and cannot reference {${target}}`,
          );
        } else if (TIERS.indexOf(ref.tier) > TIERS.indexOf(entry.tier)) {
          problems.push(
            `${entry.files[0]}: ${entry.path} (${entry.tier}) cannot reference {${target}} (${ref.tier})`,
          );
        }
      });
    }
  }

  if (problems.length) throw new TokenError(problems);

  // Cycles.
  const state = new Map();
  const visit = (path, trail) => {
    if (state.get(path) === 'done') return;
    if (state.get(path) === 'active') {
      problems.push(`reference cycle: ${[...trail.slice(trail.indexOf(path)), path].join(' -> ')}`);
      return;
    }
    state.set(path, 'active');
    for (const ref of tokens.get(path).references) visit(ref, [...trail, path]);
    state.set(path, 'done');
  };
  for (const path of tokens.keys()) visit(path, []);
  if (problems.length) throw new TokenError(problems);

  // Which axes each token varies by, directly or through its references.
  const axesOf = (entry) => {
    if (entry.dependsOn) return entry.dependsOn;
    const set = new Set(entry.axis ? [entry.axis] : []);
    for (const ref of entry.references) for (const axis of axesOf(tokens.get(ref))) set.add(axis);
    entry.dependsOn = set;
    return set;
  };
  for (const entry of tokens.values()) {
    const axes = axesOf(entry);
    if (entry.axis && axes.size > 1) {
      problems.push(
        `${entry.path} is a ${entry.axis} token but also varies by ${[...axes].filter((a) => a !== entry.axis).join(', ')}`,
      );
    } else if (axes.size > 1) {
      problems.push(
        `${entry.path} varies by more than one axis (${[...axes].join(', ')}), which the outputs do not support yet`,
      );
    }
    entry.varies = axes.size ? [...axes][0] : null;
  }
  if (problems.length) throw new TokenError(problems);

  return { tokens, axes: AXES };
}

/**
 * Resolves a token to a literal DTCG value in a mode context such as
 * `{ theme: 'dark', density: 'compact' }`. Missing axes use their default.
 */
export function resolveValue(model, path, context = {}) {
  const entry = model.tokens.get(path);
  const mode = entry.axis ? (context[entry.axis] ?? AXES[entry.axis].default) : null;
  const raw = entry.axis ? entry.values[mode] : entry.value;
  return mapAliases(entry.type, raw, (target) => resolveValue(model, target, context));
}

/** The token's CSS value, with aliases as `var()` references. */
export function cssValue(model, path, mode) {
  const entry = model.tokens.get(path);
  const raw = entry.axis ? entry.values[mode] : entry.value;
  return toCss(entry.type, raw, (target) => `var(${cssName(target)})`);
}

/** The token's fully resolved CSS value in a mode context. */
export function resolvedCss(model, path, context = {}) {
  const entry = model.tokens.get(path);
  return toCss(entry.type, resolveValue(model, path, context), () => {
    throw new Error('unresolved alias');
  });
}

/* global figma */
/**
 * Writes the token payload (`generated/figma/variables.json`) into the open
 * Figma file's local variables (#28). Runs in the Figma Plugin API: as the
 * generated development plugin, or pasted into the Figma connector in chunks.
 *
 * One-way and idempotent. Collections, modes and variables are matched by
 * name, so running it twice changes nothing, and a token change only updates
 * what changed. Anything edited in Figma is overwritten on the next sync.
 *
 *   await apuiSyncVariables(payload)
 *     Declares every variable, then sets every value, then prunes.
 *   await apuiSyncVariables(chunk, { declare: true, values: false, prune: false })
 *     One step of a chunked run. Values can only be set once every alias target
 *     exists, so a chunked run declares every chunk before setting any value.
 *
 * A payload is `{ version, collections: [{ name, modes, variables }] }`. A
 * chunk is the same shape with a subset of the variables; `keep` (names per
 * collection) replaces `variables` for the prune step.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- called by the plugin and the chunks
async function apuiSyncVariables(payload, { declare = true, values = true, prune = true } = {}) {
  if (payload.version !== 1) {
    throw new Error(`Unsupported payload version ${payload.version}; regenerate it.`);
  }
  const summary = { created: 0, updated: 0, retyped: 0, removed: 0, modes: 0, values: 0 };
  const api = figma.variables;

  const collections = new Map();
  for (const collection of await api.getLocalVariableCollectionsAsync()) {
    collections.set(collection.name, collection);
  }

  // Collections and modes, in payload order. The first mode is the default.
  const modeIds = new Map();
  for (const spec of payload.collections) {
    let collection = collections.get(spec.name);
    if (!collection) {
      collection = api.createVariableCollection(spec.name);
      collections.set(spec.name, collection);
    }
    const ids = {};
    spec.modes.forEach((mode) => {
      const existing = collection.modes.find((m) => m.name === mode);
      if (existing) {
        ids[mode] = existing.modeId;
        return;
      }
      // Rename a mode the payload no longer has rather than add one: a new
      // collection's "Mode 1", or a replaced preset. Figma caps modes per
      // collection (4 on Professional), so adding first would fail at the cap.
      const unused = collection.modes.find(
        (m) => !spec.modes.includes(m.name) && !Object.values(ids).includes(m.modeId),
      );
      if (unused) {
        collection.renameMode(unused.modeId, mode);
        ids[mode] = unused.modeId;
      } else {
        ids[mode] = collection.addMode(mode);
      }
      summary.modes++;
    });
    if (prune) {
      for (const mode of collection.modes) {
        if (!spec.modes.includes(mode.name) && collection.modes.length > 1) {
          collection.removeMode(mode.modeId);
          summary.modes++;
        }
      }
    }
    modeIds.set(spec.name, ids);
  }

  // Existing variables, by collection and name.
  const variables = new Map();
  const key = (collectionName, name) => `${collectionName}\u0000${name}`;
  const collectionNames = new Map([...collections.values()].map((c) => [c.id, c.name]));
  for (const variable of await api.getLocalVariablesAsync()) {
    const collectionName = collectionNames.get(variable.variableCollectionId);
    if (collectionName) variables.set(key(collectionName, variable.name), variable);
  }

  if (declare) {
    for (const spec of payload.collections) {
      const collection = collections.get(spec.name);
      for (const item of spec.variables ?? []) {
        let variable = variables.get(key(spec.name, item.name));
        if (variable && variable.resolvedType !== item.type) {
          variable.remove();
          variable = undefined;
          summary.retyped++;
        }
        if (!variable) {
          variable = api.createVariable(item.name, collection, item.type);
          variables.set(key(spec.name, item.name), variable);
          summary.created++;
        } else {
          summary.updated++;
        }
        if (item.description !== undefined && variable.description !== item.description) {
          variable.description = item.description;
        }
        if (item.scopes) variable.scopes = item.scopes;
        for (const [platform, syntax] of Object.entries(item.codeSyntax ?? {})) {
          variable.setVariableCodeSyntax(platform, syntax);
        }
        variable.hiddenFromPublishing = Boolean(item.hidden);
      }
    }
  }

  if (values) {
    for (const spec of payload.collections) {
      const ids = modeIds.get(spec.name);
      for (const item of spec.variables ?? []) {
        const variable = variables.get(key(spec.name, item.name));
        if (!variable) throw new Error(`${spec.name}/${item.name} is not declared yet.`);
        for (const [mode, value] of Object.entries(item.values ?? {})) {
          if (!(mode in ids)) throw new Error(`${spec.name} has no mode "${mode}".`);
          let figmaValue = value;
          if (value && typeof value === 'object' && 'alias' in value) {
            const target = variables.get(key(value.alias.collection, value.alias.name));
            if (!target) {
              throw new Error(
                `${spec.name}/${item.name} aliases ${value.alias.collection}/${value.alias.name}, which does not exist.`,
              );
            }
            figmaValue = api.createVariableAlias(target);
          }
          variable.setValueForMode(ids[mode], figmaValue);
          summary.values++;
        }
      }
    }
  }

  if (prune) {
    for (const spec of payload.collections) {
      const keep = new Set(spec.keep ?? (spec.variables ?? []).map((item) => item.name));
      for (const [id, variable] of variables) {
        const [collectionName, name] = id.split('\u0000');
        if (collectionName === spec.name && !keep.has(name)) {
          variable.remove();
          variables.delete(id);
          summary.removed++;
        }
      }
    }
  }

  return summary;
}

/**
 * Expands a compact chunk from `npm run figma:chunks` into a payload for
 * `apuiSyncVariables`. Chunks are compact so each fits the connector's cap:
 *
 * - `c`: collections as `[name, modes]`.
 * - `v`: per collection, variables as `{ n, t, c, d, s, h, v }`: name, type,
 *   custom property, description, scopes, hidden, values.
 * - A value is one value for every mode, or an array in mode order.
 *   `=<collection index>:<name>` is an alias, `#rrggbb` an opaque color.
 * - `k`: per collection, the names to keep, for the prune step.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- called by the chunks
function apuiExpandChunk(chunk) {
  const types = { c: 'COLOR', f: 'FLOAT', s: 'STRING' };
  const literal = (type, value) => {
    if (type === 'COLOR' && typeof value === 'string') {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
      return { r: Number(r.toFixed(6)), g: Number(g.toFixed(6)), b: Number(b.toFixed(6)), a: 1 };
    }
    return value;
  };
  const decode = (type, value) => {
    if (typeof value === 'string' && value.startsWith('=') && !value.startsWith('==')) {
      // `=<collection index>:<name>`
      const colon = value.indexOf(':');
      return {
        alias: {
          collection: chunk.c[Number(value.slice(1, colon))][0],
          name: value.slice(colon + 1),
        },
      };
    }
    if (typeof value === 'string' && value.startsWith('==')) return value.slice(1);
    return literal(type, value);
  };
  return {
    version: chunk.version,
    collections: chunk.c.map(([name, modes], index) => {
      const collection = { name, modes };
      if (chunk.k) collection.keep = chunk.k[index];
      collection.variables = (chunk.v?.[index] ?? []).map((item) => {
        const type = types[item.t];
        const variable = { name: item.n, type };
        if (item.c) {
          variable.description = [item.d, `CSS: ${item.c}`].filter(Boolean).join('\n');
          variable.scopes = item.s ?? [];
          variable.codeSyntax = { WEB: `var(${item.c})` };
          variable.hidden = Boolean(item.h);
        }
        if ('v' in item) {
          const values = Array.isArray(item.v) ? item.v : modes.map(() => item.v);
          variable.values = Object.fromEntries(modes.map((m, i) => [m, decode(type, values[i])]));
        }
        return variable;
      });
      return collection;
    }),
  };
}

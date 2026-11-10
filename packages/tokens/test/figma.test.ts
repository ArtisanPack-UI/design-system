/**
 * Figma variables (#28): the payload covers every token, tier, theme and
 * preset, and the sync script is repeatable, whole or in connector chunks.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

import {
  DEFAULT_PRESET_MODE,
  figmaChunks,
  figmaPayload,
  modeLabel,
  syncSource,
  TOKENS_COLLECTION,
  variableName,
} from '../scripts/lib/figma.mjs';
import { loadTokens, resolvedCss } from '../scripts/lib/model.mjs';
import { loadPresets } from '../scripts/lib/presets.mjs';

type Alias = { alias: { collection: string; name: string } };
type Rgba = { r: number; g: number; b: number; a: number };
type Value = Alias | Rgba | number | string;
type Variable = {
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING';
  scopes: string[];
  hidden?: boolean;
  codeSyntax: { WEB: string };
  values: Record<string, Value>;
};
type Collection = { name: string; modes: string[]; variables: Variable[] };

const root = join(__dirname, '..');
const base = loadTokens(join(root, 'tokens'));
const presets = loadPresets(join(root, 'tokens'), join(root, 'presets'));
const payload = figmaPayload(base, presets) as { version: number; collections: Collection[] };
const collection = (name: string) => payload.collections.find((c) => c.name === name)!;
const find = (collectionName: string, name: string) =>
  collection(collectionName).variables.find((v) => v.name === name)!;
const isAlias = (value: Value): value is Alias => typeof value === 'object' && 'alias' in value;

/**
 * Follows aliases the way Figma does: each collection resolves in the mode
 * chosen for it, here one mode per collection.
 */
function resolve(collectionName: string, name: string, modes: Record<string, string>): Value {
  const value = find(collectionName, name).values[modes[collectionName]!]!;
  return isAlias(value) ? resolve(value.alias.collection, value.alias.name, modes) : value;
}

const hex = ({ r, g, b }: Rgba) =>
  `#${[r, g, b]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

describe('payload', () => {
  it('is committed and up to date', () => {
    const committed = JSON.parse(
      readFileSync(join(root, 'generated/figma/variables.json'), 'utf8'),
    );
    expect(committed).toEqual(payload);
  });

  it('has one collection per axis, within the Professional plan limit of 4 modes', () => {
    expect(payload.collections.map((c) => [c.name, c.modes])).toEqual([
      [TOKENS_COLLECTION, [DEFAULT_PRESET_MODE, ...[...presets.keys()].map(modeLabel)]],
      ['Theme', ['Light', 'Dark', 'High contrast']],
      ['Density', ['Compact', 'Default', 'Comfortable']],
    ]);
    for (const c of payload.collections) expect(c.modes.length).toBeLessThanOrEqual(4);
  });

  it('has a variable for every token, in all three tiers', () => {
    const names = new Set(
      payload.collections.flatMap((c) => c.variables.filter((v) => !v.hidden).map((v) => v.name)),
    );
    for (const entry of base.tokens.values()) expect(names).toContain(variableName(entry));
    const tiers = new Set(collection(TOKENS_COLLECTION).variables.map((v) => v.name.split('/')[0]));
    expect([...tiers]).toEqual(expect.arrayContaining(['primitive', 'semantic', 'component']));
  });

  it('gives every variable a value in every mode, and every alias a target of the same type', () => {
    for (const c of payload.collections) {
      for (const variable of c.variables) {
        expect(Object.keys(variable.values)).toEqual(c.modes);
        for (const value of Object.values(variable.values)) {
          if (!isAlias(value)) continue;
          const target = find(value.alias.collection, value.alias.name);
          expect(target, `${variable.name} → ${value.alias.name}`).toBeDefined();
          expect(target.type).toBe(variable.type);
        }
      }
    }
  });

  it('links each variable to its custom property', () => {
    expect(find('Theme', 'color/primary').codeSyntax.WEB).toBe('var(--apui-color-primary)');
  });

  it('keeps primitives out of the pickers and scopes semantic colors by role', () => {
    expect(find(TOKENS_COLLECTION, 'primitive/gray/500').scopes).toEqual([]);
    expect(find('Theme', 'text/default').scopes).toEqual(['TEXT_FILL']);
    expect(find('Theme', 'surface/page').scopes).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
  });

  it.each(['color.primary', 'surface.page', 'text.muted', 'border.muted'])(
    'resolves %s to the CSS value in every preset and theme',
    (path) => {
      const models = [
        [DEFAULT_PRESET_MODE, base],
        ...[...presets].map(([n, m]) => [modeLabel(n), m]),
      ];
      for (const [presetMode, model] of models as [string, typeof base][]) {
        for (const mode of base.axes.theme.modes) {
          const value = resolve('Theme', path.split('.').join('/'), {
            [TOKENS_COLLECTION]: presetMode,
            Theme: modeLabel(mode),
            Density: 'Default',
          }) as Rgba;
          const css = resolvedCss(model, path, { theme: mode });
          if (css.startsWith('#')) expect(hex(value), `${presetMode} ${mode}`).toBe(css);
        }
      }
    },
  );

  it('resolves density tokens per preset through the routed values', () => {
    for (const [name, model] of presets) {
      for (const mode of base.axes.density.modes) {
        const value = resolve('Density', 'panel/padding', {
          [TOKENS_COLLECTION]: modeLabel(name),
          Theme: 'Light',
          Density: modeLabel(mode),
        });
        expect(`${value}px`).toBe(resolvedCss(model, 'panel.padding', { density: mode }));
      }
    }
  });

  it('follows density through component aliases', () => {
    expect(find(TOKENS_COLLECTION, 'component/card/padding').values[DEFAULT_PRESET_MODE]).toEqual({
      alias: { collection: 'Density', name: 'panel/padding' },
    });
  });
});

type FakeMode = { modeId: string; name: string };
type FakeCollection = { id: string; name: string; modes: FakeMode[] };
type FakeAlias = { type: 'VARIABLE_ALIAS'; id: string };
type FakeVariable = {
  id: string;
  name: string;
  resolvedType: string;
  variableCollectionId: string;
  scopes: string[];
  codeSyntax: Record<string, string>;
  hiddenFromPublishing: boolean;
  valuesByMode: Record<string, unknown>;
  remove(): void;
};
const isFakeAlias = (value: unknown): value is FakeAlias =>
  typeof value === 'object' && value !== null && (value as FakeAlias).type === 'VARIABLE_ALIAS';

/** An in-memory stand-in for `figma.variables`, enough for the sync script. */
function fakeFigma() {
  let next = 0;
  const id = (kind: string) => `${kind}:${++next}`;
  const collections = new Map<string, FakeCollection>();
  const variables = new Map<string, FakeVariable>();
  const api = {
    getLocalVariableCollectionsAsync: async () => [...collections.values()],
    getLocalVariablesAsync: async () => [...variables.values()],
    createVariableCollection(name: string) {
      const collection = {
        id: id('collection'),
        name,
        modes: [{ modeId: id('mode'), name: 'Mode 1' }],
        renameMode(modeId: string, newName: string) {
          this.modes.find((m) => m.modeId === modeId)!.name = newName;
        },
        addMode(modeName: string) {
          if (this.modes.length >= 4) throw new Error('Professional plans allow 4 modes');
          const modeId = id('mode');
          this.modes.push({ modeId, name: modeName });
          return modeId;
        },
        removeMode(modeId: string) {
          this.modes = this.modes.filter((m) => m.modeId !== modeId);
        },
      };
      collections.set(collection.id, collection);
      return collection;
    },
    createVariable(name: string, collection: FakeCollection, resolvedType: string) {
      const variable: FakeVariable & {
        description: string;
        setVariableCodeSyntax(p: string, s: string): void;
        setValueForMode(m: string, v: unknown): void;
      } = {
        id: id('variable'),
        name,
        resolvedType,
        variableCollectionId: collection.id,
        description: '',
        scopes: ['ALL_SCOPES'],
        codeSyntax: {} as Record<string, string>,
        hiddenFromPublishing: false,
        valuesByMode: {} as Record<string, unknown>,
        setVariableCodeSyntax(platform: string, syntax: string) {
          this.codeSyntax[platform] = syntax;
        },
        setValueForMode(modeId: string, value: unknown) {
          this.valuesByMode[modeId] = value;
        },
        remove() {
          variables.delete(this.id);
        },
      };
      variables.set(variable.id, variable);
      return variable;
    },
    createVariableAlias: (variable: FakeVariable): FakeAlias => ({
      type: 'VARIABLE_ALIAS',
      id: variable.id,
    }),
  };

  /** The file's variables as names and mode names, independent of ids. */
  const snapshot = () => {
    const byId = new Map([...variables.values()].map((v) => [v.id, v]));
    return [...collections.values()].map((c) => ({
      name: c.name,
      modes: c.modes.map((m) => m.name),
      variables: [...variables.values()]
        .filter((v) => v.variableCollectionId === c.id)
        .map((v) => ({
          name: v.name,
          type: v.resolvedType,
          scopes: v.scopes,
          hidden: v.hiddenFromPublishing,
          code: v.codeSyntax.WEB,
          values: Object.fromEntries(
            c.modes.map((m) => {
              const value = v.valuesByMode[m.modeId];
              return [m.name, isFakeAlias(value) ? byId.get(value.id)?.name : value];
            }),
          ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  };

  /** Runs a Plugin API script the way the connector does: top-level await and return. */
  const run = (code: string) =>
    runInNewContext(`(async () => {\n${code}\n})()`, { figma: { variables: api } }) as Promise<
      Record<string, number>
    >;

  return { snapshot, run, collections, variables };
}

describe('sync', () => {
  const whole = `${syncSource()}\nreturn await apuiSyncVariables(${JSON.stringify(payload)});`;

  it('creates every collection, mode and variable', async () => {
    const figma = fakeFigma();
    const summary = await figma.run(whole);
    const total = payload.collections.reduce((n, c) => n + c.variables.length, 0);
    expect(summary.created).toBe(total);
    const state = figma.snapshot();
    expect(state.map((c) => [c.name, c.modes])).toEqual(
      payload.collections.map((c) => [c.name, c.modes]),
    );
    const primary = state[1]!.variables.find((v) => v.name === 'color/primary')!;
    expect(primary.code).toBe('var(--apui-color-primary)');
    expect(primary.values.Dark).toBe('theme/dark/color/primary');
  });

  it('changes nothing when run again', async () => {
    const figma = fakeFigma();
    await figma.run(whole);
    const first = figma.snapshot();
    const summary = await figma.run(whole);
    expect(summary.created).toBe(0);
    expect(summary.removed).toBe(0);
    expect(figma.snapshot()).toEqual(first);
  });

  it('gives the same file in connector chunks, each within the size cap', async () => {
    const chunks = figmaChunks(base, presets);
    for (const chunk of chunks) expect(chunk.code.length).toBeLessThanOrEqual(45000);
    const order = ['declare', 'values', 'prune', 'reference'];
    const steps = chunks.map((c) => order.indexOf(c.step));
    expect(steps).toEqual([...steps].sort((a, b) => a - b));
    expect(chunks.at(-1)!.step).toBe('reference');
    expect(chunks.at(-1)!.code).toContain('return await apuiBuildReferencePage();');

    const whole_ = fakeFigma();
    await whole_.run(whole);
    const chunked = fakeFigma();
    // The Reference page needs the full Plugin API; the fake covers variables only.
    for (const chunk of chunks.filter((c) => c.step !== 'reference')) await chunked.run(chunk.code);
    expect(chunked.snapshot()).toEqual(whole_.snapshot());
  });

  it('removes variables that are no longer tokens and replaces ones whose type changed', async () => {
    const figma = fakeFigma();
    await figma.run(whole);
    const tokens = [...figma.collections.values()].find((c) => c.name === TOKENS_COLLECTION);
    const count = figma.variables.size;
    // A variable left over from an old token, and one whose type has changed.
    const created = [...figma.variables.values()][0]!;
    created.resolvedType = 'STRING';
    figma.variables.set('variable:old', {
      ...created,
      id: 'variable:old',
      name: 'primitive/retired',
      variableCollectionId: tokens!.id,
      remove: () => void figma.variables.delete('variable:old'),
    });

    const summary = await figma.run(whole);
    expect(summary.retyped).toBe(1);
    expect(summary.removed).toBe(1);
    expect(figma.variables.size).toBe(count);
  });

  it('refuses a payload from another version', async () => {
    const figma = fakeFigma();
    await expect(
      figma.run(
        `${syncSource()}\nreturn await apuiSyncVariables({ version: 2, collections: [] });`,
      ),
    ).rejects.toThrow(/Unsupported payload version 2/);
  });
});

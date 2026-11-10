/**
 * Docs examples, kept next to the manifest (#43): `examples/<Name>/examples.json`
 * lists them, and each has one source per stack the component ships in.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ManifestLoadError } from './load';
import type { ComponentManifest, Stack } from './types';
import { STACKS } from './types';

/** The examples shipped with this package. Works from `src/` and from `dist/`. */
export const examplesDir = fileURLToPath(new URL('../examples/', import.meta.url));

/** A component name, as the manifests spell it. */
const COMPONENT_NAME = /^[A-Z][A-Za-z0-9]*$/;

/** An example id: kebab-case, and also its file name. */
const EXAMPLE_ID = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/** The file extension of an example's source in each stack. */
export const EXAMPLE_EXTENSIONS: Readonly<Record<Stack, string>> = {
  livewire: '.blade.php',
  react: '.tsx',
  vue: '.vue',
};

export interface ExampleEntry {
  /** Kebab-case, unique per component; also the file name. */
  id: string;
  title: string;
  description: string;
}

export interface ComponentExample extends ExampleEntry {
  /** Absolute path of the source per stack the component ships in. */
  files: Partial<Record<Stack, string>>;
}

/** Lists a component's examples with their per-stack files. Empty when it has none. */
export function loadExamples(name: string, dir: string = examplesDir): ComponentExample[] {
  if (!COMPONENT_NAME.test(name)) throw new ManifestLoadError(`"${name}" is not a component name`);
  const index = join(dir, name, 'examples.json');
  if (!existsSync(index)) return [];
  const entries: unknown = JSON.parse(readFileSync(index, 'utf8'));
  if (!Array.isArray(entries)) throw new ManifestLoadError(`${index} must be a JSON array`);
  return entries.map((entry: ExampleEntry | null) => {
    if (typeof entry?.id !== 'string' || !EXAMPLE_ID.test(entry.id)) {
      throw new ManifestLoadError(
        `${index}: example id ${JSON.stringify(entry?.id)} must be kebab-case`,
      );
    }
    const files: Partial<Record<Stack, string>> = {};
    for (const stack of STACKS) {
      const file = join(dir, name, `${entry.id}${EXAMPLE_EXTENSIONS[stack]}`);
      if (existsSync(file)) files[stack] = file;
    }
    return { id: entry.id, title: entry.title, description: entry.description, files };
  });
}

/**
 * Problems with a component's examples: a missing source for a stack it ships
 * in, a source for a stack it doesn't (D-003), a malformed index or a file no
 * example lists.
 */
export function checkExamples(manifest: ComponentManifest, dir: string = examplesDir): string[] {
  const problems: string[] = [];
  const folder = join(dir, manifest.name);
  if (!existsSync(folder)) return problems;
  const index = join(folder, 'examples.json');
  if (!existsSync(index)) return [`${manifest.name}: examples.json is missing`];

  let entries: unknown;
  try {
    entries = JSON.parse(readFileSync(index, 'utf8'));
  } catch (error) {
    return [`${manifest.name}: examples.json: ${(error as Error).message}`];
  }
  if (!Array.isArray(entries)) return [`${manifest.name}: examples.json must be an array`];

  const known = new Set<string>(['examples.json']);
  const ids = new Set<string>();
  entries.forEach((entry: Partial<ExampleEntry>, i) => {
    const label = `${manifest.name}: example ${i}`;
    if (typeof entry?.id !== 'string' || !EXAMPLE_ID.test(entry.id)) {
      problems.push(`${label}: id must be kebab-case`);
      return;
    }
    if (ids.has(entry.id)) problems.push(`${label}: "${entry.id}" is listed more than once`);
    ids.add(entry.id);
    for (const key of ['title', 'description'] as const) {
      if (typeof entry[key] !== 'string' || !entry[key]) {
        problems.push(`${label} (${entry.id}): ${key} is required`);
      }
    }
    for (const stack of STACKS) {
      const file = `${entry.id}${EXAMPLE_EXTENSIONS[stack]}`;
      const exists = existsSync(join(folder, file));
      known.add(file);
      if (manifest.stacks[stack] !== false && !exists) {
        problems.push(`${manifest.name}: ${file} is missing (${manifest.name} ships in ${stack})`);
      }
      if (manifest.stacks[stack] === false && exists) {
        problems.push(
          `${manifest.name}: ${file} exists but ${manifest.name} doesn't ship in ${stack} (D-003)`,
        );
      }
    }
  });
  for (const file of readdirSync(folder)) {
    if (!known.has(file)) problems.push(`${manifest.name}: ${file} isn't listed in examples.json`);
  }
  return problems;
}

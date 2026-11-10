/**
 * Typed loader for test harnesses. Reads `components/*.json`, validates every
 * file and maps concept names to each stack's spelling.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ComponentManifest, ManifestEvent, ManifestProp, Stack, StackEntry } from './types';
import { validateManifests } from './validate';

/** The manifests shipped with this package. Works from `src/` and from `dist/`. */
export const componentsDir = fileURLToPath(new URL('../components/', import.meta.url));

/** Thrown when a manifest is missing or invalid. */
export class ManifestLoadError extends Error {
  override name = 'ManifestLoadError';
}

function read(file: string): unknown {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new ManifestLoadError(`${file}: ${(error as Error).message}`);
  }
}

function check(sources: { data: unknown; file: string }[]): void {
  const result = validateManifests(sources);
  if (!result.valid) {
    const lines = result.errors.map((error) => `  - ${error.path}: ${error.message}`);
    throw new ManifestLoadError(`Invalid component manifest:\n${lines.join('\n')}`);
  }
}

/** Loads and validates every manifest in `dir`, sorted by name. */
export function loadManifests(dir: string = componentsDir): ComponentManifest[] {
  const files = readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort();
  const sources = files.map((name) => ({ data: read(join(dir, name)), file: name }));
  check(sources);
  return sources.map((source) => source.data as ComponentManifest);
}

/** Loads and validates one manifest by component name, such as `Button`. */
export function loadManifest(name: string, dir: string = componentsDir): ComponentManifest {
  const file = `${name}.json`;
  if (!readdirSync(dir).includes(file)) {
    throw new ManifestLoadError(`No manifest for "${name}" in ${dir}`);
  }
  const data = read(join(dir, file));
  check([{ data, file }]);
  return data as ComponentManifest;
}

/** Whether the component ships in a stack (D-003). */
export function shipsIn(manifest: ComponentManifest, stack: Stack): boolean {
  return manifest.stacks[stack] !== false;
}

/** The stack entry, or throws when the component doesn't ship there. */
export function stackEntry(manifest: ComponentManifest, stack: Stack): StackEntry {
  const entry = manifest.stacks[stack];
  if (entry === false) throw new ManifestLoadError(`${manifest.name} does not ship in ${stack}`);
  return entry;
}

/**
 * The component's name in a stack: the Blade tag for Livewire
 * (`x-artisanpack-button`), the component name for React and Vue.
 */
export function stackName(manifest: ComponentManifest, stack: Stack): string {
  const { name } = stackEntry(manifest, stack);
  return stack === 'livewire' ? `x-artisanpack-${name}` : name;
}

const camel = (kebab: string) => kebab.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** Concepts whose names differ per stack (vocabulary, Events). */
const SPECIAL_EVENTS: Record<string, Record<Stack, string>> = {
  'value-change': { livewire: 'wire:model', react: 'onValueChange', vue: 'update:modelValue' },
  'open-change': { livewire: 'open-change', react: 'onOpenChange', vue: 'update:open' },
  'checked-change': { livewire: 'wire:model', react: 'onCheckedChange', vue: 'update:checked' },
};

/**
 * An event's name in a stack. Livewire and Vue use the kebab-case concept,
 * React `on` plus PascalCase; value and open changes follow the vocabulary.
 *
 * @example eventName('row-click', 'react') // 'onRowClick'
 */
export function eventName(event: ManifestEvent | string, stack: Stack): string {
  const name = typeof event === 'string' ? event : event.name;
  const special = SPECIAL_EVENTS[name];
  if (special) return special[stack];
  if (stack === 'react') {
    const pascal = camel(name);
    return `on${pascal.charAt(0).toUpperCase()}${pascal.slice(1)}`;
  }
  return name;
}

/** The props that exist in a stack. */
export function propsFor(manifest: ComponentManifest, stack: Stack): ManifestProp[] {
  return manifest.props.filter((prop) => !prop.stacks || prop.stacks.includes(stack));
}

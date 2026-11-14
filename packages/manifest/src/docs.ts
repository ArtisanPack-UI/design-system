/**
 * The props, parts, slots and events tables for a component's docs page
 * (#43), spelled the way one stack writes them. The PHP twin is
 * `php/ManifestDocs.php`; a test keeps the two identical.
 */
import { eventName, propsFor } from './load';
import type { ComponentManifest, ManifestPart, Stack } from './types';
import { kebab } from './validate';

export interface DocsPropRow {
  /** As the stack writes it: `icon-only` in Blade, `iconOnly` in React and Vue. */
  name: string;
  type: string;
  /** `'solid' | 'soft'` for an enum, otherwise the type. */
  typeLabel: string;
  values: string[];
  default: unknown;
  required: boolean;
  description: string;
  a11y: string | null;
  deprecated: string | null;
}

export interface DocsSlotRow {
  name: string;
  description: string;
  scoped: boolean;
  parameters: string[];
}

export interface DocsEventRow {
  /** The concept name, such as `value-change`. */
  concept: string;
  /** As the stack listens for it: `wire:model`, `onValueChange`, `update:modelValue`. */
  name: string;
  description: string;
  payload: string | null;
}

export interface DocsTables {
  stack: Stack;
  props: DocsPropRow[];
  parts: ManifestPart[];
  slots: DocsSlotRow[];
  events: DocsEventRow[];
}

const typeLabel = (type: string, values: string[]): string =>
  type === 'enum' ? values.map((value) => `'${value}'`).join(' | ') : type;

/** The docs tables for one stack. Empty when the component doesn't ship there (D-003). */
export function docsTables(manifest: ComponentManifest, stack: Stack): DocsTables {
  if (manifest.stacks[stack] === false) {
    return { stack, props: [], parts: [], slots: [], events: [] };
  }
  return {
    stack,
    props: propsFor(manifest, stack).map((prop) => ({
      name: stack === 'livewire' ? kebab(prop.name) : prop.name,
      type: prop.type,
      typeLabel: typeLabel(prop.type, prop.values ?? []),
      values: prop.values ?? [],
      default: prop.default ?? null,
      required: prop.required ?? false,
      description: prop.description,
      a11y: prop.a11y ?? null,
      deprecated: prop.deprecated ?? null,
    })),
    parts: manifest.parts.map((part) => ({ ...part })),
    slots: (manifest.slots ?? []).map((slot) => ({
      name: slot.name,
      description: slot.description,
      scoped: slot.scoped ?? false,
      parameters: slot.parameters ?? [],
    })),
    events: (manifest.events ?? []).map((event) => ({
      concept: event.name,
      name: eventName(event, stack, manifest),
      description: event.description,
      payload: event.payload ?? null,
    })),
  };
}

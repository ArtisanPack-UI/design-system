/**
 * Types for a component manifest. They mirror `schema/component.schema.json`.
 *
 * @packageDocumentation
 */

/** The stacks a component can ship in. */
export type Stack = 'livewire' | 'react' | 'vue';

/** Every stack, in output order. */
export const STACKS: readonly Stack[] = ['livewire', 'react', 'vue'];

export type ManifestStatus = 'planned' | 'draft' | 'stable' | 'deprecated';

export type PropType = 'string' | 'boolean' | 'number' | 'enum' | 'object' | 'array' | 'node';

/** How a component ships in one stack. */
export interface StackEntry {
  /** The Blade tag without `x-artisanpack-` (`button`), or the React/Vue component name. */
  name: string;
  capabilities?: string[];
  /** Per-stack capability differences, in prose (D-003). */
  differences?: string[];
}

export interface ManifestProp {
  name: string;
  type: PropType;
  values?: string[];
  default?: unknown;
  required?: boolean;
  description: string;
  /** Why the prop is deprecated and what replaces it. */
  deprecated?: string;
  /** Set only when the prop exists in some stacks. */
  stacks?: Stack[];
  a11y?: string;
}

export interface ManifestPart {
  name: string;
  element?: string;
  description: string;
}

export interface ManifestSlot {
  name: string;
  description: string;
  scoped?: boolean;
  parameters?: string[];
}

export interface ManifestEvent {
  /** The kebab-case concept name, such as `value-change` or `row-click`. */
  name: string;
  description: string;
  payload?: string;
}

export interface ManifestA11y {
  role?: string;
  element?: string;
  keyboard?: { keys: string; action: string }[];
  requirements: string[];
  /** WCAG success criteria, such as `2.5.8`. */
  wcag?: string[];
}

/** One component's API contract. */
export interface ComponentManifest {
  $schema?: string;
  name: string;
  description: string;
  status: ManifestStatus;
  issue?: number;
  rootClass: string;
  stacks: Record<Stack, StackEntry | false>;
  props: ManifestProp[];
  variants?: string[];
  sizes?: string[];
  colors?: string[];
  parts: ManifestPart[];
  slots?: ManifestSlot[];
  events?: ManifestEvent[];
  a11y: ManifestA11y;
  tokens?: string[];
}

/** One validation problem. `path` is a JSON pointer into the manifest, or `''` for the root. */
export interface ManifestError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ManifestError[];
}

/**
 * @artisanpack-ui/manifest
 *
 * The per-component API contract (#26): a JSON Schema, one JSON file per
 * component in `components/`, a validator, a typed loader for test harnesses
 * and a diff for upgrade guides. A PHP loader ships in `php/`.
 *
 * @packageDocumentation
 */

/** The npm package name. */
export const packageName = '@artisanpack-ui/manifest';

export { STACKS } from './types';
export type {
  ComponentManifest,
  ManifestA11y,
  ManifestError,
  ManifestEvent,
  ManifestFixture,
  ManifestPart,
  ManifestProp,
  ManifestSlot,
  ManifestStatus,
  PropType,
  Stack,
  StackEntry,
  ValidationResult,
} from './types';
export {
  COLORS,
  DIFFERING_COMPONENTS,
  kebab,
  schema,
  SIZES,
  STACK_EXCEPTIONS,
  STANDARD_PARTS,
  validateManifest,
  validateManifests,
  WCAG_22_AA,
} from './validate';
export {
  fixtureStates,
  INTERACTIVE_ELEMENTS,
  INTERACTIVE_ROLES,
  isInteractive,
  PSEUDO_STATES,
  STATE_PROPS,
} from './fixture';
export type { ManifestSource } from './validate';
export {
  componentsDir,
  eventName,
  loadManifest,
  loadManifests,
  ManifestLoadError,
  propsFor,
  shipsIn,
  stackEntry,
  stackName,
} from './load';
export { diffManifests, formatChanges } from './diff';
export { docsTables } from './docs';
export type { DocsEventRow, DocsPropRow, DocsSlotRow, DocsTables } from './docs';
export { checkExamples, EXAMPLE_EXTENSIONS, examplesDir, loadExamples } from './examples';
export type { ComponentExample, ExampleEntry } from './examples';
export type { ChangeKind, ManifestChange } from './diff';

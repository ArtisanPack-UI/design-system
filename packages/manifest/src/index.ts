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
} from './validate';
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
export type { ChangeKind, ManifestChange } from './diff';

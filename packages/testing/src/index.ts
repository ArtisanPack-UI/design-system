/**
 * @artisanpack-ui/testing
 *
 * The quality gates every component passes in each stack it ships in (D-003):
 * cross-stack visual regression with an RTL pass (#39), axe and the
 * manifest's accessibility requirements (#40), and API parity against the
 * manifest (#41). The Blade side ships in `php/`.
 *
 * @packageDocumentation
 */

/** The npm package name. */
export const packageName = '@artisanpack-ui/testing';

export type {
  ComponentFixtures,
  Direction,
  FixtureCase,
  FixtureHost,
  FixtureMode,
  FixtureSheet,
} from './types';
export {
  componentFixtures,
  FIXTURE_VERSION,
  fixtureCases,
  fixtureSheets,
  parityTargets,
} from './fixtures';
export { caseAttributes, FIXTURE_ROOT_ID, FIXTURE_WIDTH, fixturePage, HARNESS_CSS } from './page';
export type { PageOptions } from './page';
export { forceStates, openSheet, screenshotSheet } from './capture';
export type { OpenedSheet, OpenSheetOptions, SheetSource } from './capture';
export { AXE_TAGS, runAxe } from './axe';
export type { AxeViolation } from './axe';
export { checkManifestA11y } from './a11y';
export { a11yChecklist } from './checklist';
export { compareImages, DEFAULT_THRESHOLD } from './diff';
export type { DiffOptions, DiffResult } from './diff';
export {
  checkParity,
  DATA_ATTRIBUTE_PROPS,
  declaredProblems,
  normalizeMarkup,
  ParityError,
  parseFragment,
  sampleValue,
  STATE_EVIDENCE,
  stackPropName,
} from './parity';
export type { ParityOptions, ParityRender } from './parity';
export { bundleHost, formatReport, readConfig, RENDER_ARGS, resolveConfig, runGates } from './run';
export type {
  BaselineStatus,
  CrossStackResult,
  GatesConfig,
  GatesReport,
  RunOptions,
  SheetResult,
  StackConfig,
} from './run';

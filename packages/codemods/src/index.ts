/**
 * Codemods and upgrade rules that move ArtisanPack UI apps to the next major.
 *
 * @packageDocumentation
 */
export { classifyClass, findClasses } from './classes';
export type { ClassKind } from './classes';
export { unifiedDiff } from './diff';
export { planAttribute } from './plan';
export type { AttributeValue, Plan, Planned } from './plan';
export { REACT_PACKAGES, transformReact } from './react';
export type { TransformOptions } from './react';
export { camel, hasChanges, kebab, rulesFor, upgradeRules } from './rules';
export { run, transformFile } from './run';
export type { CodemodStack, FileResult, RunOptions, RunResult } from './run';
export type {
  AddedAttribute,
  ClassRules,
  ComponentRule,
  Finding,
  FindingKind,
  MemberRule,
  Stack,
  StackRules,
  TransformResult,
  UpgradeRules,
} from './types';
export { transformVue, transformVueScript, VUE_PACKAGES } from './vue';
export type { VueTransformOptions } from './vue';

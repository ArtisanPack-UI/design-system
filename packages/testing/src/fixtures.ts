/**
 * Fixtures derived from a manifest (#39): every variant × size × state, plus
 * every color × variant, in each theme at the default density, and one RTL
 * pass in the default theme and density (D-004). Stacks the component doesn't
 * ship in are left out (D-003).
 */
import {
  type ComponentManifest,
  fixtureStates,
  PSEUDO_STATES,
  shipsIn,
  STACKS,
} from '@artisanpack-ui/manifest';
import { axes } from '@artisanpack-ui/tokens';

import type { ComponentFixtures, FixtureCase, FixtureSheet } from './types';

/** The fixture file format version. */
export const FIXTURE_VERSION = 1 as const;

const enumDefault = (manifest: ComponentManifest, name: string): unknown =>
  manifest.props.find((prop) => prop.name === name)?.default;

/** The cases of one sheet. The same for every theme, so sheets differ only in mode. */
export function fixtureCases(manifest: ComponentManifest): FixtureCase[] {
  const base = { ...(manifest.fixture?.props ?? {}) };
  const content = manifest.fixture?.content ?? null;
  const variants: (string | undefined)[] = manifest.variants?.length
    ? manifest.variants
    : [undefined];
  const sizes: (string | undefined)[] = manifest.sizes?.length ? manifest.sizes : [undefined];
  const states = ['default', ...fixtureStates(manifest)];
  const cases: FixtureCase[] = [];

  const add = (variant?: string, size?: string, color?: string, state = 'default') => {
    const props: Record<string, unknown> = { ...base };
    const id: string[] = [];
    if (variant !== undefined) {
      props.variant = variant;
      id.push(`variant=${variant}`);
    }
    if (size !== undefined) {
      props.size = size;
      id.push(`size=${size}`);
    }
    if (color !== undefined) {
      props.color = color;
      id.push(`color=${color}`);
    }
    if (!(PSEUDO_STATES as readonly string[]).includes(state) && state !== 'default') {
      props[state] = true;
    }
    id.push(`state=${state}`);
    cases.push({ id: id.join(' '), props, state, content });
  };

  for (const variant of variants) {
    for (const size of sizes) {
      for (const state of states) add(variant, size, undefined, state);
    }
  }
  const defaultColor = enumDefault(manifest, 'color');
  const defaultSize = enumDefault(manifest, 'size') as string | undefined;
  for (const color of manifest.colors ?? []) {
    if (color === defaultColor) continue;
    for (const variant of variants) {
      add(variant, manifest.sizes?.length ? (defaultSize ?? manifest.sizes[0]) : undefined, color);
    }
  }
  return cases;
}

/** The sheets: one per theme at the default density, then the RTL pass. */
export function fixtureSheets(manifest: ComponentManifest): FixtureSheet[] {
  const cases = fixtureCases(manifest);
  const density = axes.density.default;
  const sheets: FixtureSheet[] = axes.theme.modes.map((theme) => ({
    component: manifest.name,
    id: theme,
    theme,
    density,
    dir: 'ltr',
    cases,
  }));
  sheets.push({
    component: manifest.name,
    id: 'rtl',
    theme: axes.theme.default,
    density,
    dir: 'rtl',
    cases,
  });
  return sheets;
}

/**
 * Manifests a stack's parity tests should cover: those that ship in the stack
 * (D-003) and are past `planned`, so a component is checked from its first
 * draft and never silently skipped after that.
 */
export function parityTargets(
  manifests: ComponentManifest[],
  stack: (typeof STACKS)[number],
): ComponentManifest[] {
  return manifests.filter((manifest) => shipsIn(manifest, stack) && manifest.status !== 'planned');
}

/** A component's fixture file. */
export function componentFixtures(manifest: ComponentManifest): ComponentFixtures {
  return {
    version: FIXTURE_VERSION,
    component: manifest.name,
    rootClass: manifest.rootClass,
    stacks: STACKS.filter((stack) => shipsIn(manifest, stack)),
    names: Object.fromEntries(
      STACKS.flatMap((stack) => {
        const entry = manifest.stacks[stack];
        return entry ? [[stack, entry.name]] : [];
      }),
    ),
    cases: fixtureCases(manifest),
    sheets: fixtureSheets(manifest).map(({ id, theme, density, dir }) => ({
      id,
      theme,
      density,
      dir,
    })),
  };
}

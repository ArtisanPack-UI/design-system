import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadManifest, loadManifests } from '@artisanpack-ui/manifest';

import { buildFixtures } from '../scripts/build-fixtures.mjs';
import { componentFixtures, fixtureCases, fixtureSheets, parityTargets } from '../src/fixtures';
import { probe } from './helpers';

describe('fixtureCases', () => {
  it('renders every variant × size × state, then every other color × variant', () => {
    const cases = fixtureCases(probe());
    // 2 variants × 2 sizes × (default + hover, focus-visible, active, disabled, loading),
    // then the one non-default color × 2 variants.
    expect(cases).toHaveLength(2 * 2 * 6 + 2);
    expect(new Set(cases.map((c) => c.id)).size).toBe(cases.length);
    expect(cases[0]).toEqual({
      id: 'variant=solid size=sm state=default',
      props: { variant: 'solid', size: 'sm' },
      state: 'default',
      content: 'Probe',
    });
    expect(cases.find((c) => c.id === 'variant=outline size=md state=loading')!.props).toEqual({
      variant: 'outline',
      size: 'md',
      loading: true,
    });
    expect(cases.find((c) => c.state === 'hover')!.props).not.toHaveProperty('hover');
    expect(cases.at(-1)).toMatchObject({
      id: 'variant=outline size=md color=error state=default',
      props: { variant: 'outline', size: 'md', color: 'error' },
    });
  });

  it('merges fixture.props into every case', () => {
    const m = probe();
    m.fixture = { ...m.fixture, props: { leadingIcon: 'star' } };
    expect(fixtureCases(m).every((c) => c.props.leadingIcon === 'star')).toBe(true);
  });

  it('copes with a component without variants, sizes or colors', () => {
    const m = probe();
    delete m.variants;
    delete m.sizes;
    delete m.colors;
    expect(fixtureCases(m).map((c) => c.id)).toEqual([
      'state=default',
      'state=hover',
      'state=focus-visible',
      'state=active',
      'state=disabled',
      'state=loading',
    ]);
  });

  it('renders every other surface once, at the default variant and size (D-006)', () => {
    const m = probe();
    m.props.push({
      name: 'surface',
      type: 'enum',
      values: ['default', 'raised', 'glass'],
      default: 'default',
      description: 'Surface.',
    });
    const surfaces = fixtureCases(m).filter((c) => c.props.surface !== undefined);
    expect(surfaces.map((c) => c.id)).toEqual([
      'variant=solid size=md surface=raised state=default',
      'variant=solid size=md surface=glass state=default',
    ]);
  });
});

describe('fixtureSheets', () => {
  it('has one sheet per theme at the default density, plus one RTL pass (D-004)', () => {
    const sheets = fixtureSheets(probe());
    expect(sheets.map(({ id, theme, density, dir }) => [id, theme, density, dir])).toEqual([
      ['light', 'light', 'default', 'ltr'],
      ['dark', 'dark', 'default', 'ltr'],
      ['high-contrast', 'high-contrast', 'default', 'ltr'],
      ['rtl', 'light', 'default', 'rtl'],
    ]);
    expect(new Set(sheets.map((s) => s.cases))).toHaveProperty('size', 1);
  });
});

describe('componentFixtures', () => {
  it('lists only the stacks the component ships in (D-003)', () => {
    const m = probe();
    expect(componentFixtures(m).stacks).toEqual(['livewire', 'react', 'vue']);
    m.stacks.react = false;
    m.stacks.vue = false;
    const fixtures = componentFixtures(m);
    expect(fixtures.stacks).toEqual(['livewire']);
    expect(fixtures.names).toEqual({ livewire: 'probe' });
  });

  it('keeps generated/fixtures current for every manifest', () => {
    const files = buildFixtures();
    expect(Object.keys(files)).toEqual(loadManifests().map((m) => `${m.name}.json`));
    for (const [name, contents] of Object.entries(files)) {
      expect(readFileSync(join(__dirname, '..', 'generated', 'fixtures', name), 'utf8')).toBe(
        contents,
      );
    }
  });
});

describe('parityTargets', () => {
  it('skips planned components and stacks a component does not ship in', () => {
    const draft = probe();
    const planned = { ...loadManifest('Button'), name: 'Planned', status: 'planned' as const };
    const reactLess = {
      ...probe(),
      name: 'Other',
      stacks: { ...probe().stacks, react: false as const },
    };
    expect(parityTargets([draft, planned, reactLess], 'react').map((m) => m.name)).toEqual([
      'Probe',
    ]);
    expect(parityTargets([draft, planned, reactLess], 'vue').map((m) => m.name)).toEqual([
      'Probe',
      'Other',
    ]);
  });
});

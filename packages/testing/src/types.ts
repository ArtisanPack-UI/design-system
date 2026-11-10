/**
 * The fixture format the gates share across stacks (#39). Type-only, so the
 * browser hosts can import it without pulling in Node code.
 */

export type Direction = 'ltr' | 'rtl';

/** One rendering of the component: a prop combination in one state. */
export interface FixtureCase {
  /** Stable and unique within the sheet, such as `variant=solid size=md state=hover`. */
  id: string;
  /** Props by manifest name, including a state prop set to `true`. */
  props: Record<string, unknown>;
  /** `default`, a pseudo-state (`hover`, `focus-visible`, `active`) or a state prop. */
  state: string;
  /** Default slot text, or null for none. */
  content: string | null;
}

/** Every case of a component in one theme, density and direction: one screenshot. */
export interface FixtureSheet {
  component: string;
  /** The theme name, or `rtl` for the RTL pass (D-004). */
  id: string;
  theme: string;
  density: string;
  dir: Direction;
  cases: FixtureCase[];
}

/** A sheet's mode, without its cases. */
export type FixtureMode = Pick<FixtureSheet, 'id' | 'theme' | 'density' | 'dir'>;

/**
 * A component's fixtures, as written to `generated/fixtures/<Name>.json`.
 * Every sheet renders the same cases, so they're stored once.
 */
export interface ComponentFixtures {
  version: 1;
  component: string;
  rootClass: string;
  /** The stacks to render it in (D-003). */
  stacks: ('livewire' | 'react' | 'vue')[];
  /** The component's name per stack: the Blade tag without `x-artisanpack-`, or the React/Vue name. */
  names: Partial<Record<'livewire' | 'react' | 'vue', string>>;
  cases: FixtureCase[];
  sheets: FixtureMode[];
}

/** What a fixture page exposes for the runner: hosts set `window.apuiFixture`. */
export interface FixtureHost {
  /** Renders a sheet's cases into `#apui-fixture`, using the stack's component name. */
  render(sheet: FixtureSheet, component: string): void | Promise<void>;
}

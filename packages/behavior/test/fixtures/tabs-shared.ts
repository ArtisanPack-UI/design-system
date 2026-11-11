/** What the Tabs fixtures (React, Vue) share with the Alpine tests: ids, tabs and the test API. */
import type { TabsActivationMode } from '../../src/widgets/tabs';

export interface TabsFixture {
  /** `controlled`: the parent owns the value. `uncontrolled`: `defaultValue`. */
  mode: 'controlled' | 'uncontrolled';
  initial?: string;
  activationMode?: TabsActivationMode;
  /** The tabs start empty and arrive on `load()`, as tabs fetched after mount do. */
  late?: boolean;
}

/** [value, label, disabled] */
export const TABS: [string, string, boolean][] = [
  ['overview', 'Overview', false],
  ['history', 'History', false],
  ['archived', 'Archived', true],
  ['settings', 'Settings', false],
];

export const TABS_IDS = {
  root: 'tabs-root',
  list: 'list',
  trigger: (value: string) => `trigger-${value}`,
  content: (value: string) => `content-${value}`,
};

export interface TabsFixtureApi {
  mount(options: TabsFixture): void;
  /** Sets the parent's value, as a parent re-rendering with a new prop does. */
  set(value: string): void;
  /** Renders the tabs of a `late` fixture. */
  load(): void;
  /** The shown value. */
  value?: string | null;
  events: [string, unknown][];
}

export function installTabs(api: Pick<TabsFixtureApi, 'mount' | 'set' | 'load'>): TabsFixtureApi {
  const fixture: TabsFixtureApi = { ...api, events: [] };
  (window as unknown as { tabsFixture: TabsFixtureApi }).tabsFixture = fixture;
  return fixture;
}

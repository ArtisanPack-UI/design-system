/**
 * What the React and Vue Spotlight fixtures share: the groups, the part ids
 * and the API the tests drive them through (`window.spotlight`).
 */
import type { SpotlightGroup } from '../../src/widgets/spotlight';

export interface SpotlightFixture {
  /** `uncontrolled` (defaultOpen), or `controlled` (the parent follows every change). */
  mode: 'uncontrolled' | 'controlled';
  /** The parent owns the query (`search` + `onSearchChange`). */
  controlledSearch?: boolean;
  remote?: boolean;
  loading?: boolean;
  shortcut?: string;
}

export const SPOTLIGHT_GROUPS: SpotlightGroup[] = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { value: 'growth', label: 'Growth', description: 'Analytics', href: '#growth' },
      { value: 'groups', label: 'Groups', keywords: ['team'] },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { value: 'add', label: 'Add property', shortcut: '⌘ N' },
      { value: 'import', label: 'Import listings' },
    ],
  },
];

export const SPOTLIGHT_IDS = {
  trigger: 's-trigger',
  content: 's-content',
  query: 's-query',
  results: 's-results',
  closeTrigger: 's-close',
};

export interface SpotlightWindow {
  mount(options: SpotlightFixture): void;
  unmount(): void;
  set(key: 'open' | 'search', value: unknown): void;
  get(key: 'open' | 'search'): unknown;
  events: [string, unknown][];
}

export function install(api: Omit<SpotlightWindow, 'events'>): SpotlightWindow {
  const fixture = { ...api, events: [] as [string, unknown][] };
  (window as unknown as { spotlight: SpotlightWindow }).spotlight = fixture;
  return fixture;
}

/**
 * What the React and Vue fixtures share: the markup's ids (the same ones the
 * Alpine tests render), the items, and the API the tests drive them through.
 */
import type { ComboboxValue } from '../../src/core/options';
import type { ComboboxItem } from '../../src/widgets/combobox';

/**
 * - `uncontrolled`: `defaultOpen` / `defaultValue`; the widget owns the state.
 * - `controlled`: the parent owns it and follows every change.
 * - `locked`: the parent owns it and ignores changes, so the widget can't move.
 */
export type Mode = 'uncontrolled' | 'controlled' | 'locked';

export interface DialogFixture {
  mode: Mode;
  initial?: boolean;
  id?: string;
}

export interface ComboboxFixture {
  mode: Mode;
  initial?: ComboboxValue;
  multiple?: boolean;
  remote?: boolean;
  items?: [string, string][];
  id?: string;
}

/** The global the tests call: `window.fixture`. */
export interface FixtureApi {
  dialog(options: DialogFixture): void;
  combobox(options: ComboboxFixture): void;
  unmount(): void;
  /** Sets the parent's state, as a parent component re-rendering with new props does. */
  set(key: 'open' | 'value' | 'items', value: unknown): void;
  /** The parent's state (controlled) or the widget's (uncontrolled). */
  get(key: 'open' | 'value'): unknown;
  /** Every callback the widget fired, in order. */
  events: [string, unknown][];
}

/** The parts' ids, as the Alpine tests' markup authors them. */
export const DIALOG_IDS = {
  trigger: 'trigger',
  backdrop: 'backdrop',
  positioner: 'positioner',
  content: 'content',
  closeTrigger: 'close',
};

export const COMBOBOX_IDS = {
  label: 'cb-label',
  input: 'cb-input',
  trigger: 'cb-toggle',
  content: 'cb-list',
};

export const COUNTRIES: [string, string][] = [
  ['fr', 'France'],
  ['de', 'Germany'],
  ['gh', 'Ghana'],
  ['is', 'Iceland'],
  ['ci', "Côte d'Ivoire"],
];

export const toItems = (pairs: [string, string][]): ComboboxItem[] =>
  pairs.map(([value, label]) => ({ value, label }));

export function install(api: Omit<FixtureApi, 'events'>): FixtureApi {
  const fixture: FixtureApi = { ...api, events: [] };
  (window as unknown as { fixture: FixtureApi }).fixture = fixture;
  return fixture;
}

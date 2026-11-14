/**
 * What the React and Vue date picker fixtures share: the ids the Alpine
 * tests use, the mount options and the `window.dateFixture` installer.
 */
import type { DatePickerOptions, DatePickerValue } from '../../src/react';

/** The part ids, the same as the Alpine markup's. */
export const DATE_PICKER_IDS = {
  root: 'dp',
  control: 'dp-control',
  trigger: 'dp-trigger',
  content: 'dp-content',
  positioner: 'dp-positioner',
  label: () => 'dp-label',
  input: (index: number) => (index ? `dp-input-${index}` : 'dp-input'),
  prevTrigger: () => 'dp-prev',
  nextTrigger: () => 'dp-next',
  table: () => 'dp-table',
};

export interface DatePickerFixture {
  /** `controlled` (the default) passes value; `uncontrolled` passes defaultValue. */
  mode?: 'controlled' | 'uncontrolled';
  initial?: DatePickerValue;
  picker?: Partial<DatePickerOptions>;
}

export interface DateFixtureApi {
  mount(options: DatePickerFixture): void;
  set(value: DatePickerValue): void | Promise<void>;
  get(): DatePickerValue | undefined;
  events: [string, unknown][];
}

/** Installs the fixture on `window.dateFixture`. */
export function installDatePicker(api: Omit<DateFixtureApi, 'events'>): DateFixtureApi {
  const fixture: DateFixtureApi = { ...api, events: [] };
  (window as unknown as { dateFixture: DateFixtureApi }).dateFixture = fixture;
  return fixture;
}

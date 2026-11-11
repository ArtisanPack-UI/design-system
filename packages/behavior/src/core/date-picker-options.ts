/**
 * DatePicker options for the React and Vue adapters (#55), and how they
 * become machine props. Kept beside `options.ts` (same role, one widget) so
 * both stacks map them in one place and can't drift. The Alpine component
 * builds the same props through `toDatePickerProps` too.
 */
import { direction } from './options';
import { type Direction, type PositionOptions, zagPositioning } from '../positioning';
import {
  datePattern,
  type DatePickerMode,
  type DatePickerProps,
  type DatePickerValue,
  type DateValue,
  formatDate,
  fromIsoValue,
  parseDate,
  parseIso,
  patternPlaceholder,
  toIsoValue,
} from '../widgets/date-picker';

/** The accessible names the machine writes. Every stack passes them translated. */
export interface DatePickerLabels {
  /** The calendar button. Default `Choose date`. */
  trigger?: string;
  /** The previous-month button. Default `Previous month`. */
  previous?: string;
  /** The next-month button. Default `Next month`. */
  next?: string;
  /** The popover. Default `Calendar`. */
  calendar?: string;
}

export interface DatePickerOptions {
  /** Controlled value: an ISO string (or null), or an array of two in range mode. Pair it with `onValueChange`. */
  value?: DatePickerValue;
  /** Initial value when uncontrolled. */
  defaultValue?: DatePickerValue;
  /** Called when a choice (a day, a time, typed text) changes the value. */
  onValueChange?: (details: { value: DatePickerValue }) => void;
  /** Controlled open state of the popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /** One date, or a range of two. Default `single`. */
  mode?: DatePickerMode;
  /** Date and time: adds the time list, and values carry `THH:mm`. */
  time?: boolean;
  /** BCP 47 locale for month and weekday names, the first day of the week and the default pattern. Default `en-US`. */
  locale?: string;
  /** IANA time zone, for today's date. Default UTC, as the machine. */
  timeZone?: string;
  /** Earliest choosable date, ISO. */
  min?: string;
  /** Latest choosable date, ISO. */
  max?: string;
  /** Dates that can't be chosen, ISO. */
  disabledDates?: string[];
  /** First day of the week, 0 (Sunday) to 6. Follows the locale unless set. */
  weekStartsOn?: number;
  /** The text pattern, with `yyyy`, `MM` and `dd`, such as `dd.MM.yyyy`. Follows the locale unless set. */
  format?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Placeholder for the text. Defaults to the pattern, `MM/DD/YYYY`. */
  placeholder?: string;
  labels?: DatePickerLabels;
  /** Where the popover opens. Default `bottom-start`. */
  positioning?: PositionOptions;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: DatePickerProps['ids'];
  dir?: Direction;
}

/** The pattern the field's text uses: `format`, else the locale's. */
export function resolvePattern(options: Pick<DatePickerOptions, 'format' | 'locale'>): string {
  return options.format &&
    /yyyy/.test(options.format) &&
    /MM/.test(options.format) &&
    /dd/.test(options.format)
    ? options.format
    : datePattern(options.locale);
}

/**
 * The machine's props for `options`. `dir` is the text direction the
 * caller resolved (Alpine reads the element's; React and Vue read `<html>`).
 */
export function toDatePickerProps(
  options: DatePickerOptions,
  id: string,
  dir: Direction = direction(options),
): Partial<DatePickerProps> {
  const mode = options.mode ?? 'single';
  const time = Boolean(options.time) && mode === 'single';
  const pattern = resolvePattern(options);
  const unavailable = new Set(options.disabledDates ?? []);
  const labels = options.labels ?? {};
  return {
    id,
    ids: options.ids,
    dir,
    locale: options.locale ?? 'en-US',
    timeZone: options.timeZone,
    selectionMode: mode,
    startOfWeek: options.weekStartsOn,
    min: parseIso(options.min),
    max: parseIso(options.max),
    isDateUnavailable: unavailable.size
      ? (date: DateValue) => unavailable.has(toIsoDay(date))
      : undefined,
    disabled: options.disabled,
    readOnly: options.readOnly,
    required: options.required,
    invalid: options.invalid,
    placeholder: options.placeholder ?? patternPlaceholder(pattern, time),
    // Day view only: the header names the month, PageUp and PageDown move it.
    minView: 'day',
    maxView: 'day',
    // Picking a day finishes a single date; in time mode the time does.
    closeOnSelect: !time,
    format: (date: DateValue) => formatDate(date, pattern, time),
    parse: (text: string) => parseDate(text, pattern, time),
    translations: {
      trigger: () => labels.trigger ?? 'Choose date',
      prevTrigger: () => labels.previous ?? 'Previous month',
      nextTrigger: () => labels.next ?? 'Next month',
      content: labels.calendar ?? 'Calendar',
      // The grid cell carries the state (aria-selected, aria-disabled,
      // aria-current), so the name is just the localized date: no English.
      dayCell: (state) => state.valueText,
    },
    value: options.value === undefined ? undefined : fromIsoValue(options.value),
    defaultValue:
      options.defaultValue === undefined ? undefined : fromIsoValue(options.defaultValue),
    open: options.open,
    defaultOpen: options.defaultOpen,
    positioning: zagPositioning(null, { placement: 'bottom-start', ...options.positioning, dir }),
    onValueChange: ({ value }) => options.onValueChange?.({ value: toIsoValue(value, mode, time) }),
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
  };
}

/** `YYYY-MM-DD` of a date value. */
function toIsoDay(date: DateValue): string {
  return toIsoValue([date], 'single', false) as string;
}

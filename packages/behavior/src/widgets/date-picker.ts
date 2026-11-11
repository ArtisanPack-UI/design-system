/**
 * DatePicker (#55) on Zag's date-picker machine: a typed text field plus a
 * calendar popover with a `role=grid` month (arrow keys follow the text
 * direction, PageUp and PageDown change month), single dates or a range, and
 * an optional time list (DateTime is DatePicker's `time` mode).
 *
 * Values cross every stack boundary as ISO strings: `2026-11-12`, or
 * `2026-11-12T11:00` in time mode, and an array of two in range mode. The
 * text in the field follows a numeric pattern (`MM/dd/yyyy`, from the locale
 * unless `format` sets one), so typing a date always works.
 *
 * The time list is not a Zag part: `getTimeListProps()` and
 * `getTimeOptionProps()` add a listbox (`role=listbox` of `role=option`,
 * roving focus, Arrow keys, Home, End, Enter and Space) on top of the
 * machine's `setTime()`.
 */
import { CalendarDate, CalendarDateTime, toCalendarDate } from '@internationalized/date';
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/date-picker';
import type { PropTypes } from '@zag-js/types';

import type { Attrs } from '../core/props';
import { repart } from './combobox';
import type { Normalize, WidgetDefinition } from '../core/widget';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type DatePickerProps = zag.Props;
export type DateValue = zag.DateValue;

/** One date, or a range of two. */
export type DatePickerMode = 'single' | 'range';

/** A value as the stacks see it: an ISO string (or null), or an array of them in range mode. */
export type DatePickerValue = string | string[] | null;

/** One entry of the time list. */
export interface TimeOption {
  /** `HH:mm`, 24-hour. */
  value: string;
  /** What the option shows. */
  label: string;
}

/** Zag's API plus the time list's parts. */
export type DatePickerApi<T extends PropTypes = PropTypes> = zag.Api<T> & {
  /** The time list (`role=listbox`). `label` is its accessible name. */
  getTimeListProps(props?: { label?: string; id?: string }): T['element'];
  /** One time (`role=option`). `step` is the list's, so the right option is tabbable. */
  getTimeOptionProps(props: { value: string; step?: number; id?: string }): T['element'];
};

// ---------------------------------------------------------------------------
// ISO values

const ISO = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

/** An ISO date (`2026-11-12`) or date-time (`2026-11-12T11:00`) as a date value, or undefined. */
export function parseIso(value: unknown): DateValue | undefined {
  if (typeof value !== 'string') return undefined;
  const match = ISO.exec(value.trim());
  if (!match) return undefined;
  const [, y, m, d, hh, mm] = match;
  const date = new CalendarDate(Number(y), Number(m), Number(d));
  // Reject dates that roll over (2026-02-30), which CalendarDate constrains.
  if (date.month !== Number(m) || date.day !== Number(d)) return undefined;
  if (hh === undefined) return date;
  const hour = Number(hh);
  const minute = Number(mm);
  if (hour > 23 || minute > 59) return undefined;
  return new CalendarDateTime(date.year, date.month, date.day, hour, minute);
}

/** A date value as ISO: `2026-11-12`, or `2026-11-12T11:00` with `time` (midnight when it has none). */
export function toIso(value: DateValue, time = false): string {
  const date = `${pad(value.year, 4)}-${pad(value.month)}-${pad(value.day)}`;
  if (!time) return date;
  const hour = 'hour' in value ? value.hour : 0;
  const minute = 'minute' in value ? value.minute : 0;
  return `${date}T${pad(hour)}:${pad(minute)}`;
}

/** A stack's value as the machine's array of dates. */
export function fromIsoValue(value: DatePickerValue | undefined): DateValue[] {
  const list = Array.isArray(value) ? value : value == null || value === '' ? [] : [value];
  return list.map(parseIso).filter((date): date is DateValue => date !== undefined);
}

/** The machine's dates as a stack's value: a string or null, or an array in range mode. */
export function toIsoValue(
  value: DateValue[],
  mode: DatePickerMode = 'single',
  time = false,
): DatePickerValue {
  const list = value.filter(Boolean).map((date) => toIso(date, time));
  return mode === 'range' ? list : (list[0] ?? null);
}

/** Whether two stack values are the same. */
export function sameIsoValue(a: DatePickerValue | undefined, b: DatePickerValue | undefined) {
  const norm = (v: DatePickerValue | undefined) =>
    Array.isArray(v) ? v.join('|') : v == null ? '' : String(v);
  return norm(a) === norm(b);
}

// ---------------------------------------------------------------------------
// The text in the field

/**
 * The numeric pattern a locale writes dates in, with `yyyy`, `MM` and `dd`
 * tokens: `MM/dd/yyyy` for `en-US`, `dd.MM.yyyy` for `de`. Digits are always
 * Latin, so typing works on every keyboard.
 */
export function datePattern(locale = 'en-US'): string {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat(`${locale}-u-nu-latn`, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(2026, 10, 12));
  } catch {
    return 'yyyy-MM-dd';
  }
  const tokens: Record<string, string> = { year: 'yyyy', month: 'MM', day: 'dd' };
  return parts.map((part) => tokens[part.type] ?? part.value.replace(/[‎‏؜]/g, '')).join('');
}

/** A date value as text in `pattern`, with ` HH:mm` after it in time mode. */
export function formatDate(value: DateValue, pattern: string, time = false): string {
  const text = pattern
    .replace('yyyy', pad(value.year, 4))
    .replace('MM', pad(value.month))
    .replace('dd', pad(value.day));
  if (!time) return text;
  const hour = 'hour' in value ? value.hour : 0;
  const minute = 'minute' in value ? value.minute : 0;
  return `${text} ${pad(hour)}:${pad(minute)}`;
}

/**
 * Text typed in `pattern` as a date value, or undefined when it isn't a
 * whole, real date. In time mode a trailing `HH:mm` sets the time.
 */
export function parseDate(text: string, pattern: string, time = false): DateValue | undefined {
  let source = text.trim();
  let hour: number | undefined;
  let minute: number | undefined;
  if (time) {
    const clock = /\s*(\d{1,2}):(\d{2})$/.exec(source);
    if (clock) {
      hour = Number(clock[1]);
      minute = Number(clock[2]);
      source = source.slice(0, clock.index).trim();
    }
  }
  const order: string[] = [];
  const escaped = pattern.replace(/yyyy|MM|dd|[.*+?^${}()|[\]\\]/g, (token) => {
    if (token === 'yyyy') {
      order.push('y');
      return '(\\d{4})';
    }
    if (token === 'MM' || token === 'dd') {
      order.push(token[0]!);
      return '(\\d{1,2})';
    }
    return `\\${token}`;
  });
  const match = new RegExp(`^${escaped}$`).exec(source);
  if (!match) return undefined;
  const field = (key: string) => Number(match[order.indexOf(key) + 1]);
  const iso = `${pad(field('y'), 4)}-${pad(field('M'))}-${pad(field('d'))}`;
  const withTime = hour === undefined ? iso : `${iso}T${pad(hour)}:${pad(minute ?? 0)}`;
  return parseIso(withTime);
}

/** The placeholder for `pattern`: its tokens in capitals, `MM/DD/YYYY` (plus ` HH:MM` in time mode). */
export function patternPlaceholder(pattern: string, time = false): string {
  const date = pattern.toUpperCase();
  return time ? `${date} HH:MM` : date;
}

/** The times a time list offers: every `step` minutes from 00:00. */
export function timeOptions(step = 30): TimeOption[] {
  const every = Number.isFinite(step) && step >= 1 && step <= 720 ? Math.floor(step) : 30;
  const options: TimeOption[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += every) {
    const value = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
    options.push({ value, label: value });
  }
  return options;
}

/** A weekday heading, as the stacks render it. */
export interface WeekdayLabel {
  /** Short name, shown: `Mon`. */
  short: string;
  /** Full name: `Monday`. */
  long: string;
}

// ---------------------------------------------------------------------------
// The definition

/**
 * Zag's names for the field's parts against the vocabulary's (D-018): Zag's
 * `control` wrapper is the `box`, its `input` the `control`. The machine
 * finds its inputs by `[data-part=input]` inside the box, so the definition's
 * machine rewrites the actions and effect that look for them (below).
 */
export const DATE_PICKER_PARTS: Readonly<Record<string, string>> = {
  control: 'box',
  input: 'control',
};

/** Letters never belong in the numeric text, whatever the pattern. */
const LETTER = /\p{L}/u;

/** What the machine passes to its actions and effects, as far as the overrides below read it. */
interface Params {
  scope: { getById(id: string): HTMLElement | null; getActiveElement(): Element | null };
  prop(key: string): unknown;
  context: { get(key: string): unknown; set(key: string, value: unknown): void };
  computed(key: string): unknown;
  event: { type?: string; index?: number; focus?: boolean };
}

type Implementation = (params: Params) => unknown;

/** A part's element, by the author's id or the machine's default one. */
function partEl(params: Params, key: 'control' | 'content' | 'trigger', fallback: string) {
  const ids = (params.prop('ids') ?? {}) as Record<string, unknown>;
  const id =
    typeof ids[key] === 'string'
      ? (ids[key] as string)
      : `datepicker:${String(params.prop('id'))}:${fallback}`;
  return params.scope.getById(id);
}

/** The text inputs, which carry the field anatomy's `control` part inside the box. */
function inputEls(params: Params): HTMLInputElement[] {
  const box = partEl(params, 'control', 'control');
  return Array.from(
    box?.querySelectorAll<HTMLInputElement>('[data-scope="date-picker"][data-part="control"]') ??
      [],
  );
}

const nextFrame = (fn: () => void) =>
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : setTimeout(fn, 0);

const writeValue = (el: HTMLInputElement | undefined, value: string) => {
  if (el && el.value !== value) el.value = value;
};

/** Focuses the last input with a value (the end of a range being edited), or the first. */
function focusInput(params: Params) {
  const inputs = inputEls(params);
  const filled = inputs.map((el) => el.value !== '').lastIndexOf(true);
  const input = inputs[Math.max(filled, 0)];
  if (!input) {
    partEl(params, 'trigger', 'trigger')?.focus({ preventScroll: true });
    return;
  }
  input.focus({ preventScroll: true });
  input.setSelectionRange(input.value.length, input.value.length);
}

const base = zag.machine as unknown as {
  implementations: {
    actions: Record<string, Implementation>;
    effects: Record<string, Implementation>;
  };
};

/**
 * Zag's machine, with the actions and effect that look for its inputs as
 * `[data-part=input]` rewritten for the renamed parts (DATE_PICKER_PARTS),
 * so every stack gets the machine's own behavior: the inputs' text follows
 * the value, picking a day returns focus to the input (APG date picker
 * dialog), and pressing or focusing an input never counts as outside the
 * open calendar.
 */
const machine = {
  ...base,
  implementations: {
    ...base.implementations,
    actions: {
      ...base.implementations.actions,
      syncInputElement(params: Params) {
        nextFrame(() => {
          const text = (params.computed('valueAsString') ?? []) as string[];
          inputEls(params).forEach((el, index) => writeValue(el, text[index] ?? ''));
        });
      },
      syncInputValue(params: Params) {
        queueMicrotask(() => {
          const index = params.event.index ?? (params.context.get('activeIndex') as number);
          writeValue(inputEls(params)[index], String(params.context.get('inputValue') ?? ''));
        });
      },
      focusFirstInputElement(params: Params) {
        if (params.event.focus === false) return;
        nextFrame(() => {
          const target = inputEls(params)[0] ?? partEl(params, 'trigger', 'trigger');
          target?.focus({ preventScroll: true });
        });
      },
      focusInputElement(params: Params) {
        nextFrame(() => focusInput(params));
      },
      // With `open` controlled (Alpine always, React and Vue when bound), the
      // machine only restores focus on close when this flag is set, which
      // it does for a range's end date but not a single date or Escape.
      invokeOnClose(params: Params) {
        if (params.event.type !== 'INTERACT_OUTSIDE') params.context.set('restoreFocus', true);
        return base.implementations.actions.invokeOnClose!(params);
      },
      restoreFocusToInput(params: Params) {
        const content = partEl(params, 'content', 'content');
        nextFrame(() => {
          const active = params.scope.getActiveElement();
          // Only when focus is still in the calendar (or dropped to the body as
          // it closed): a click elsewhere keeps its focus.
          const outside = active && active !== active.ownerDocument.body;
          if (outside && content && !content.contains(active)) return;
          focusInput(params);
        });
      },
    },
    effects: {
      ...base.implementations.effects,
      trackDismissableElement(params: Params) {
        const stop = base.implementations.effects.trackDismissableElement!(params) as
          (() => void) | undefined;
        const content = partEl(params, 'content', 'content');
        // The dismissable layer fires these on the panel and closes unless one
        // is cancelled; the inputs are part of the widget, not outside it.
        const keepOpen = (event: Event) => {
          const target = (event as CustomEvent<{ target?: Node }>).detail?.target;
          const box = partEl(params, 'control', 'control');
          if (target && box?.contains(target)) event.preventDefault();
        };
        content?.addEventListener('pointerdown.outside', keepOpen);
        content?.addEventListener('focus.outside', keepOpen);
        return () => {
          content?.removeEventListener('pointerdown.outside', keepOpen);
          content?.removeEventListener('focus.outside', keepOpen);
          stop?.();
        };
      },
    },
  },
};

export const datePicker: WidgetDefinition<Schema, DatePickerApi> = {
  scope: 'date-picker',
  machine: machine as unknown as Machine<Schema>,
  connect: (service, normalize) => {
    const api = zag.connect(service as never, repart(normalize, DATE_PICKER_PARTS)) as zag.Api;
    const n = normalize as Normalize;

    /** The selected time as `HH:mm`, when the value has one. */
    const selectedTime = () => {
      const first = api.value[0];
      return first && 'hour' in first ? `${pad(first.hour)}:${pad(first.minute)}` : undefined;
    };

    /**
     * Sets the time on the selected date (or the focused one when nothing is
     * selected yet) and closes the popover: a time is the last choice.
     */
    const chooseTime = (time: string) => {
      const [hour = 0, minute = 0] = time.split(':').map(Number);
      const base = api.value[0] ?? api.focusedValue;
      api.setValue([new CalendarDateTime(base.year, base.month, base.day, hour, minute)]);
      api.setOpen(false);
    };

    return {
      ...api,

      // In time mode the month's days inherit the value's time; cells are days,
      // so their value, data-value and id stay dates in every stack.
      getDayTableCellProps(props) {
        return api.getDayTableCellProps({ ...props, value: toCalendarDate(props.value) });
      },
      getDayTableCellTriggerProps(props) {
        return api.getDayTableCellTriggerProps({ ...props, value: toCalendarDate(props.value) });
      },

      // The machine accepts only digits and the locale's separator. The
      // pattern can use another separator, and time mode adds a clock, so
      // only letters are refused; parsing decides the rest.
      getInputProps(props = {}) {
        const index = props.index ?? 0;
        const base = api.getInputProps(props) as Record<string, unknown>;
        return n.input({
          ...base,
          onBeforeInput(event: InputEvent) {
            if (event.data && event.data.length === 1 && LETTER.test(event.data)) {
              event.preventDefault();
            }
          },
          onInput(event: Event) {
            const value = (event.currentTarget as HTMLInputElement).value;
            service.send({ type: 'INPUT.CHANGE', value, index });
          },
        } as never);
      },

      getTimeListProps(props = {}) {
        return n.element({
          'data-scope': 'date-picker',
          'data-part': 'time-list',
          id: props.id,
          role: 'listbox',
          'aria-label': props.label,
          'aria-disabled': api.disabled || undefined,
          dir: service.prop('dir'),
          onKeyDown(event: KeyboardEvent) {
            if (event.defaultPrevented || api.disabled || api.readOnly) return;
            const list = event.currentTarget as HTMLElement;
            const options = Array.from(
              list.querySelectorAll<HTMLElement>(
                '[data-scope="date-picker"][data-part="time-option"]',
              ),
            );
            const current = (event.target as Element).closest<HTMLElement>(
              '[data-part="time-option"]',
            );
            const at = current ? options.indexOf(current) : -1;
            const focus = (index: number) => options[index]?.focus();
            switch (event.key) {
              case 'ArrowDown':
                focus(Math.min(at + 1, options.length - 1));
                break;
              case 'ArrowUp':
                focus(Math.max(at - 1, 0));
                break;
              case 'Home':
                focus(0);
                break;
              case 'End':
                focus(options.length - 1);
                break;
              case 'Enter':
              case ' ':
                if (current?.dataset.value) chooseTime(current.dataset.value);
                break;
              default:
                return;
            }
            event.preventDefault();
          },
        } as never);
      },

      getTimeOptionProps(props) {
        const selected = selectedTime() === props.value;
        // Tabbable: the selected time, or the first when no option matches it.
        const chosen = selectedTime();
        const step = props.step ?? 30;
        const minutes = chosen ? Number(chosen.slice(0, 2)) * 60 + Number(chosen.slice(3)) : -1;
        const listed = minutes >= 0 && minutes % step === 0;
        const tabbable = selected || (!listed && props.value === '00:00');
        return n.element({
          'data-scope': 'date-picker',
          'data-part': 'time-option',
          id: props.id,
          role: 'option',
          'aria-selected': selected,
          'data-selected': selected ? '' : undefined,
          'data-value': props.value,
          'data-disabled': api.disabled ? '' : undefined,
          tabIndex: api.disabled ? -1 : tabbable ? 0 : -1,
          onClick(event: MouseEvent) {
            if (event.defaultPrevented || api.disabled || api.readOnly) return;
            chooseTime(props.value);
          },
        } as never);
      },
    } as DatePickerApi;
  },
};

/** Props for a part that isn't the machine's (the field's hint, the panel's footer). */
export function datePickerPart(part: string): Attrs {
  return { 'data-scope': 'date-picker', 'data-part': part };
}

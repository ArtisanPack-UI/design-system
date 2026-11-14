/**
 * Calendar date math (#64): the month, week, day and agenda views of a list
 * of events, so React and Vue render the same days, titles, labels and event
 * order. Livewire UI Components ports these rules to PHP
 * (`Support\CalendarModel`) for its server-rendered grid; keep the two in
 * step. Dates are ISO strings throughout (`2026-11-02`); arithmetic uses
 * `@internationalized/date`, and names come from Intl in the locale with the
 * same skeletons the PHP port hands ICU, so both print the same text.
 */
import {
  CalendarDate,
  fromAbsolute,
  getDayOfWeek,
  today as todayIn,
} from '@internationalized/date';

import { directionOf } from '../positioning';

/** The four views. agenda is the accessible list alternative to the grid. */
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

/** The soft tints an event can take; neutral and the seven roles. */
export type CalendarColor =
  'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

/** An event as authors pass it. `start` and `end` are ISO strings (or Dates). */
export interface CalendarEvent {
  /** A stable id; the list index when unset. */
  id?: string | number;
  /**
   * `2026-11-02` for an all-day event, `2026-11-02T09:00` for a timed one. A
   * `Z` or offset is converted to the time zone. Required (or the 2.x `date`).
   */
  start?: string | Date;
  /** Inclusive for dates; a timed event ending at 00:00 ends the day before. */
  end?: string | Date;
  title: string;
  /** The tint. Never the only cue: the title (and category) say what it is. */
  color?: CalendarColor | string;
  /** All day even when `start` has a time. */
  allDay?: boolean;
  /** Shown in the legend, the agenda and the event's accessible name. */
  category?: string;
  /** Shown in the event's detail dialog. */
  description?: string;
  /** Makes the event a link instead of a button. */
  href?: string;
  /** 2.x: the start date. */
  date?: string | Date;
  /** 2.x: the end date. */
  endDate?: string | Date;
  [key: string]: unknown;
}

/** The built-in strings. Every one is translatable through `labels`. */
export interface CalendarLabels {
  today: string;
  previous: string;
  next: string;
  views: string;
  month: string;
  week: string;
  day: string;
  agenda: string;
  allDay: string;
  /** The more part's text; `{count}` is filled in. */
  more: string;
  /** The more part's accessible name; `{count}` and `{date}` are filled in. */
  showMore: string;
  newEvent: string;
  /** The agenda's text when the month has no events. */
  empty: string;
  /** The legend's accessible name. */
  legend: string;
}

export const CALENDAR_LABELS: CalendarLabels = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  views: 'Calendar view',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  allDay: 'All day',
  more: '+{count} more',
  showMore: 'Show {count} more events on {date}',
  newEvent: 'New event',
  empty: 'No events',
  legend: 'Categories',
};

export const CALENDAR_VIEWS: readonly CalendarView[] = ['month', 'week', 'day', 'agenda'];
export const CALENDAR_COLORS: readonly CalendarColor[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'error',
  'info',
  'neutral',
];
/** Events a month cell shows before "+N more". */
export const CALENDAR_MAX_EVENTS = 2;

/** An event placed on one day. */
export interface CalendarItem {
  /** `<eventKey>-<date>`: unique in a view, for list keys and ids. */
  key: string;
  /** The event's id, else its index. */
  eventKey: string;
  /** The index in `events`. */
  index: number;
  title: string;
  color: CalendarColor;
  category: string | null;
  description: string | null;
  href: string | null;
  allDay: boolean;
  start: string;
  end: string;
  startTime: string | null;
  endTime: string | null;
  /** The month chip's time: the start time on the first day of a timed event, else empty. */
  time: string;
  /** The week, day and agenda time: "09:00 – 10:00", the all-day label, or empty on a later day. */
  range: string;
  /** Full date and time: "Monday, November 2, 2026, 09:00 – 10:00". */
  when: string;
  /** Title, category and when, for logs and custom renderers. */
  label: string;
  /**
   * Category and when: the text a visually hidden span adds after the
   * visible time and title, so the event's name is its full time and title
   * and still starts with what's on screen (WCAG 2.5.3).
   */
  context: string;
  /** On a day after the first. */
  continued: boolean;
  /** The event as passed in. */
  event: CalendarEvent;
}

/** A day in the grid. */
export interface CalendarDay {
  date: string;
  /** The day of the month. */
  day: number;
  /** The full localized date. */
  label: string;
  /** The short weekday, as in the column header. */
  weekday: string;
  /** Outside the shown month (month view). */
  outside: boolean;
  today: boolean;
  /** The grid's tab stop. */
  focus: boolean;
  /** The events shown. */
  events: CalendarItem[];
  /** How many more there are than shown. */
  more: number;
  /** The more part's text and accessible name, when `more` > 0. */
  moreText: string;
  moreLabel: string;
}

/** A column header. */
export interface CalendarWeekday {
  short: string;
  long: string;
  /** The date under it, for week and day views. */
  date: string | null;
  /** The day of the month under it, for week and day views. */
  day: number | null;
  today: boolean;
}

/** A day in the agenda. */
export interface CalendarAgendaDay {
  date: string;
  label: string;
  today: boolean;
  events: CalendarItem[];
}

/** The legend's categories, in the order they first appear. */
export interface CalendarCategory {
  category: string;
  color: CalendarColor;
}

export interface CalendarOptions {
  view?: CalendarView | string;
  /** The date the view shows. Defaults to today. */
  date?: string | null;
  /** Marked as today. Defaults to the current date in `timeZone`. */
  today?: string | null;
  events?: readonly CalendarEvent[] | null;
  /** 0 (Sunday) to 6. Follows the locale unless set. */
  weekStartsOn?: number | null;
  locale?: string | null;
  /** For today's date and for times with a `Z` or offset. Defaults to UTC. */
  timeZone?: string | null;
  maxEvents?: number | null;
  labels?: Partial<CalendarLabels> | null;
}

export interface CalendarModel {
  view: CalendarView;
  date: string;
  today: string;
  title: string;
  previousDate: string;
  nextDate: string;
  weekStartsOn: number;
  weekdays: CalendarWeekday[];
  /** Weeks of days (month), one row of seven (week) or of one (day); empty for agenda. */
  rows: CalendarDay[][];
  agenda: CalendarAgendaDay[];
  legend: CalendarCategory[];
  labels: CalendarLabels;
}

const ISO =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?(Z|[+-]\d{2}:?\d{2})?$/;

/** A parsed date and optional wall-clock time, in the calendar's time zone. */
interface Moment {
  date: CalendarDate;
  time: string | null;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** A valid IANA zone, else UTC. */
export function calendarTimeZone(timeZone?: string | null): string {
  if (!timeZone) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return timeZone;
  } catch {
    return 'UTC';
  }
}

/** A valid BCP 47 locale, else en-US. */
export function calendarLocale(locale?: string | null): string {
  if (!locale) return 'en-US';
  try {
    return Intl.getCanonicalLocales(locale.replace(/_/g, '-'))[0] ?? 'en-US';
  } catch {
    return 'en-US';
  }
}

/** Parses an ISO date or date-time; a `Z` or offset (or a Date) is converted to `timeZone`. */
export function parseCalendarMoment(value: unknown, timeZone: string): Moment | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return fromInstant(value.getTime(), timeZone);
  }
  if (typeof value !== 'string') return null;
  const match = ISO.exec(value.trim());
  if (!match) return null;
  const [, y, m, d, hh, mm, ss, zone] = match;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  if (month < 1 || month > 12 || day < 1 || day > daysIn(year, month)) return null;
  if (hh === undefined) return { date: new CalendarDate(year, month, day), time: null };
  const hour = Number(hh);
  const minute = Number(mm);
  const second = Number(ss ?? 0);
  if (hour > 23 || minute > 59 || second > 59) return null;
  if (zone === undefined) {
    return { date: new CalendarDate(year, month, day), time: `${pad(hour)}:${pad(minute)}` };
  }
  let offset = 0;
  if (zone !== 'Z') {
    const sign = zone.startsWith('-') ? -1 : 1;
    const digits = zone.slice(1).replace(':', '');
    const offsetHours = Number(digits.slice(0, 2));
    const offsetMinutes = Number(digits.slice(2, 4));
    if (offsetHours > 23 || offsetMinutes > 59) return null;
    offset = sign * (offsetHours * 60 + offsetMinutes);
  }
  const ms = Date.UTC(year, month - 1, day, hour, minute, second) - offset * 60_000;
  try {
    return fromInstant(ms, timeZone);
  } catch {
    return null;
  }
}

function fromInstant(ms: number, timeZone: string): Moment {
  const zoned = fromAbsolute(ms, timeZone);
  return {
    date: new CalendarDate(zoned.year, zoned.month, zoned.day),
    time: `${pad(zoned.hour)}:${pad(zoned.minute)}`,
  };
}

function daysIn(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Parses `YYYY-MM-DD` (a time or zone is ignored). */
export function parseCalendarDate(value: unknown): CalendarDate | null {
  if (typeof value !== 'string') return null;
  const match = ISO.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysIn(year, month)) return null;
  return new CalendarDate(year, month, day);
}

/** Sunday = 0 … Saturday = 6. */
function weekdayOf(date: CalendarDate): number {
  return getDayOfWeek(date, 'en-US');
}

/** The locale's first day of the week, 0 (Sunday) to 6. */
export function localeWeekStart(locale: string): number {
  try {
    const sample = new CalendarDate(2026, 1, 4);
    return (weekdayOf(sample) - getDayOfWeek(sample, locale) + 7) % 7;
  } catch {
    return 0;
  }
}

/** The first day of the week: `weekStartsOn` when 0–6, else the locale's. */
export function calendarWeekStart(weekStartsOn: unknown, locale: string): number {
  return typeof weekStartsOn === 'number' &&
    Number.isInteger(weekStartsOn) &&
    weekStartsOn >= 0 &&
    weekStartsOn <= 6
    ? weekStartsOn
    : localeWeekStart(locale);
}

function startOfWeekFrom(date: CalendarDate, weekStart: number): CalendarDate {
  return date.subtract({ days: (weekdayOf(date) - weekStart + 7) % 7 });
}

/** A formatter for a date in UTC, from Intl options matching an ICU skeleton. */
function formatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const format = new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
  return (date: CalendarDate) =>
    format.format(new Date(Date.UTC(date.year, date.month - 1, date.day, 12)));
}

/** Fills `{name}` placeholders. */
export function fillCalendarLabel(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in values ? String(values[name]) : whole,
  );
}

/** The view, defaulting to month. 2.x `year` falls back to month. */
export function calendarView(view: unknown): CalendarView {
  return CALENDAR_VIEWS.includes(view as CalendarView) ? (view as CalendarView) : 'month';
}

/** The color, defaulting to primary. */
export function calendarColor(color: unknown): CalendarColor {
  return CALENDAR_COLORS.includes(color as CalendarColor) ? (color as CalendarColor) : 'primary';
}

interface Normalized {
  eventKey: string;
  index: number;
  title: string;
  color: CalendarColor;
  category: string | null;
  description: string | null;
  href: string | null;
  allDay: boolean;
  start: CalendarDate;
  end: CalendarDate;
  /** The end the text names: `end`, or the next day for a timed event ending at 00:00. */
  whenEnd: CalendarDate;
  startTime: string | null;
  endTime: string | null;
  event: CalendarEvent;
}

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value : null;

/** The events that parse, with their dates in the time zone. */
function normalizeEvents(events: readonly CalendarEvent[], timeZone: string): Normalized[] {
  const out: Normalized[] = [];
  events.forEach((event, index) => {
    if (!event || typeof event !== 'object') return;
    const start = parseCalendarMoment(event.start ?? event.date, timeZone);
    if (!start) return;
    const endValue = event.end ?? event.endDate;
    const parsedEnd =
      endValue === undefined || endValue === null ? null : parseCalendarMoment(endValue, timeZone);
    const allDay = event.allDay === true || start.time === null;
    const end = parsedEnd ?? { date: start.date, time: null };
    let endDate = end.date.compare(start.date) < 0 ? start.date : end.date;
    const whenEnd = endDate;
    if (!allDay && end.time === '00:00' && endDate.compare(start.date) > 0) {
      endDate = endDate.subtract({ days: 1 });
    }
    const id = event.id;
    out.push({
      eventKey: typeof id === 'string' || typeof id === 'number' ? String(id) : String(index),
      index,
      title: typeof event.title === 'string' ? event.title : String(event.title ?? ''),
      color: calendarColor(event.color),
      category: text(event.category),
      description: text(event.description),
      href: text(event.href),
      allDay,
      start: start.date,
      end: endDate,
      whenEnd,
      startTime: allDay ? null : start.time,
      endTime: allDay || parsedEnd === null ? null : parsedEnd.time,
      event,
    });
  });
  return out;
}

/** Order on a day: all-day and continued events first, then by start time, then as passed. */
function compareOn(day: CalendarDate) {
  const rank = (item: Normalized) =>
    item.allDay || item.start.compare(day) < 0 ? '' : (item.startTime ?? '');
  return (a: Normalized, b: Normalized) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra < rb ? -1 : 1;
    return a.index - b.index;
  };
}

/**
 * Builds a view of the events: the title, the previous and next dates, the
 * column headers, the rows of days with their events, the agenda and the
 * legend.
 */
export function calendarModel(options: CalendarOptions = {}): CalendarModel {
  const labels: CalendarLabels = { ...CALENDAR_LABELS, ...(options.labels ?? {}) };
  const locale = calendarLocale(options.locale);
  const timeZone = calendarTimeZone(options.timeZone);
  const view = calendarView(options.view);
  const today = parseCalendarDate(options.today) ?? todayIn(timeZone);
  const date = parseCalendarDate(options.date) ?? today;
  const weekStart = calendarWeekStart(options.weekStartsOn, locale);
  const max =
    typeof options.maxEvents === 'number' &&
    Number.isInteger(options.maxEvents) &&
    options.maxEvents >= 0
      ? options.maxEvents
      : CALENDAR_MAX_EVENTS;

  const full = formatter(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const monthYear = formatter(locale, { month: 'long', year: 'numeric' });
  const monthDay = formatter(locale, { month: 'short', day: 'numeric' });
  const monthDayYear = formatter(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  const weekdayShort = formatter(locale, { weekday: 'short' });
  const weekdayLong = formatter(locale, { weekday: 'long' });

  const events = normalizeEvents(options.events ?? [], timeZone);

  const when = (item: Normalized): string => {
    // A timed event ending at 00:00 is placed up to the day before but still
    // ends on the next day, so the text names that day.
    const end = item.whenEnd;
    const single = item.start.compare(end) === 0;
    if (item.allDay) {
      return single
        ? `${full(item.start)}, ${labels.allDay}`
        : `${full(item.start)} – ${full(end)}, ${labels.allDay}`;
    }
    if (single) {
      return `${full(item.start)}, ${item.startTime}${item.endTime ? ` – ${item.endTime}` : ''}`;
    }
    return `${full(item.start)}, ${item.startTime} – ${full(end)}${item.endTime ? `, ${item.endTime}` : ''}`;
  };

  const place = (item: Normalized, day: CalendarDate): CalendarItem => {
    const continued = item.start.compare(day) < 0;
    const single = item.start.compare(item.end) === 0;
    let range = '';
    if (item.allDay) range = labels.allDay;
    else if (!continued) {
      range = `${item.startTime}${item.endTime && single ? ` – ${item.endTime}` : ''}`;
    }
    const whenText = when(item);
    return {
      key: `${item.eventKey}-${day.toString()}`,
      eventKey: item.eventKey,
      index: item.index,
      title: item.title,
      color: item.color,
      category: item.category,
      description: item.description,
      href: item.href,
      allDay: item.allDay,
      start: item.start.toString(),
      end: item.end.toString(),
      startTime: item.startTime,
      endTime: item.endTime,
      time: item.allDay || continued ? '' : (item.startTime ?? ''),
      range,
      when: whenText,
      label: [item.title, item.category, whenText].filter((part) => part).join(', '),
      context: [item.category, whenText].filter((part) => part).join(', '),
      continued,
      event: item.event,
    };
  };

  const eventsOn = (day: CalendarDate): CalendarItem[] =>
    events
      .filter((item) => item.start.compare(day) <= 0 && item.end.compare(day) >= 0)
      .sort(compareOn(day))
      .map((item) => place(item, day));

  const first = new CalendarDate(date.year, date.month, 1);
  const last = first.add({ months: 1 }).subtract({ days: 1 });

  const makeDay = (day: CalendarDate, limit: number | null): CalendarDay => {
    const all = eventsOn(day);
    const shown = limit !== null && all.length > limit ? all.slice(0, limit) : all;
    const more = all.length - shown.length;
    const label = full(day);
    return {
      date: day.toString(),
      day: day.day,
      label,
      weekday: weekdayShort(day),
      outside: view === 'month' && day.month !== date.month,
      today: day.compare(today) === 0,
      focus: day.compare(date) === 0,
      events: shown,
      more,
      moreText: more > 0 ? fillCalendarLabel(labels.more, { count: more }) : '',
      moreLabel: more > 0 ? fillCalendarLabel(labels.showMore, { count: more, date: label }) : '',
    };
  };

  let title: string;
  let previousDate: CalendarDate;
  let nextDate: CalendarDate;
  const rows: CalendarDay[][] = [];
  const weekdays: CalendarWeekday[] = [];
  const agenda: CalendarAgendaDay[] = [];

  if (view === 'week') {
    const start = startOfWeekFrom(date, weekStart);
    const end = start.add({ days: 6 });
    title =
      start.year === end.year
        ? `${monthDay(start)} – ${monthDayYear(end)}`
        : `${monthDayYear(start)} – ${monthDayYear(end)}`;
    previousDate = date.subtract({ days: 7 });
    nextDate = date.add({ days: 7 });
    const row: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const day = start.add({ days: i });
      row.push(makeDay(day, null));
      weekdays.push({
        short: weekdayShort(day),
        long: weekdayLong(day),
        date: day.toString(),
        day: day.day,
        today: day.compare(today) === 0,
      });
    }
    rows.push(row);
  } else if (view === 'day') {
    title = full(date);
    previousDate = date.subtract({ days: 1 });
    nextDate = date.add({ days: 1 });
    rows.push([makeDay(date, null)]);
    weekdays.push({
      short: weekdayShort(date),
      long: weekdayLong(date),
      date: date.toString(),
      day: date.day,
      today: date.compare(today) === 0,
    });
  } else {
    title = monthYear(first);
    previousDate = date.subtract({ months: 1 });
    nextDate = date.add({ months: 1 });
    if (view === 'month') {
      const start = startOfWeekFrom(first, weekStart);
      const end = startOfWeekFrom(last, weekStart).add({ days: 6 });
      for (let i = 0; i < 7; i++) {
        const day = start.add({ days: i });
        weekdays.push({
          short: weekdayShort(day),
          long: weekdayLong(day),
          date: null,
          day: null,
          today: false,
        });
      }
      let row: CalendarDay[] = [];
      for (let day = start; day.compare(end) <= 0; day = day.add({ days: 1 })) {
        row.push(makeDay(day, max));
        if (row.length === 7) {
          rows.push(row);
          row = [];
        }
      }
    } else {
      for (let day = first; day.compare(last) <= 0; day = day.add({ days: 1 })) {
        const dayEvents = eventsOn(day);
        if (dayEvents.length === 0) continue;
        agenda.push({
          date: day.toString(),
          label: full(day),
          today: day.compare(today) === 0,
          events: dayEvents,
        });
      }
    }
  }

  const legend: CalendarCategory[] = [];
  for (const item of events) {
    if (item.category !== null && !legend.some((entry) => entry.category === item.category)) {
      legend.push({ category: item.category, color: item.color });
    }
  }

  return {
    view,
    date: date.toString(),
    today: today.toString(),
    title,
    previousDate: previousDate.toString(),
    nextDate: nextDate.toString(),
    weekStartsOn: weekStart,
    weekdays,
    rows,
    agenda,
    legend,
    labels,
  };
}

/**
 * Arrow-key navigation in a calendar grid: moves focus between its
 * `[data-part="cell"]`s and keeps one of them in the tab order. ArrowLeft and
 * ArrowRight follow the text direction (D-004); ArrowUp and ArrowDown move a
 * row and stay put on the first or last row (the key is still consumed, so the
 * page doesn't scroll); Home and End go to the start and end of the row. Keys
 * from inside a cell's events are left alone. Returns the cell it focused, or
 * null.
 */
export function calendarGridKeydown(
  event: KeyboardEvent,
  grid: Element | null,
): HTMLElement | null {
  if (!grid) return null;
  const target = event.target as HTMLElement | null;
  if (!target || target.getAttribute('data-part') !== 'cell') return null;
  const cells = Array.from(
    grid.querySelectorAll<HTMLElement>('[data-scope="calendar"][data-part="cell"]'),
  );
  const current = cells.indexOf(target);
  if (current < 0) return null;
  const row = target.closest('[data-scope="calendar"][data-part="row"]');
  const columns = Math.max(1, row ? row.querySelectorAll('[data-part="cell"]').length : 7);
  const rtl =
    directionOf(grid) === 'rtl' ||
    grid.closest('[dir]')?.getAttribute('dir')?.toLowerCase() === 'rtl';
  const column = current % columns;
  let next: number;
  switch (event.key) {
    case 'ArrowRight':
      next = current + (rtl ? -1 : 1);
      break;
    case 'ArrowLeft':
      next = current + (rtl ? 1 : -1);
      break;
    case 'ArrowDown':
      next = current + columns;
      break;
    case 'ArrowUp':
      next = current - columns;
      break;
    case 'Home':
      next = current - column;
      break;
    case 'End':
      next = current - column + columns - 1;
      break;
    default:
      return null;
  }
  event.preventDefault();
  const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
  if (vertical && (next < 0 || next >= cells.length)) next = current;
  const cell = cells[Math.min(cells.length - 1, Math.max(0, next))]!;
  for (const each of cells) each.tabIndex = each === cell ? 0 : -1;
  cell.focus();
  return cell;
}

/**
 * Moves focus to a date's cell in a calendar grid and makes it the grid's
 * one tab stop. "+N more" uses it after opening the day view: the button it
 * was on is gone, so focus would otherwise drop to the page. Returns the
 * cell, or null when the date isn't shown.
 */
export function focusCalendarCell(root: ParentNode | null, date: string): HTMLElement | null {
  if (!root) return null;
  const cells = Array.from(
    root.querySelectorAll<HTMLElement>('[data-scope="calendar"][data-part="cell"]'),
  );
  const cell = cells.find((each) => each.getAttribute('data-date') === date);
  if (!cell) return null;
  for (const each of cells) each.tabIndex = each === cell ? 0 : -1;
  cell.focus();
  return cell;
}

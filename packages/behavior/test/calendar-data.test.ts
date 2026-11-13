/**
 * Calendar date math (#64). The PHP port in Livewire UI Components
 * (`Support\CalendarModel`) is tested against the same expectations.
 */
import {
  calendarModel,
  calendarWeekStart,
  fillCalendarLabel,
  parseCalendarMoment,
  type CalendarEvent,
} from '../src/data/calendar';

const EVENTS: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
  },
  {
    id: 2,
    start: '2026-11-03T10:00',
    end: '2026-11-03T12:00',
    title: 'Marketing course',
    color: 'info',
    category: 'Learning',
  },
  {
    id: 3,
    start: '2026-11-03T13:00',
    title: 'Lunch · Edgehill Grill',
    color: 'success',
    category: 'Personal',
  },
  { id: 4, start: '2026-11-05', title: 'Anna’s birthday', color: 'accent', category: 'People' },
  {
    id: 5,
    start: '2026-11-09T11:00',
    title: 'Upgrade Slack plan',
    color: 'secondary',
    category: 'Admin',
  },
  {
    id: 6,
    start: '2026-11-12T11:00',
    title: 'Viewing · Lakeview',
    color: 'primary',
    category: 'Viewings',
  },
  {
    id: 7,
    start: '2026-11-12T16:00',
    title: 'Hubstaff broadcast',
    color: 'info',
    category: 'Learning',
  },
  {
    id: 8,
    start: '2026-11-12T18:00',
    title: 'Board dinner',
    color: 'success',
    category: 'Personal',
  },
  {
    id: 9,
    start: '2026-11-13T09:30',
    title: 'Meet a new intern',
    color: 'accent',
    category: 'People',
  },
  {
    id: 10,
    start: '2026-11-17',
    title: 'Facebook campaign',
    color: 'error',
    category: 'Marketing',
  },
  {
    id: 11,
    start: '2026-11-19T10:00',
    end: '2026-11-19T11:30',
    title: 'Design review',
    color: 'primary',
    category: 'Viewings',
  },
  {
    id: 12,
    start: '2026-11-24',
    title: 'Open house · Grove',
    color: 'success',
    category: 'Personal',
  },
  { id: 13, start: '2026-11-26', title: 'Thanksgiving', color: 'neutral', category: 'Holidays' },
];

const base = {
  date: '2026-11-07',
  today: '2026-11-07',
  weekStartsOn: 1,
  locale: 'en-US',
  events: EVENTS,
};

describe('calendar month', () => {
  const model = calendarModel(base);

  it('lays out the spec month: Oct 26 to Dec 6, Monday first', () => {
    expect(model.title).toBe('November 2026');
    expect(model.weekdays.map((w) => w.short)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
    expect(model.rows).toHaveLength(6);
    expect(model.rows[0]![0]!.date).toBe('2026-10-26');
    expect(model.rows[0]![0]!.outside).toBe(true);
    expect(model.rows[5]![6]!.date).toBe('2026-12-06');
    expect(model.previousDate).toBe('2026-10-07');
    expect(model.nextDate).toBe('2026-12-07');
  });

  it('marks today and the tab stop', () => {
    const days = model.rows.flat();
    expect(days.filter((d) => d.today).map((d) => d.date)).toEqual(['2026-11-07']);
    expect(days.filter((d) => d.focus).map((d) => d.date)).toEqual(['2026-11-07']);
    expect(days.find((d) => d.date === '2026-11-07')!.label).toBe('Saturday, November 7, 2026');
  });

  it('orders events by time and folds the rest into +N more', () => {
    const day = model.rows.flat().find((d) => d.date === '2026-11-12')!;
    expect(day.events.map((e) => e.title)).toEqual(['Viewing · Lakeview', 'Hubstaff broadcast']);
    expect(day.events.map((e) => e.time)).toEqual(['11:00', '16:00']);
    expect(day.more).toBe(1);
    expect(day.moreText).toBe('+1 more');
    expect(day.moreLabel).toBe('Show 1 more events on Thursday, November 12, 2026');
  });

  it('labels every event with its full time and title', () => {
    const first = model.rows.flat().find((d) => d.date === '2026-11-02')!.events[0]!;
    expect(first.label).toBe('Team meeting, Marketing, Monday, November 2, 2026, 09:00 – 10:00');
    expect(first.range).toBe('09:00 – 10:00');
    expect(first.context).toBe('Marketing, Monday, November 2, 2026, 09:00 – 10:00');
    const allDay = model.rows.flat().find((d) => d.date === '2026-11-24')!.events[0]!;
    expect(allDay.time).toBe('');
    expect(allDay.range).toBe('All day');
    expect(allDay.label).toBe('Open house · Grove, Personal, Tuesday, November 24, 2026, All day');
  });

  it('keeps the categories in the order they appear', () => {
    expect(model.legend.map((c) => `${c.category}:${c.color}`)).toEqual([
      'Marketing:error',
      'Learning:info',
      'Personal:success',
      'People:accent',
      'Admin:secondary',
      'Viewings:primary',
      'Holidays:neutral',
    ]);
  });

  it('follows the locale when weekStartsOn is unset', () => {
    expect(calendarWeekStart(undefined, 'en-US')).toBe(0);
    expect(calendarWeekStart(undefined, 'en-GB')).toBe(1);
    expect(calendarWeekStart(9, 'en-GB')).toBe(1);
    const sunday = calendarModel({ ...base, weekStartsOn: undefined });
    expect(sunday.rows[0]![0]!.date).toBe('2026-11-01');
    expect(sunday.rows).toHaveLength(5);
  });

  it('constrains the day when moving a month', () => {
    const model31 = calendarModel({ ...base, date: '2027-01-31' });
    expect(model31.nextDate).toBe('2027-02-28');
    expect(model31.previousDate).toBe('2026-12-31');
  });
});

describe('calendar week, day and agenda', () => {
  it('shows one row of seven with dated headers', () => {
    const model = calendarModel({ ...base, view: 'week', date: '2026-11-12' });
    expect(model.title).toBe('Nov 9 – Nov 15, 2026');
    expect(model.rows).toHaveLength(1);
    expect(model.rows[0]!.map((d) => d.day)).toEqual([9, 10, 11, 12, 13, 14, 15]);
    expect(model.weekdays[3]).toMatchObject({ short: 'Thu', day: 12, date: '2026-11-12' });
    expect(model.rows[0]![3]!.events.map((e) => e.title)).toEqual([
      'Viewing · Lakeview',
      'Hubstaff broadcast',
      'Board dinner',
    ]);
    expect(model.previousDate).toBe('2026-11-05');
    expect(calendarModel({ ...base, view: 'week', date: '2026-12-30' }).title).toBe(
      'Dec 28, 2026 – Jan 3, 2027',
    );
  });

  it('shows one day', () => {
    const model = calendarModel({ ...base, view: 'day', date: '2026-11-03' });
    expect(model.title).toBe('Tuesday, November 3, 2026');
    expect(model.rows[0]!.map((d) => d.events.map((e) => e.range))).toEqual([
      ['10:00 – 12:00', '13:00'],
    ]);
    expect(model.nextDate).toBe('2026-11-04');
  });

  it('lists the month by day in the agenda', () => {
    const model = calendarModel({ ...base, view: 'agenda' });
    expect(model.title).toBe('November 2026');
    expect(model.rows).toEqual([]);
    expect(model.agenda.map((d) => d.date)).toEqual([
      '2026-11-02',
      '2026-11-03',
      '2026-11-05',
      '2026-11-09',
      '2026-11-12',
      '2026-11-13',
      '2026-11-17',
      '2026-11-19',
      '2026-11-24',
      '2026-11-26',
    ]);
    expect(model.agenda[0]!.label).toBe('Monday, November 2, 2026');
    expect(calendarModel({ ...base, view: 'agenda', date: '2027-02-01' }).agenda).toEqual([]);
  });
});

describe('calendar events', () => {
  it('spreads multi-day events, all-day and continued ones first', () => {
    const model = calendarModel({
      ...base,
      view: 'week',
      date: '2026-11-02',
      events: [
        { start: '2026-11-03T08:00', title: 'Early' },
        { id: 'trip', start: '2026-11-02T15:00', end: '2026-11-04T09:00', title: 'Trip' },
        { start: '2026-11-03', end: '2026-11-04', title: 'Offsite' },
        { start: '2026-11-04T09:00', end: '2026-11-05T00:00', title: 'Late' },
      ],
    });
    const tuesday = model.rows[0]![1]!;
    expect(tuesday.events.map((e) => `${e.title}|${e.time}|${e.range}`)).toEqual([
      'Trip||',
      'Offsite||All day',
      'Early|08:00|08:00',
    ]);
    expect(tuesday.events[0]!.key).toBe('trip-2026-11-03');
    expect(tuesday.events[0]!.when).toBe(
      'Monday, November 2, 2026, 15:00 – Wednesday, November 4, 2026, 09:00',
    );
    expect(model.rows[0]![2]!.events.map((e) => e.title)).toEqual(['Trip', 'Offsite', 'Late']);
    expect(model.rows[0]![3]!.events.map((e) => e.title)).toEqual([]);
  });

  it('converts zoned times, defaults colors and skips what does not parse', () => {
    expect(parseCalendarMoment('2026-11-02T23:30:00Z', 'Europe/Madrid')).toMatchObject({
      time: '00:30',
    });
    expect(parseCalendarMoment('2026-11-02T09:00-05:00', 'UTC')).toMatchObject({ time: '14:00' });
    expect(parseCalendarMoment('2026-02-30', 'UTC')).toBeNull();
    const model = calendarModel({
      ...base,
      view: 'day',
      date: '2026-11-03',
      timeZone: 'Europe/Madrid',
      events: [
        { start: '2026-11-02T23:30:00Z', title: 'Zoned', color: 'teal' },
        { start: 'soon', title: 'Bad' },
        { date: '2026-11-03', title: '2.x' },
      ],
    });
    expect(model.rows[0]![0]!.events.map((e) => `${e.title}|${e.color}|${e.time}`)).toEqual([
      '2.x|primary|',
      'Zoned|primary|00:30',
    ]);
  });

  it('skips impossible seconds and offsets instead of rolling them over', () => {
    expect(parseCalendarMoment('2026-11-02T09:00:99Z', 'UTC')).toBeNull();
    expect(parseCalendarMoment('2026-11-02T09:00:60', 'UTC')).toBeNull();
    expect(parseCalendarMoment('2026-11-02T09:00+24:00', 'UTC')).toBeNull();
    expect(parseCalendarMoment('2026-11-02T09:00+05:60', 'UTC')).toBeNull();
    expect(parseCalendarMoment('2026-11-02T09:00:59+14:00', 'UTC')).toMatchObject({
      time: '19:00',
    });
    const model = calendarModel({
      ...base,
      view: 'day',
      date: '2026-11-02',
      events: [
        { start: '2026-11-02T09:00:99Z', title: 'Bad seconds' },
        { start: '2026-11-02T10:00', end: '2026-11-02T11:00:99Z', title: 'Bad end' },
        { start: '2026-11-02T12:00', title: 'Good' },
      ],
    });
    const day = model.rows[0]![0]!;
    expect(day.events.map((e) => e.title)).toEqual(['Bad end', 'Good']);
    expect(day.events[0]!.range).toBe('10:00');
  });

  it('names the next day for a timed event ending at 00:00', () => {
    const model = calendarModel({
      ...base,
      view: 'week',
      date: '2026-11-02',
      events: [{ start: '2026-11-04T09:00', end: '2026-11-05T00:00', title: 'Late' }],
    });
    const late = model.rows[0]![2]!.events[0]!;
    expect(late.end).toBe('2026-11-04');
    expect(late.range).toBe('09:00 – 00:00');
    expect(late.when).toBe(
      'Wednesday, November 4, 2026, 09:00 – Thursday, November 5, 2026, 00:00',
    );
    expect(model.rows[0]![3]!.events).toEqual([]);
  });

  it('fills label templates', () => {
    expect(fillCalendarLabel('+{count} more', { count: 3 })).toBe('+3 more');
    expect(fillCalendarLabel('{missing}', {})).toBe('{missing}');
  });

  it('defaults to month, today and translated labels', () => {
    const model = calendarModel({
      today: '2026-11-07',
      view: 'year',
      labels: { allDay: 'Todo el día' },
    });
    expect(model.view).toBe('month');
    expect(model.date).toBe('2026-11-07');
    expect(model.labels.allDay).toBe('Todo el día');
    expect(model.labels.today).toBe('Today');
  });
});

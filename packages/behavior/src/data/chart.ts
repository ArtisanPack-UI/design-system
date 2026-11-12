/**
 * Chart geometry (#63): the scales, ticks, paths, arcs, labels, legend and
 * data table every stack draws for a bar, line, area or donut chart, so
 * Blade, React and Vue emit the same SVG. Livewire UI Components ports these
 * formulas to PHP (`ChartGeometry`) with the same tie-breaking; the shared
 * vectors in `test/fixtures/chart-vectors.json` keep the two identical. The
 * plot stays LTR (D-004). Extends D-038.
 *
 * Coordinates are strings with one decimal (two for donut arcs), as
 * `toFixed` writes them. Series take `--apui-chart-1…6` in fixed order:
 * `series` on a mark or legend item is that number.
 */

/** The kind of chart. Emitted as `data-type`. */
export type ChartType = 'bar' | 'line' | 'area' | 'donut';

/** How values print: as they are, or shortened to k, M and B. */
export type ChartNotation = 'standard' | 'compact';

/**
 * One named series. `data` lines up with the chart's `labels`; each entry is
 * a value, or an ApexCharts-style point (`{ x, y }` or `[x, y]`) whose `y` is
 * the value and whose `x` labels the category when `labels` isn't given.
 */
export interface ChartSeriesInput {
  name?: string;
  data: readonly unknown[];
}

/** What the geometry needs besides the series. */
export interface ChartOptions {
  type?: ChartType;
  /**
   * The categories: the x axis, or the donut's slices. Empty or missing, the
   * `x` of the first series given as points fills them.
   */
  labels?: readonly unknown[];
  /** The plot's viewBox width (cartesian charts). @defaultValue 520 */
  width?: number;
  /** The plot's viewBox height (cartesian charts). @defaultValue 220 */
  height?: number;
  /** Names a series given as a plain array of numbers. */
  title?: string;
  /** Printed before every value, such as `$`. */
  prefix?: string;
  /** Printed after every value, such as `%`. */
  suffix?: string;
  notation?: ChartNotation;
}

/** One normalized series. Values that aren't finite numbers are `null`. */
export interface ChartSeries {
  name: string;
  data: (number | null)[];
}

/** A horizontal grid line and its value on the y axis. */
export interface ChartTick {
  y: string;
  textY: string;
  label: string;
}

/** A category label on the x axis. */
export interface ChartCategory {
  x: string;
  label: string;
}

/** A legend entry. `value` is the donut slice's share, otherwise null. */
export interface ChartLegendItem {
  name: string;
  series: number;
  value: string | null;
}

/**
 * A focusable mark: a bar, a donut slice, or the hit column of a line or
 * area chart's category. `title` and `body` fill the tooltip, `label` is the
 * accessible name, and the anchor (viewBox units) is where the tooltip
 * points.
 */
export interface ChartMark {
  index: number;
  series: number;
  shape: 'path' | 'rect';
  d: string;
  x: string;
  y: string;
  width: string;
  height: string;
  title: string;
  body: string;
  label: string;
  anchorX: string;
  anchorY: string;
}

/** A series' line or area path. */
export interface ChartPath {
  series: number;
  d: string;
}

/** A line or area chart's category: the crosshair and a dot per series. */
export interface ChartPoint {
  index: number;
  x: string;
  top: string;
  bottom: string;
  dots: { series: number; cx: string; cy: string }[];
}

/** The data table view: a header row, then a row per category. */
export interface ChartTable {
  columns: string[];
  rows: { label: string; cells: string[] }[];
}

/** Everything one chart draws. Strings are ready for SVG attributes. */
export interface ChartGeometry {
  type: ChartType;
  /** The viewBox. */
  width: number;
  height: number;
  /** The grid's start and end x, the y-axis labels' x and the x-axis labels' y. */
  left: string;
  right: string;
  tickX: string;
  labelY: string;
  ticks: ChartTick[];
  categories: ChartCategory[];
  legend: ChartLegendItem[];
  marks: ChartMark[];
  lines: ChartPath[];
  areas: ChartPath[];
  points: ChartPoint[];
  /** The one labeled value: the first series' maximum (cartesian charts). */
  value: { x: string; y: string; text: string } | null;
  table: ChartTable;
}

/** The default viewBox, in px, from the spec. */
export const CHART_WIDTH = 520;
export const CHART_HEIGHT = 220;
/** The donut's viewBox size and its outer and inner radius. */
export const CHART_DONUT_SIZE = 160;
export const CHART_DONUT_RADIUS = 64;
export const CHART_DONUT_INNER_RADIUS = 44;
/** The series colors, `--apui-chart-1…6`. */
export const CHART_COLORS = 6;
export const CHART_TYPES: readonly ChartType[] = ['bar', 'line', 'area', 'donut'];

const PAD_LEFT = 40;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;
const TICK_COUNT = 5;
const BAR_WIDTH = 0.56;
const BAR_OFFSET = 0.22;
const BAR_RADIUS = 4;
const UNITS: readonly [number, string][] = [
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'k'],
];

const fixed = (value: number, digits = 1): string => {
  const text = value.toFixed(digits);
  return /^-0\.0+$/.test(text) ? text.slice(1) : text;
};

/** 10 to a whole power, without `**` on negative powers (engines round those differently). */
const pow10 = (exponent: number): number => (exponent >= 0 ? 10 ** exponent : 1 / 10 ** -exponent);

/** The power of ten at or below a positive number. */
function exponentOf(value: number): number {
  let exponent = Math.floor(Math.log10(value));
  while (pow10(exponent + 1) <= value) exponent += 1;
  while (pow10(exponent) > value) exponent -= 1;
  return exponent;
}

/** Heckbert's nice number: 1, 2, 5 or 10 times a power of ten. */
export function niceNumber(value: number, round: boolean): number {
  if (!(value > 0)) return 1;
  const exponent = exponentOf(value);
  const base = pow10(exponent);
  const fraction = value / base;
  let nice: number;
  if (round) nice = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10;
  else nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * base;
}

/** Rounds to `digits` decimals, as `toFixed` does. */
const roundTo = (value: number, digits: number): number => Number(value.toFixed(digits));

/**
 * The y axis's values: nice steps from at or below the smallest value (or
 * zero) to at or above the largest (or zero), about five intervals.
 */
export function chartTicks(min: number, max: number): number[] {
  const low = Math.min(0, min);
  let high = Math.max(0, max);
  if (high === low) high = low + 1;
  const step = niceNumber(niceNumber(high - low, false) / TICK_COUNT, true);
  const digits = Math.max(0, -exponentOf(step));
  const start = roundTo(Math.floor(low / step) * step, digits);
  const end = roundTo(Math.ceil(high / step) * step, digits);
  const ticks: number[] = [];
  for (let index = 0; ; index += 1) {
    const tick = roundTo(start + index * step, digits);
    ticks.push(tick);
    if (tick >= end) break;
  }
  return ticks;
}

/** A finite number, a numeric string as a number, or null. */
function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  return null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** An ApexCharts-style point, `{ x, y }` or `[x, y]`, or null. */
function pointOf(value: unknown): { x: unknown; y: unknown } | null {
  if (isRecord(value) && 'y' in value) return { x: value.x, y: value.y };
  if (Array.isArray(value) && value.length === 2) return { x: value[0], y: value[1] };
  return null;
}

/** A data entry's value: the number, or a point's `y`. */
const valueOf = (value: unknown): number | null => {
  const point = pointOf(value);
  return toNumber(point ? point.y : value);
};

/**
 * The series as `{ name, data }`. A plain array of values is one series,
 * named `title`; entries that aren't objects are skipped otherwise. A
 * series' `data` takes values or ApexCharts-style points (`{ x, y }` or
 * `[x, y]`), read as their `y`.
 */
export function chartSeries(series: unknown, title = ''): ChartSeries[] {
  if (!Array.isArray(series) || series.length === 0) return [];
  if (!series.some(isRecord)) {
    return [{ name: title, data: series.map(toNumber) }];
  }
  return series.filter(isRecord).map((entry) => ({
    name: entry.name === undefined || entry.name === null ? '' : String(entry.name),
    data: Array.isArray(entry.data) ? entry.data.map(valueOf) : [],
  }));
}

/**
 * The categories the points carry: the `x` of each entry of the first series
 * whose `data` has an ApexCharts-style point, or `[]`. Used when the chart
 * has no `labels`.
 */
export function chartPointLabels(series: unknown): string[] {
  if (!Array.isArray(series)) return [];
  for (const entry of series) {
    if (!isRecord(entry) || !Array.isArray(entry.data)) continue;
    const points = entry.data.map(pointOf);
    if (!points.some((point) => point !== null)) continue;
    return points.map((point) =>
      point === null || point.x === null || point.x === undefined ? '' : String(point.x),
    );
  }
  return [];
}

const groupThousands = (digits: string): string => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function plain(value: number, digits: number, trim: boolean): string {
  let text = value.toFixed(digits);
  if (trim && text.includes('.')) text = text.replace(/\.?0+$/, '');
  const [whole, fraction] = text.split('.') as [string, string | undefined];
  return groupThousands(whole) + (fraction ? `.${fraction}` : '');
}

/** The most decimals a value or tick prints; anything smaller reads as 0. */
const MAX_DIGITS = 10;

/**
 * The decimals a standard value prints: two, or enough for two significant
 * digits below 1 (`0.0012`), so small values don't read as `0`.
 */
function valueDigits(magnitude: number): number {
  if (!(magnitude > 0) || magnitude >= 1) return 2;
  return Math.min(MAX_DIGITS, Math.max(2, 1 - exponentOf(magnitude)));
}

/** The units from smallest to largest: k, M, B. */
const LADDER = [...UNITS].reverse();

/**
 * The compact unit for a magnitude (an index into the k, M, B ladder, or -1
 * for none), stepped up when rounding reaches 1,000 of it, so 999,950 is
 * `1.0M`, not `1,000.0k`.
 */
function compactLevel(magnitude: number): number {
  let level = -1;
  LADDER.forEach(([size], index) => {
    if (magnitude >= size) level = index;
  });
  while (level < LADDER.length - 1) {
    const scaled = level < 0 ? magnitude : magnitude / LADDER[level]![0];
    const digits = level < 0 ? valueDigits(magnitude) : 1;
    if (Number(scaled.toFixed(digits)) < 1000) break;
    level += 1;
  }
  return level;
}

function signed(value: number, digits: string, prefix: string, suffix: string): string {
  const sign = value < 0 && /[1-9]/.test(digits) ? '-' : '';
  return `${sign}${prefix}${digits}${suffix}`;
}

/**
 * A value as the tooltip, value label and table print it: compact values
 * keep one decimal (`$4.1k`, `$10.0k`), others up to two, or two significant
 * digits below 1 (`0.0012`).
 */
export function formatChartValue(
  value: number,
  options: Pick<ChartOptions, 'prefix' | 'suffix' | 'notation'> = {},
): string {
  const magnitude = Math.abs(value);
  const level = options.notation === 'compact' ? compactLevel(magnitude) : -1;
  const unit = level < 0 ? null : LADDER[level]!;
  const digits = unit
    ? plain(magnitude / unit[0], 1, false) + unit[1]
    : plain(magnitude, valueDigits(magnitude), true);
  return signed(value, digits, options.prefix ?? '', options.suffix ?? '');
}

/**
 * The y-axis labels, compact ones sharing the unit of the largest (`$0k` …
 * `$10k`). They print up to two decimals, or as many as the step between
 * ticks needs (`0.001`, `0.002`, …).
 */
export function formatChartTicks(
  ticks: readonly number[],
  options: Pick<ChartOptions, 'prefix' | 'suffix' | 'notation'> = {},
): string[] {
  const largest = Math.max(0, ...ticks.map((tick) => Math.abs(tick)));
  const unit =
    options.notation === 'compact' ? (UNITS.find(([size]) => largest >= size) ?? null) : null;
  const step = ticks.length > 1 ? Math.abs(ticks[1]! - ticks[0]!) / (unit ? unit[0] : 1) : 0;
  const digits =
    step > 0 ? Math.min(MAX_DIGITS, Math.max(2, -exponentOf(niceNumber(step, true)))) : 2;
  return ticks.map((tick) => {
    const magnitude = Math.abs(tick);
    const text = unit
      ? plain(magnitude / unit[0], digits, true) + unit[1]
      : plain(magnitude, digits, true);
    return signed(tick, text, options.prefix ?? '', options.suffix ?? '');
  });
}

/** The series color number, 1 to 6, for the series or slice at `index`. */
export const chartColor = (index: number): number => (index % CHART_COLORS) + 1;

/** A slice's share of the total, with one decimal. */
const share = (value: number, total: number): string =>
  `${fixed(total > 0 ? (value / total) * 100 : 0)}%`;

/** Everything the chart draws for `series` as `options.type`. */
export function chartGeometry(series: unknown, options: ChartOptions = {}): ChartGeometry {
  const type: ChartType = CHART_TYPES.includes(options.type as ChartType)
    ? (options.type as ChartType)
    : 'bar';
  const format = { prefix: options.prefix, suffix: options.suffix, notation: options.notation };
  const all = chartSeries(series, options.title ?? '');
  const given =
    options.labels && options.labels.length > 0 ? options.labels : chartPointLabels(series);
  const labels = given.map((label) => (label === null || label === undefined ? '' : String(label)));

  if (type === 'donut') return donutGeometry(all, labels, format);

  const width = options.width && options.width > 0 ? options.width : CHART_WIDTH;
  const height = options.height && options.height > 0 ? options.height : CHART_HEIGHT;
  const drawn = type === 'bar' ? all.slice(0, 1) : all;
  const count = Math.max(labels.length, ...drawn.map((entry) => entry.data.length), 0);
  const label = (index: number) => labels[index] ?? '';
  const values = drawn.flatMap((entry) => entry.data.filter((v): v is number => v !== null));
  const ticks = chartTicks(Math.min(0, ...values), Math.max(0, ...values));
  const tickLabels = formatChartTicks(ticks, format);
  const low = ticks[0]!;
  const high = ticks[ticks.length - 1]!;
  const left = PAD_LEFT;
  const right = width - PAD_RIGHT;
  const top = PAD_TOP;
  const bottom = height - PAD_BOTTOM;
  const toY = (value: number): number => top + ((high - value) / (high - low)) * (bottom - top);
  const zero = toY(0);
  const plotWidth = right - left;

  const geometry: ChartGeometry = {
    type,
    width,
    height,
    left: fixed(left),
    right: fixed(right),
    tickX: fixed(left - 8),
    labelY: fixed(height - 6),
    ticks: ticks.map((tick, index) => ({
      y: fixed(toY(tick)),
      textY: fixed(toY(tick) + 4),
      label: tickLabels[index]!,
    })),
    categories: [],
    legend:
      drawn.length > 1
        ? drawn.map((entry, index) => ({
            name: entry.name,
            series: chartColor(index),
            value: null,
          }))
        : [],
    marks: [],
    lines: [],
    areas: [],
    points: [],
    value: null,
    table: {
      columns: ['', ...drawn.map((entry) => entry.name)],
      rows: Array.from({ length: count }, (_, index) => ({
        label: label(index),
        cells: drawn.map((entry) => {
          const value = entry.data[index] ?? null;
          return value === null ? '' : formatChartValue(value, format);
        }),
      })),
    },
  };

  const first = drawn[0];
  let peak: { index: number; value: number } | null = null;
  first?.data.forEach((value, index) => {
    if (index < count && value !== null && (peak === null || value > peak.value)) {
      peak = { index, value };
    }
  });

  if (type === 'bar') {
    const slot = count > 0 ? plotWidth / count : plotWidth;
    for (let index = 0; index < count; index += 1) {
      const center = left + index * slot + slot / 2;
      geometry.categories.push({ x: fixed(center), label: label(index) });
      const value = first?.data[index] ?? null;
      if (value === null) continue;
      const x = left + index * slot + slot * BAR_OFFSET;
      const barWidth = slot * BAR_WIDTH;
      const y = toY(value);
      const radius = Math.min(BAR_RADIUS, barWidth / 2, Math.abs(zero - y));
      const toward = y <= zero ? radius : -radius;
      const d =
        `M${fixed(x)},${fixed(zero)} V${fixed(y + toward)} Q${fixed(x)},${fixed(y)} ${fixed(x + radius)},${fixed(y)}` +
        ` H${fixed(x + barWidth - radius)} Q${fixed(x + barWidth)},${fixed(y)} ${fixed(x + barWidth)},${fixed(y + toward)}` +
        ` V${fixed(zero)} Z`;
      const body = formatChartValue(value, format);
      geometry.marks.push({
        index,
        series: chartColor(0),
        shape: 'path',
        d,
        x: fixed(x),
        y: fixed(Math.min(y, zero)),
        width: fixed(barWidth),
        height: fixed(Math.abs(zero - y)),
        title: label(index),
        body,
        label: `${label(index)}: ${body}`,
        anchorX: fixed(center),
        anchorY: fixed(Math.min(y, zero)),
      });
    }
    if (peak !== null) {
      const { index, value } = peak as { index: number; value: number };
      geometry.value = {
        x: fixed(left + index * slot + slot / 2),
        y: fixed(Math.min(toY(value), zero) - 8),
        text: formatChartValue(value, format),
      };
    }
    return geometry;
  }

  const step = count > 1 ? plotWidth / (count - 1) : 0;
  const xOf = (index: number): number => (count > 1 ? left + index * step : left + plotWidth / 2);
  for (let index = 0; index < count; index += 1) {
    geometry.categories.push({ x: fixed(xOf(index)), label: label(index) });
  }

  drawn.forEach((entry, seriesIndex) => {
    const runs: { x: number; y: number }[][] = [];
    let run: { x: number; y: number }[] = [];
    for (let index = 0; index < count; index += 1) {
      const value = entry.data[index] ?? null;
      if (value === null) {
        if (run.length) runs.push(run);
        run = [];
        continue;
      }
      run.push({ x: xOf(index), y: toY(value) });
    }
    if (run.length) runs.push(run);
    const segment = (points: { x: number; y: number }[]) =>
      points
        .map((point, index) => `${index === 0 ? 'M' : 'L'}${fixed(point.x)},${fixed(point.y)}`)
        .join(' ');
    const line = runs.map(segment).join(' ');
    if (line === '') return;
    geometry.lines.push({ series: chartColor(seriesIndex), d: line });
    if (type === 'area') {
      geometry.areas.push({
        series: chartColor(seriesIndex),
        d: runs
          .map(
            (points) =>
              `${segment(points)} L${fixed(points[points.length - 1]!.x)},${fixed(zero)} L${fixed(points[0]!.x)},${fixed(zero)} Z`,
          )
          .join(' '),
      });
    }
  });

  const many = drawn.length > 1;
  for (let index = 0; index < count; index += 1) {
    const x = xOf(index);
    const dots: ChartPoint['dots'] = [];
    const parts: string[] = [];
    let anchor = bottom;
    drawn.forEach((entry, seriesIndex) => {
      const value = entry.data[index] ?? null;
      if (value === null) return;
      const y = toY(value);
      anchor = Math.min(anchor, y);
      dots.push({ series: chartColor(seriesIndex), cx: fixed(x), cy: fixed(y) });
      const text = formatChartValue(value, format);
      parts.push(many ? `${entry.name} ${text}` : text);
    });
    if (dots.length === 0) continue;
    geometry.points.push({ index, x: fixed(x), top: fixed(top), bottom: fixed(bottom), dots });
    const start = count > 1 ? Math.max(left, x - step / 2) : left;
    const end = count > 1 ? Math.min(right, x + step / 2) : right;
    geometry.marks.push({
      index,
      series: chartColor(0),
      shape: 'rect',
      d: '',
      x: fixed(start),
      y: fixed(top),
      width: fixed(end - start),
      height: fixed(bottom - top),
      title: label(index),
      body: parts.join(' · '),
      label: `${label(index)}: ${parts.join(', ')}`,
      anchorX: fixed(x),
      anchorY: fixed(anchor),
    });
  }

  if (peak !== null) {
    const { index, value } = peak as { index: number; value: number };
    geometry.value = {
      x: fixed(xOf(index)),
      y: fixed(toY(value) - 10),
      text: formatChartValue(value, format),
    };
  }
  return geometry;
}

/** The donut: one arc per positive value, starting at 12 o'clock, clockwise. */
function donutGeometry(
  all: ChartSeries[],
  labels: string[],
  format: Pick<ChartOptions, 'prefix' | 'suffix' | 'notation'>,
): ChartGeometry {
  const size = CHART_DONUT_SIZE;
  const center = size / 2;
  const outer = CHART_DONUT_RADIUS;
  const inner = CHART_DONUT_INNER_RADIUS;
  const entry = all[0] ?? { name: '', data: [] };
  const count = Math.max(labels.length, entry.data.length);
  const label = (index: number) => labels[index] ?? '';
  const values = Array.from({ length: count }, (_, index) => entry.data[index] ?? null);
  const total = values.reduce<number>(
    (sum, value) => (value !== null && value > 0 ? sum + value : sum),
    0,
  );
  const point = (radius: number, angle: number) =>
    `${fixed(center + radius * Math.cos(angle), 2)},${fixed(center + radius * Math.sin(angle), 2)}`;

  const geometry: ChartGeometry = {
    type: 'donut',
    width: size,
    height: size,
    left: fixed(0),
    right: fixed(size),
    tickX: fixed(0),
    labelY: fixed(size),
    ticks: [],
    categories: [],
    legend: [],
    marks: [],
    lines: [],
    areas: [],
    points: [],
    value: null,
    table: { columns: ['', entry.name], rows: [] },
  };

  let angle = -Math.PI / 2;
  values.forEach((value, index) => {
    const amount = value !== null && value > 0 ? value : 0;
    const percent = share(amount, total);
    geometry.legend.push({ name: label(index), series: chartColor(index), value: percent });
    geometry.table.rows.push({
      label: label(index),
      cells: [value === null ? '' : `${formatChartValue(value, format)} (${percent})`],
    });
    if (amount === 0 || total === 0) return;
    const sweep = (amount / total) * 2 * Math.PI;
    const end = angle + sweep;
    let d: string;
    if (sweep >= 2 * Math.PI - 1e-9) {
      d =
        `M${point(outer, -Math.PI / 2)} A${outer},${outer} 0 1 1 ${point(outer, Math.PI / 2)}` +
        ` A${outer},${outer} 0 1 1 ${point(outer, -Math.PI / 2)}` +
        ` M${point(inner, -Math.PI / 2)} A${inner},${inner} 0 1 0 ${point(inner, Math.PI / 2)}` +
        ` A${inner},${inner} 0 1 0 ${point(inner, -Math.PI / 2)} Z`;
    } else {
      const large = sweep > Math.PI ? 1 : 0;
      d =
        `M${point(outer, angle)} A${outer},${outer} 0 ${large} 1 ${point(outer, end)}` +
        ` L${point(inner, end)} A${inner},${inner} 0 ${large} 0 ${point(inner, angle)} Z`;
    }
    const middle = angle + sweep / 2;
    const body = `${formatChartValue(amount, format)} · ${percent}`;
    geometry.marks.push({
      index,
      series: chartColor(index),
      shape: 'path',
      d,
      x: '',
      y: '',
      width: '',
      height: '',
      title: label(index),
      body,
      label: `${label(index)}: ${formatChartValue(amount, format)}, ${percent}`,
      anchorX: fixed(center + outer * Math.cos(middle), 2),
      anchorY: fixed(center + outer * Math.sin(middle), 2),
    });
    angle = end;
  });
  return geometry;
}

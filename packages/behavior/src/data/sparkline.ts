/**
 * Sparkline geometry (#61): the SVG paths every stack draws for a
 * word-sized trend, so Blade, React and Vue emit the same coordinates.
 * Livewire UI Components ports these formulas to PHP (`SparklineGeometry`);
 * keep the two in step. The plot has no axes and stays LTR (D-004).
 */

/** How a sparkline draws its values. Emitted as `data-variant`. */
export type SparklineVariant = 'line' | 'area' | 'bar';

/** One bar of a `bar` sparkline, with coordinates formatted to one decimal. */
export interface SparklineBar {
  x: string;
  y: string;
  width: string;
  height: string;
}

/** The marks of one sparkline. Strings are ready for SVG attributes. */
export interface SparklineGeometry {
  /** The line's `d`, empty for `bar` or without values. */
  line: string;
  /** The area's `d` (the line closed to the bottom edge), only for `area`. */
  area: string;
  /** The last value's dot, for `line` and `area`. */
  dot: { cx: string; cy: string } | null;
  /** One bar per value, only for `bar`. */
  bars: SparklineBar[];
  /** The zero line's y, when the values cross zero. */
  baseline: string | null;
}

/** The default size, in px, from the spec. */
export const SPARKLINE_WIDTH = 96;
export const SPARKLINE_HEIGHT = 28;
/** The default accessible label. `{first}`, `{latest}`, `{min}`, `{max}` and `{count}` are filled in. */
export const SPARKLINE_LABEL = 'Trend from {first} to {latest}';

const PAD_X = 2;
const PAD_Y = 3;

const fixed = (value: number): string => value.toFixed(1);

/** The finite numbers among the values, in order. */
export function sparklineValues(data: readonly unknown[] | null | undefined): number[] {
  return (data ?? []).filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value),
  );
}

/** The marks for `data` drawn as `variant` in a `width` × `height` box. */
export function sparklineGeometry(
  data: readonly unknown[] | null | undefined,
  variant: SparklineVariant = 'line',
  width: number = SPARKLINE_WIDTH,
  height: number = SPARKLINE_HEIGHT,
): SparklineGeometry {
  const values = sparklineValues(data);
  const empty: SparklineGeometry = { line: '', area: '', dot: null, bars: [], baseline: null };
  if (values.length === 0) return empty;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const toY = (value: number): number =>
    range === 0 ? height / 2 : PAD_Y + ((max - value) / range) * (height - 2 * PAD_Y);
  const zero = min < 0 && max > 0 ? toY(0) : null;
  const baseline = zero === null ? null : fixed(zero);

  if (variant === 'bar') {
    const slot = (width - 2 * PAD_X) / values.length;
    const bars = values.map((value, index) => {
      const top = toY(value);
      const bottom = zero ?? height;
      return {
        x: fixed(PAD_X + index * slot + slot * 0.2),
        y: fixed(Math.min(top, bottom)),
        width: fixed(slot * 0.6),
        height: fixed(Math.max(Math.abs(bottom - top), 1)),
      };
    });
    return { ...empty, bars, baseline };
  }

  const step = values.length > 1 ? (width - 2 * PAD_X) / (values.length - 1) : 0;
  const points = values.map((value, index) => ({
    x: values.length > 1 ? PAD_X + index * step : width / 2,
    y: toY(value),
  }));
  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${fixed(point.x)},${fixed(point.y)}`)
    .join(' ');
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const area =
    variant === 'area' ? `${line} L${fixed(last.x)},${height} L${fixed(first.x)},${height} Z` : '';
  return { line, area, dot: { cx: fixed(last.x), cy: fixed(last.y) }, bars: [], baseline };
}

/** The accessible label: the template with the values filled in. */
export function sparklineLabel(
  template: string,
  data: readonly unknown[] | null | undefined,
): string {
  const values = sparklineValues(data);
  const fill: Record<string, string> = {
    first: values.length ? String(values[0]) : '',
    latest: values.length ? String(values[values.length - 1]) : '',
    min: values.length ? String(Math.min(...values)) : '',
    max: values.length ? String(Math.max(...values)) : '',
    count: String(values.length),
  };
  return template.replace(/\{(first|latest|min|max|count)\}/g, (_, key: string) => fill[key]!);
}

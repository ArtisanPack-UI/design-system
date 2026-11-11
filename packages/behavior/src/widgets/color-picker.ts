/**
 * ColorPicker (#53) on Zag's color-picker machine: a field whose swatch
 * opens a popover with a saturation/brightness area, hue and opacity
 * sliders, a format select, an eyedropper and preset swatches. The text
 * value stays outside the popover, in the field, so typing always works.
 *
 * Values cross every stack boundary as strings in the field's text format:
 * `hex` (`#1f74bf`, `#1f74bfcc` with opacity), `rgb` (`rgb(31 116 191)`),
 * `hsl` (`hsl(209 72% 44%)`) or `oklch` (`oklch(0.552 0.137 250.6)`), each
 * with `/ alpha` when the color isn't opaque. Zag's color utilities don't
 * know OKLCH, so this module converts sRGB ↔ OKLab ↔ OKLCH itself.
 *
 * Parts settle against Zag's (D-015, D-019): Zag's `control` wrapper is the
 * field's `box`, and the field's text input is `control` (not a Zag part:
 * `getValueInputProps()`). The spec's swatch is Zag's `trigger` (with a
 * `swatch` inside), its popover Zag's `positioner` and `content`, its cursor
 * Zag's `area-thumb`, its sliders Zag's `channel-slider` parts. The format
 * select is ours (`getFormatSelectProps()`), since Zag's lists its own
 * internal formats. Zag's built-in labels are English, so every name is
 * replaced by the `apuiLabels` the stacks pass translated.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/color-picker';
import type { PropTypes } from '@zag-js/types';

import type { Attrs } from '../core/props';
import type { Normalize, WidgetDefinition } from '../core/widget';
import { repart } from './combobox';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type ColorPickerProps = zag.Props;
export type Color = zag.Color;

/** The text formats the field writes and reads. */
export type ColorTextFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

/** Every text format, in the format select's order. */
export const COLOR_FORMATS: readonly ColorTextFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];

/** The accessible names the widget writes. Every stack passes them translated. */
export interface ColorPickerLabels {
  /** The swatch that opens the popover, and the popover. Default `Choose a color`. */
  trigger?: string;
  /** The area. Default `Saturation and brightness`. */
  area?: string;
  /** The hue slider. Default `Hue`. */
  hue?: string;
  /** The opacity slider. Default `Opacity`. */
  alpha?: string;
  /** The format select. Default `Format`. */
  format?: string;
  /** The eyedropper. Default `Pick a color from the screen`. */
  eyeDropper?: string;
  /** The preset swatches' group. Default `Swatches`. */
  swatches?: string;
}

/** The English defaults of {@link ColorPickerLabels}. */
export const COLOR_PICKER_LABELS: Required<ColorPickerLabels> = {
  trigger: 'Choose a color',
  area: 'Saturation and brightness',
  hue: 'Hue',
  alpha: 'Opacity',
  format: 'Format',
  eyeDropper: 'Pick a color from the screen',
  swatches: 'Swatches',
};

// ---------------------------------------------------------------------------
// Color math

/** A color as sRGB channels 0–255 and alpha 0–1. */
export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** An OKLCH color: lightness 0–1, chroma 0–0.4+, hue in degrees, alpha 0–1. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
  a: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number, digits = 0) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

const toLinear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (c: number) => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return clamp(Math.round(v * 255), 0, 255);
};

/** sRGB to OKLCH (Björn Ottosson's OKLab matrices). */
export function rgbToOklch({ r, g, b, a }: Rgba): Oklch {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + B * B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h, a };
}

/** OKLCH to sRGB, clipped to the sRGB gamut. */
export function oklchToRgb({ l, c, h, a }: Oklch): Rgba {
  const L = clamp(l, 0, 1);
  const C = Math.max(0, c);
  const rad = (h * Math.PI) / 180;
  const A = C * Math.cos(rad);
  const B = C * Math.sin(rad);
  const l_ = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m_ = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s_ = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: fromLinear(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: fromLinear(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: fromLinear(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
    a: clamp(a, 0, 1),
  };
}

const rgbToHsl = ({ r, g, b, a }: Rgba) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: s * 100, l: l * 100, a };
};

const hslToRgb = (h: number, s: number, l: number, a: number): Rgba => {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) =>
    ln - sn * Math.min(ln, 1 - ln) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
    a: clamp(a, 0, 1),
  };
};

const hex2 = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
const alphaText = (a: number) => String(round(a, 3));

/** A color as text in `format`. Opacity below 1 adds `aa` to hex and `/ a` to the functions. */
export function formatRgba(color: Rgba, format: ColorTextFormat = 'hex'): string {
  const { r, g, b, a } = color;
  const opaque = a >= 1;
  switch (format) {
    case 'rgb':
      return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)}${opaque ? '' : ` / ${alphaText(a)}`})`;
    case 'hsl': {
      const hsl = rgbToHsl(color);
      return `hsl(${round(hsl.h)} ${round(hsl.s)}% ${round(hsl.l)}%${opaque ? '' : ` / ${alphaText(a)}`})`;
    }
    case 'oklch': {
      const o = rgbToOklch(color);
      return `oklch(${round(o.l, 3)} ${round(o.c, 3)} ${round(o.h, 1)}${opaque ? '' : ` / ${alphaText(a)}`})`;
    }
    default:
      return `#${hex2(r)}${hex2(g)}${hex2(b)}${opaque ? '' : hex2(a * 255)}`;
  }
}

const NUMBER = '[-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?';

/** A number, or a percentage of `scale`. */
const amount = (text: string, scale: number) =>
  text.endsWith('%') ? (parseFloat(text) / 100) * scale : parseFloat(text);

/** The channels of a CSS function, space or comma separated, with an optional alpha. */
function functionArgs(text: string, name: string): string[] | undefined {
  const match = new RegExp(`^${name}a?\\((.*)\\)$`, 'i').exec(text);
  if (!match) return undefined;
  const parts = match[1]!
    .trim()
    .split(/\s*[,/]\s*|\s+/)
    .filter(Boolean);
  const valid = new RegExp(`^${NUMBER}(?:%|deg)?$`, 'i');
  return parts.length >= 3 && parts.length <= 4 && parts.every((p) => valid.test(p))
    ? parts
    : undefined;
}

const alphaOf = (part: string | undefined) =>
  part === undefined ? 1 : clamp(amount(part, 1), 0, 1);

/**
 * Text in any of the four formats as sRGB, or undefined when it isn't a
 * color: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`/`rgba()`,
 * `hsl()`/`hsla()` and `oklch()`, with spaces or commas and `/ alpha`.
 * OKLCH outside the sRGB gamut is clipped.
 */
export function parseColorText(input: string): Rgba | undefined {
  const text = input.trim().toLowerCase();
  const hex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(text);
  if (hex) {
    let digits = hex[1]!;
    if (digits.length <= 4) digits = [...digits].map((d) => d + d).join('');
    const n = (i: number) => parseInt(digits.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: digits.length === 8 ? round(n(6) / 255, 3) : 1 };
  }
  const rgb = functionArgs(text, 'rgb');
  if (rgb) {
    const [r, g, b, a] = rgb;
    return {
      r: clamp(Math.round(amount(r!, 255)), 0, 255),
      g: clamp(Math.round(amount(g!, 255)), 0, 255),
      b: clamp(Math.round(amount(b!, 255)), 0, 255),
      a: alphaOf(a),
    };
  }
  const hsl = functionArgs(text, 'hsl');
  if (hsl) {
    const [h, s, l, a] = hsl;
    return hslToRgb(
      ((parseFloat(h!) % 360) + 360) % 360,
      parseFloat(s!),
      parseFloat(l!),
      alphaOf(a),
    );
  }
  const oklch = /^oklch\(/.test(text) ? functionArgs(text, 'oklch') : undefined;
  if (oklch) {
    const [l, c, h, a] = oklch;
    return oklchToRgb({
      l: amount(l!, 1),
      c: amount(c!, 0.4),
      h: ((parseFloat(h!) % 360) + 360) % 360,
      a: alphaOf(a),
    });
  }
  return undefined;
}

/** A Zag color as sRGB channels. */
export function colorToRgba(color: Color): Rgba {
  const rgba = color.toFormat('rgba');
  return {
    r: rgba.getChannelValue('red'),
    g: rgba.getChannelValue('green'),
    b: rgba.getChannelValue('blue'),
    a: rgba.getChannelValue('alpha'),
  };
}

/** sRGB channels as a Zag color, in the area's HSB space. */
export function rgbaToColor({ r, g, b, a }: Rgba): Color {
  return zag.parse(`rgba(${r}, ${g}, ${b}, ${a})`).toFormat('hsba');
}

/** Text in any format as a Zag color, or undefined. */
export function parseColorValue(text: string | null | undefined): Color | undefined {
  if (typeof text !== 'string' || text.trim() === '') return undefined;
  const rgba = parseColorText(text);
  return rgba ? rgbaToColor(rgba) : undefined;
}

/** A Zag color as text in `format`, opaque when `alpha` is off. */
export function formatColor(color: Color, format: ColorTextFormat = 'hex', alpha = true): string {
  const rgba = colorToRgba(color);
  return formatRgba(alpha ? rgba : { ...rgba, a: 1 }, format);
}

/** Whether the browser has the EyeDropper API. */
export function supportsEyeDropper(): boolean {
  return typeof window !== 'undefined' && 'EyeDropper' in window;
}

// ---------------------------------------------------------------------------
// The definition

/** Zag's names for the field's parts against the vocabulary's (D-018): Zag's `control` wrapper is the `box`. */
export const COLOR_PICKER_PARTS: Readonly<Record<string, string>> = { control: 'box' };

/** The widget's own machine props, beside Zag's. */
export interface ColorPickerExtraProps {
  /** The text format. Default `hex`. */
  apuiFormat?: ColorTextFormat;
  /** Whether opacity is offered. Default true. */
  apuiAlpha?: boolean;
  /** Translated names. */
  apuiLabels?: ColorPickerLabels;
  /** Called when the format select changes the format. */
  apuiOnFormatChange?: (format: ColorTextFormat) => void;
}

/** Zag's API plus the field's text input and the format select. */
export type ColorPickerApi<T extends PropTypes = PropTypes> = zag.Api<T> & {
  /** The value as text in the current format. */
  textValue: string;
  /** The current text format. */
  textFormat: ColorTextFormat;
  /** Whether opacity is offered. */
  alphaEnabled: boolean;
  /** Whether the eyedropper works here. */
  eyeDropperSupported: boolean;
  /** The field's text input (`control`): shows the value, and sets it on Enter or blur. */
  getValueInputProps(props?: { id?: string }): T['input'];
  /** The format select: hex, rgb, hsl, oklch. */
  getFormatSelectProps(props?: { id?: string }): T['select'];
  /** A layout row in the popover (`row`). */
  getRowProps(): T['element'];
};

/** Field ids of inputs someone is typing in: their text isn't overwritten until they commit. */
const editing = new Set<string>();

const HORIZONTAL_KEYS: Record<string, string> = {
  ArrowLeft: 'ArrowRight',
  ArrowRight: 'ArrowLeft',
};

/**
 * Wraps a slider's keydown so ArrowLeft and ArrowRight follow the text
 * direction: Zag mirrors the area and sliders under RTL but not their keys.
 */
function mirroredKeys(
  handler: ((event: KeyboardEvent) => void) | undefined,
  rtl: boolean,
): ((event: KeyboardEvent) => void) | undefined {
  if (!handler || !rtl) return handler;
  return (event: KeyboardEvent) => {
    const swapped = HORIZONTAL_KEYS[event.key];
    if (!swapped) {
      handler(event);
      return;
    }
    const proxy = new Proxy(event, {
      get(target, key) {
        if (key === 'key') return swapped;
        const value = Reflect.get(target, key) as unknown;
        return typeof value === 'function'
          ? (value as (...a: unknown[]) => unknown).bind(target)
          : value;
      },
    });
    handler(proxy);
  };
}

export const colorPicker: WidgetDefinition<Schema, ColorPickerApi> = {
  scope: 'color-picker',
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) => {
    const api = zag.connect(service as never, repart(normalize, COLOR_PICKER_PARTS)) as zag.Api;
    const n = normalize as Normalize;
    const prop = (key: string) => (service as unknown as { prop(k: string): unknown }).prop(key);
    const format = (prop('apuiFormat') as ColorTextFormat | undefined) ?? 'hex';
    const alpha = (prop('apuiAlpha') as boolean | undefined) ?? true;
    const labels = { ...COLOR_PICKER_LABELS, ...((prop('apuiLabels') as ColorPickerLabels) ?? {}) };
    const rtl = prop('dir') === 'rtl';
    const disabled = Boolean(prop('disabled'));
    const textValue = formatColor(api.value, format, alpha);
    const fieldId = (props: { id?: string }) =>
      props.id ?? `color-picker:${service.scope.id}:input`;

    const commit = (input: HTMLInputElement) => {
      editing.delete(input.id);
      const rgba = parseColorText(input.value);
      if (!rgba) {
        input.value = formatColor(service.context.get('value') as Color, format, alpha);
        return;
      }
      const next = rgbaToColor(alpha ? rgba : { ...rgba, a: 1 });
      api.setValue(next);
      input.value = formatColor(next, format, alpha);
    };

    const withLabel = <P>(props: P, label: string) => ({
      ...(props as object),
      'aria-label': label,
    });

    return {
      ...api,
      textValue,
      textFormat: format,
      alphaEnabled: alpha,
      eyeDropperSupported: supportsEyeDropper(),

      // Named by its own label: Zag's aria-labelledby (the field's label)
      // would name it like the text value it sits beside.
      getTriggerProps() {
        return {
          ...(withLabel(api.getTriggerProps(), labels.trigger) as object),
          'aria-labelledby': undefined,
        } as never;
      },

      getContentProps() {
        return n.element({
          ...(api.getContentProps() as object),
          role: 'dialog',
          'aria-label': labels.trigger,
        } as never);
      },

      getAreaThumbProps(props) {
        const base = api.getAreaThumbProps(props) as Record<string, unknown>;
        const x = Math.round(Number(base['aria-valuenow'] ?? 0));
        const y = Math.round(api.value.toFormat('hsba').getChannelValue('brightness'));
        return {
          ...base,
          'aria-label': labels.area,
          'aria-valuetext': `${x}%, ${y}%`,
          onKeyDown: mirroredKeys(base.onKeyDown as never, rtl),
        } as never;
      },

      getChannelSliderThumbProps(props) {
        const base = api.getChannelSliderThumbProps(props) as Record<string, unknown>;
        const value = Number(base['aria-valuenow'] ?? 0);
        const isAlpha = props.channel === 'alpha';
        return {
          ...base,
          'aria-label': isAlpha
            ? labels.alpha
            : props.channel === 'hue'
              ? labels.hue
              : props.channel,
          'aria-valuetext': isAlpha ? `${Math.round(value * 100)}%` : `${Math.round(value)}°`,
          onKeyDown: mirroredKeys(
            base.onKeyDown as never,
            rtl && (props.orientation ?? 'horizontal') === 'horizontal',
          ),
        } as never;
      },

      getEyeDropperTriggerProps() {
        return {
          ...(withLabel(api.getEyeDropperTriggerProps(), labels.eyeDropper) as object),
          hidden: !supportsEyeDropper(),
        } as never;
      },

      getSwatchGroupProps() {
        return withLabel(api.getSwatchGroupProps(), labels.swatches) as never;
      },

      getSwatchTriggerProps(props) {
        const color =
          typeof props.value === 'string'
            ? (parseColorValue(props.value) ?? props.value)
            : props.value;
        const base = api.getSwatchTriggerProps({ ...props, value: color }) as Record<
          string,
          unknown
        >;
        const text =
          typeof color === 'string' ? color : formatColor(color, format, alpha).toUpperCase();
        return {
          ...base,
          'aria-label': text,
          'aria-pressed': base['data-state'] === 'checked',
        } as never;
      },

      getSwatchProps(props) {
        const color =
          typeof props.value === 'string'
            ? (parseColorValue(props.value) ?? props.value)
            : props.value;
        return api.getSwatchProps({ ...props, value: color });
      },

      getValueInputProps(props: { id?: string } = {}) {
        const id = fieldId(props);
        const el =
          typeof document !== 'undefined'
            ? (document.getElementById(id) as HTMLInputElement | null)
            : null;
        return n.input({
          'data-scope': 'color-picker',
          'data-part': 'control',
          id,
          type: 'text',
          autoComplete: 'off',
          spellCheck: false,
          dir: 'ltr',
          disabled: disabled || undefined,
          readOnly: (prop('readOnly') as boolean | undefined) || undefined,
          required: (prop('required') as boolean | undefined) || undefined,
          'aria-invalid': (prop('invalid') as boolean | undefined) || undefined,
          'data-format': format,
          value: editing.has(id) && el ? el.value : textValue,
          onInput(event: Event) {
            editing.add((event.currentTarget as HTMLInputElement).id);
          },
          onKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Enter' || event.isComposing) return;
            event.preventDefault();
            commit(event.currentTarget as HTMLInputElement);
          },
          onBlur(event: FocusEvent) {
            commit(event.currentTarget as HTMLInputElement);
          },
        } as never);
      },

      getFormatSelectProps(props: { id?: string } = {}) {
        return n.select({
          'data-scope': 'color-picker',
          'data-part': 'format-select',
          id: props.id ?? `color-picker:${service.scope.id}:format`,
          'aria-label': labels.format,
          disabled: disabled || undefined,
          value: format,
          onChange(event: Event) {
            const next = (event.currentTarget as HTMLSelectElement).value as ColorTextFormat;
            if (!COLOR_FORMATS.includes(next)) return;
            (prop('apuiOnFormatChange') as ((f: ColorTextFormat) => void) | undefined)?.(next);
          },
        } as never);
      },

      getRowProps() {
        return n.element({ 'data-scope': 'color-picker', 'data-part': 'row' } as never);
      },
    } as ColorPickerApi;
  },
};

/** Props for a part that isn't the machine's (the field's hint and error). */
export function colorPickerPart(part: string): Attrs {
  return { 'data-scope': 'color-picker', 'data-part': part };
}

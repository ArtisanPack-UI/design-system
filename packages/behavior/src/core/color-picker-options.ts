/**
 * ColorPicker options for the React and Vue adapters (#53), and how they
 * become machine props. The Alpine component builds the same props through
 * `toColorPickerProps` too, so the three stacks map them in one place.
 */
import { direction } from './options';
import { type Direction, type PositionOptions, zagPositioning } from '../positioning';
import {
  type ColorPickerExtraProps,
  type ColorPickerLabels,
  type ColorPickerProps,
  type Color,
  type ColorTextFormat,
  formatColor,
  parseColorValue,
} from '../widgets/color-picker';

export interface ColorPickerOptions {
  /** Controlled value, as text in any format (`#1f74bf`, `rgb(…)`, `oklch(…)`). Pair it with `onValueChange`. */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the value as text in the current format (and the machine's color), whenever it changes. */
  onValueChange?: (details: { value: string; color: Color }) => void;
  /** Called once a drag, a key press or a choice ends. */
  onValueChangeEnd?: (details: { value: string }) => void;
  /** Controlled open state of the popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /** The text format. Default `hex`. */
  format?: ColorTextFormat;
  /** Called when the format select changes the format. */
  onFormatChange?: (details: { format: ColorTextFormat }) => void;
  /** Offer opacity (the alpha slider, and `/ alpha` in the text). Default true. */
  alpha?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Translated names. */
  labels?: ColorPickerLabels;
  /** Where the popover opens. Default `bottom-start`. */
  positioning?: PositionOptions;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: ColorPickerProps['ids'];
  dir?: Direction;
  /**
   * The color `value` stands for, when the adapter has it: the one the
   * machine last reported. Text rounds, so parsing it back would nudge the
   * thumbs while dragging.
   */
  valueColor?: Color;
}

/** The black the machine starts from without a value. */
const FALLBACK = '#000000';

/**
 * The machine's props for `options`. `dir` is the text direction the caller
 * resolved (Alpine reads the element's; React and Vue read `<html>`).
 */
export function toColorPickerProps(
  options: ColorPickerOptions,
  id: string,
  dir: Direction = direction(options),
): Partial<ColorPickerProps> & ColorPickerExtraProps {
  const format = options.format ?? 'hex';
  const alpha = options.alpha ?? true;
  const text = (color: Parameters<typeof formatColor>[0]) => formatColor(color, format, alpha);
  const color = (value: string | null | undefined) =>
    parseColorValue(value) ?? parseColorValue(FALLBACK);
  return {
    id,
    ids: options.ids,
    dir,
    disabled: options.disabled,
    readOnly: options.readOnly,
    required: options.required,
    invalid: options.invalid,
    // The area is saturation × brightness, so the machine works in HSB.
    defaultFormat: 'hsba',
    format: 'hsba',
    value: options.value === undefined ? undefined : (options.valueColor ?? color(options.value)),
    defaultValue: options.defaultValue === undefined ? undefined : color(options.defaultValue),
    open: options.open,
    defaultOpen: options.defaultOpen,
    closeOnSelect: false,
    positioning: zagPositioning(null, { placement: 'bottom-start', ...options.positioning, dir }),
    onValueChange: ({ value }) => options.onValueChange?.({ value: text(value), color: value }),
    onValueChangeEnd: ({ value }) => options.onValueChangeEnd?.({ value: text(value) }),
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
    apuiFormat: format,
    apuiAlpha: alpha,
    apuiLabels: options.labels,
    apuiOnFormatChange: (next) => options.onFormatChange?.({ format: next }),
  };
}

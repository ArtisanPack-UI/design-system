/**
 * The `apuiColorPicker` Alpine component (#53) on the shared color-picker
 * definition.
 *
 *   <div x-data="apuiColorPicker({ value: $wire.entangle('brand'), format: 'hex' })" x-apui:root>
 *     <label id="brand-label" x-apui:label>Brand color</label>
 *     <div id="brand-box" x-apui:box>
 *       <button id="brand-trigger" x-apui:trigger><span x-apui:swatch="{ current: true }"></span></button>
 *       <input id="brand-input" x-apui:control>
 *     </div>
 *     <div id="brand-positioner" x-apui:positioner wire:ignore>
 *       <div id="brand-content" x-apui:content>
 *         <div id="brand-area" x-apui:area>
 *           <div x-apui:area-background></div>
 *           <div id="brand-area-thumb" x-apui:area-thumb></div>
 *         </div>
 *         <div x-apui:channel-slider="{ channel: 'hue' }">
 *           <div id="brand-hue-track" x-apui:channel-slider-track="{ channel: 'hue' }">
 *             <div id="brand-hue-thumb" x-apui:channel-slider-thumb="{ channel: 'hue' }"></div>
 *           </div>
 *         </div>
 *         …
 *       </div>
 *     </div>
 *   </div>
 *
 * `value` (text in the current format), `open` and `format` are plain
 * Alpine state, so `$wire.entangle()` binds them to Livewire. Keep the
 * positioner `wire:ignore`: its gradients and thumbs are the machine's.
 */
import { type ColorPickerOptions, toColorPickerProps } from '../core/color-picker-options';
import type { Attrs } from '../core/props';
import { createWidget, type Widget } from '../core/widget';
import { directionOf } from '../positioning';
import {
  colorPicker,
  type ColorPickerApi,
  type ColorPickerExtraProps,
  type ColorPickerProps,
  type ColorTextFormat,
  formatColor,
  parseColorValue,
} from '../widgets/color-picker';

type PartArgs = Record<string, unknown> | undefined;

export interface ColorPickerAlpineOptions extends Omit<
  ColorPickerOptions,
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onValueChangeEnd'
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'onFormatChange'
  | 'ids'
> {
  /** Initial or entangled value, as text. */
  value?: string | null;
  /** Initial or entangled open state. */
  open?: boolean;
}

interface AlpineMagics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

interface State {
  value: string | null;
  open: boolean;
  format: ColorTextFormat;
}

/** `area-thumb` → `AreaThumb`. */
const pascal = (part: string) =>
  part
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());

/** Parts whose props come from a differently named getter. */
const GETTERS: Record<string, string> = {
  box: 'getControlProps',
  control: 'getValueInputProps',
};

/** The machine's single-element ids, by part. */
const SINGLE_IDS: Record<string, string> = {
  root: 'root',
  label: 'label',
  box: 'control',
  trigger: 'trigger',
  positioner: 'positioner',
  content: 'content',
  area: 'area',
  'area-thumb': 'areaThumb',
};

/** The author's ids, as the machine's `ids`: single parts, plus each slider's track and thumb. */
function authoredIds(root: Element): ColorPickerProps['ids'] {
  const ids: Record<string, unknown> = {};
  const tracks: Record<string, string> = {};
  const thumbs: Record<string, string> = {};
  const channelOf = (el: Element, part: string) => {
    const expression = el.getAttribute(`x-apui:${part}`) ?? '';
    return /channel:\s*['"]([a-z]+)['"]/.exec(expression)?.[1];
  };
  const visit = (el: Element) => {
    if (!el.id) return;
    for (const { name } of Array.from(el.attributes)) {
      if (!name.startsWith('x-apui:')) continue;
      const part = name.slice('x-apui:'.length);
      if (SINGLE_IDS[part]) ids[SINGLE_IDS[part]!] ??= el.id;
      const channel = channelOf(el, part);
      if (channel && part === 'channel-slider-track') tracks[channel] = el.id;
      if (channel && part === 'channel-slider-thumb') thumbs[channel] = el.id;
    }
  };
  visit(root);
  root.querySelectorAll('*').forEach(visit);
  if (Object.keys(tracks).length) {
    ids.channelSliderTrack = (channel: string) => tracks[channel] ?? `${root.id}-track-${channel}`;
  }
  if (Object.keys(thumbs).length) {
    ids.channelSliderThumb = (channel: string) => thumbs[channel] ?? `${root.id}-thumb-${channel}`;
  }
  return ids as ColorPickerProps['ids'];
}

/** The `apuiColorPicker` Alpine component. */
export function colorPickerComponent(options: ColorPickerAlpineOptions = {}) {
  let widget: Widget<ColorPickerProps & ColorPickerExtraProps, ColorPickerApi> | undefined;
  /** The last text the machine reported, so the watcher doesn't send it back (rounding would nudge the thumbs). */
  let reported: string | null | undefined;

  return {
    value: options.value ?? null,
    open: options.open ?? false,
    format: (options.format ?? 'hex') as ColorTextFormat,

    init(this: AlpineMagics & State) {
      const el = this.$el;
      const id = options.id ?? this.$id('apui-color-picker');
      const props = toColorPickerProps(
        {
          ...options,
          format: this.format,
          value: this.value ?? undefined,
          open: Boolean(this.open),
          onValueChange: ({ value, color }) => {
            reported = value;
            // The machine's value is controlled: hand it the exact color back.
            widget?.setProps({ value: color });
            if (this.value !== value) this.value = value;
            el.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true }));
          },
          onOpenChange: ({ open }) => {
            if (this.open !== open) this.open = open;
            el.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true }));
          },
          onFormatChange: ({ format }) => {
            this.format = format;
          },
        },
        id,
        options.dir ?? directionOf(el),
      );
      widget = createWidget(colorPicker, { ...props, id, ids: authoredIds(el) } as never);
      widget.start();
      this.$watch('value', (value) => {
        if (value === reported) return;
        const color = parseColorValue(value as string | null);
        if (color) widget?.setProps({ value: color });
      });
      this.$watch('open', (open) => widget?.setProps({ open: Boolean(open) }));
      this.$watch('format', (format) => {
        widget?.setProps({ apuiFormat: format as ColorTextFormat });
        const api = widget?.api();
        if (!api) return;
        // The same color, written in the new format.
        const value = formatColor(api.value, format as ColorTextFormat, options.alpha ?? true);
        reported = value;
        this.value = value;
        el.dispatchEvent(new CustomEvent('format-change', { detail: { format }, bubbles: true }));
        el.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true }));
      });
    },

    destroy() {
      widget?.stop();
      widget = undefined;
    },

    show(this: { open: boolean }) {
      this.open = true;
    },

    hide(this: { open: boolean }) {
      this.open = false;
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      return widget.bind(el, (api) => partProps(api, part, args(), el));
    },
  };
}

/** The machine's props for a part. */
function partProps(api: ColorPickerApi, part: string, args: PartArgs, el: Element): Attrs {
  if (part === 'control') return api.getValueInputProps({ id: el.id || undefined }) as Attrs;
  if (part === 'format-select')
    return api.getFormatSelectProps({ id: el.id || undefined }) as Attrs;
  if (part === 'swatch' && args?.current) return api.getSwatchProps({ value: api.value }) as Attrs;
  if (GETTERS[part]) return getter(api, GETTERS[part]!)(args ?? {});
  return getter(api, `get${pascal(part)}Props`)(args ?? {});
}

/** The API's getter for a part, or an error naming the part. */
function getter(api: ColorPickerApi, name: string): (args: unknown) => Attrs {
  const fn = (api as unknown as Record<string, unknown>)[name];
  if (typeof fn !== 'function') throw new Error(`[apui] color-picker has no "${name}"`);
  return fn as (args: unknown) => Attrs;
}

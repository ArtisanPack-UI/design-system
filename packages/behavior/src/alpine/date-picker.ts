/**
 * The `apuiDatePicker` Alpine component (#55): DatePicker, and DateTime as its
 * `time` mode, on the shared date-picker definition.
 *
 *   <div x-data="apuiDatePicker({ value: $wire.entangle('moveIn'), locale: 'en-US' })" x-apui:root>
 *     <label id="move-in-label" x-apui:label>Move-in date</label>
 *     <div id="move-in-box" x-apui:box>
 *       <button id="move-in-trigger" x-apui:trigger>…</button>
 *       <input id="move-in-input" x-apui:control>
 *     </div>
 *     <div id="move-in-positioner" x-apui:positioner wire:ignore>
 *       <div id="move-in-content" x-apui:content>
 *         <div x-apui:view-control>
 *           <button id="move-in-prev" x-apui:prev-trigger>‹</button>
 *           <span x-apui:range-text x-text="monthLabel"></span>
 *           <button id="move-in-next" x-apui:next-trigger>›</button>
 *         </div>
 *         <table id="move-in-table" x-apui:table>…x-for over weeks…</table>
 *       </div>
 *     </div>
 *   </div>
 *
 * `value` (an ISO string, or an array of two in range mode) and `open` are
 * plain Alpine state, so `$wire.entangle()` binds them to Livewire. The
 * calendar's rows are client-rendered from `weeks` and `weekDays`, so keep
 * the positioner `wire:ignore`: the morph leaves it to the machine.
 */
import { createWidget, type Widget } from '../core/widget';
import type { Attrs } from '../core/props';
import { type DatePickerOptions, toDatePickerProps } from '../core/date-picker-options';
import { directionOf } from '../positioning';
import {
  datePicker,
  type DatePickerApi,
  type DatePickerProps,
  type DatePickerValue,
  fromIsoValue,
  parseIso,
  sameIsoValue,
  timeOptions,
  toIso,
  type TimeOption,
  type WeekdayLabel,
} from '../widgets/date-picker';

type PartArgs = Record<string, unknown> | undefined;

/** One day cell as Alpine renders it: plain data, so Alpine's proxies never wrap a date object. */
export interface DayCell {
  /** `YYYY-MM-DD`, the cell's value. */
  iso: string;
  /** The day of the month. */
  day: number;
}

export interface DatePickerAlpineOptions extends Omit<
  DatePickerOptions,
  'value' | 'defaultValue' | 'onValueChange' | 'open' | 'defaultOpen' | 'onOpenChange' | 'ids'
> {
  /** Initial or entangled value. */
  value?: DatePickerValue;
  /** Initial or entangled open state. */
  open?: boolean;
  /** Minutes between times in the time list. Default 30. */
  step?: number;
  /** The time list's accessible name. Default `Time`. */
  timeLabel?: string;
}

interface AlpineMagics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

interface State {
  value: DatePickerValue;
  open: boolean;
  weeks: DayCell[][];
  weekDays: WeekdayLabel[];
  monthLabel: string;
  times: TimeOption[];
}

/** `close-trigger` → `CloseTrigger`. */
const pascal = (part: string) =>
  part
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());

/**
 * Parts whose props come from a differently named getter: the field's parts
 * carry the vocabulary's names (`box`, `control`), Zag's getters its own.
 */
const GETTERS: Record<string, string> = {
  box: 'getControlProps',
  control: 'getInputProps',
  'table-cell': 'getDayTableCellProps',
  'table-cell-trigger': 'getDayTableCellTriggerProps',
};

/** Machine parts with one element, whose author id the machine takes as a string. */
const SINGLE_IDS: Record<string, string> = {
  root: 'root',
  content: 'content',
  box: 'control',
  trigger: 'trigger',
  positioner: 'positioner',
};

/**
 * The author's ids, as the machine's `ids`. Most of the date picker's ids are
 * functions (one per input index, per view), so they're built from the
 * markup: inputs and labels in document order, the month buttons and the
 * table by their element. Day cells keep the machine's ids; they're
 * client-rendered inside the `wire:ignore` positioner.
 */
function authoredIds(root: Element): DatePickerProps['ids'] {
  const found: Record<string, string[]> = {};
  const collect = (el: Element) => {
    if (!el.id) return;
    for (const { name } of Array.from(el.attributes)) {
      if (!name.startsWith('x-apui:')) continue;
      const part = name.slice('x-apui:'.length);
      (found[part] ??= []).push(el.id);
    }
  };
  const visit = (scope: ParentNode) => {
    for (const el of Array.from(scope.querySelectorAll('*'))) {
      if (el !== root && el.hasAttribute('x-data')) continue;
      if (el instanceof HTMLTemplateElement) visit(el.content);
      else collect(el);
    }
  };
  collect(root);
  visit(root);

  const ids: Record<string, unknown> = {};
  for (const [part, key] of Object.entries(SINGLE_IDS)) {
    const id = found[part]?.[0];
    if (id) ids[key] = id;
  }
  const at = (part: string) => {
    const list = found[part];
    return list?.length ? (index: number) => list[index] ?? `${list[0]}-${index}` : undefined;
  };
  const one = (part: string) => {
    const id = found[part]?.[0];
    return id ? () => id : undefined;
  };
  ids.input = at('control');
  ids.label = at('label');
  ids.prevTrigger = one('prev-trigger');
  ids.nextTrigger = one('next-trigger');
  ids.table = one('table');
  return Object.fromEntries(
    Object.entries(ids).filter(([, value]) => value !== undefined),
  ) as DatePickerProps['ids'];
}

/**
 * Removes the server-rendered month (`data-apui-ssr`), including inside
 * `x-teleport` and `x-for` templates that haven't run yet.
 */
function removeServerMonth(scope: ParentNode): void {
  scope.querySelectorAll('[data-apui-ssr]').forEach((node) => node.remove());
  scope.querySelectorAll('template').forEach((template) => removeServerMonth(template.content));
}

/** The `apuiDatePicker` Alpine component. */
export function datePickerComponent(options: DatePickerAlpineOptions = {}) {
  const mode = options.mode ?? 'single';
  const time = Boolean(options.time) && mode === 'single';
  const step = options.step ?? 30;
  let widget: Widget<DatePickerProps, DatePickerApi> | undefined;
  let rendered = '';

  /** Copies what the template renders from the machine, when it changed. */
  const sync = (state: State, api: DatePickerApi) => {
    const weeks = api.weeks.map((week) =>
      week.map((date) => ({ iso: toIso(date), day: date.day })),
    );
    const weekDays = api.weekDays.map((day) => ({ short: day.short, long: day.long }));
    const monthLabel = api.visibleRangeText.start;
    const key = JSON.stringify([weeks, weekDays, monthLabel]);
    if (key === rendered) return;
    rendered = key;
    state.weeks = weeks;
    state.weekDays = weekDays;
    state.monthLabel = monthLabel;
  };

  return {
    value: options.value ?? (mode === 'range' ? [] : null),
    open: options.open ?? false,
    weeks: [] as DayCell[][],
    weekDays: [] as WeekdayLabel[],
    monthLabel: '',
    times: time ? timeOptions(step) : ([] as TimeOption[]),

    init(this: AlpineMagics & State) {
      const el = this.$el;
      // The server renders the month for pages without JavaScript (and the
      // first paint); the machine's month replaces it.
      removeServerMonth(el);
      const id = options.id ?? this.$id('apui-date-picker');
      const props = toDatePickerProps(
        {
          ...options,
          value: this.value,
          open: Boolean(this.open),
          onValueChange: ({ value }) => {
            if (!sameIsoValue(this.value, value)) this.value = value;
            el.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true }));
          },
          onOpenChange: ({ open }) => {
            if (this.open !== open) this.open = open;
            el.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true }));
          },
        },
        id,
        options.dir ?? directionOf(el),
      );
      widget = createWidget(datePicker, { ...props, id, ids: authoredIds(el) });
      widget.subscribe((api) => sync(this, api));
      widget.start();
      sync(this, widget.api());
      this.$watch('value', (value) => {
        const dates = fromIsoValue(value as DatePickerValue);
        widget?.setProps({ value: dates });
        // A value from outside (the server, a reset) shows its month next time.
        const api = widget?.api();
        if (api && !api.open && dates[0]) api.setFocusedValue(dates[0]);
      });
      this.$watch('open', (open) => widget?.setProps({ open: Boolean(open) }));
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
      return widget.bind(el, (api) => partProps(api, part, args(), step, options.timeLabel));
    },
  };
}

/** The machine's props for a part. */
function partProps(
  api: DatePickerApi,
  part: string,
  args: PartArgs,
  step: number,
  timeLabel = 'Time',
): Attrs {
  if (part === 'table-cell' || part === 'table-cell-trigger') {
    const value = parseIso(args?.value);
    if (!value) return {};
    return getter(api, GETTERS[part]!)({ value });
  }
  if (GETTERS[part]) return getter(api, GETTERS[part]!)(args ?? {});
  if (part === 'time-list') return api.getTimeListProps({ label: timeLabel, ...args }) as Attrs;
  if (part === 'time-option') {
    return api.getTimeOptionProps({ step, ...args, value: String(args?.value ?? '') }) as Attrs;
  }
  return getter(api, `get${pascal(part)}Props`)(args ?? {});
}

/** The API's getter for a part, or an error naming the part. */
function getter(api: DatePickerApi, name: string): (args: unknown) => Attrs {
  const fn = (api as unknown as Record<string, unknown>)[name];
  if (typeof fn !== 'function') throw new Error(`[apui] date-picker has no "${name}"`);
  return fn as (args: unknown) => Attrs;
}

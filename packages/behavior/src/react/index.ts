/**
 * The React adapter (#36). Each hook runs a widget definition's machine and
 * `connect()` through Zag's React adapter, so parts, ARIA, `data-scope` and
 * `data-part` match the Alpine adapter exactly. Spread a part's props onto its
 * element:
 *
 *   const dialog = useDialog({ open, onOpenChange: ({ open }) => setOpen(open) });
 *   <button {...dialog.getTriggerProps()}>Edit</button>
 *
 * State is controlled (`open`, `value` with `onOpenChange`, `onValueChange`)
 * or uncontrolled (`defaultOpen`, `defaultValue`), as React expects.
 */
import type { Api as ZagComboboxApi } from '@zag-js/combobox';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import type { Api as ZagMenuApi } from '@zag-js/menu';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react';
import type { GroupService, Props as ZagToastProps } from '@zag-js/toast';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import {
  type ComboboxOptions,
  type DialogOptions,
  type DropdownMenuOptions,
  emptyProps,
  currentValue,
  toComboboxProps,
  toDialogProps,
  toDropdownMenuProps,
  type ToastGroupOptions,
  toToastGroupProps,
  toValueArray,
  visibleItems,
} from '../core/options';
import type { Attrs } from '../core/props';
import type { Normalize } from '../core/widget';
import { useDirection } from './direction';
import { combobox, type ComboboxItem } from '../widgets/combobox';
import { dialog } from '../widgets/dialog';
import { dropdownMenu } from '../widgets/dropdown-menu';
import { toast, type ToastApi as CoreToastApi, toastGroup } from '../widgets/toast';
import type { Api as ZagTabsApi } from '@zag-js/tabs';
import { firstEnabledTab, tabs, type TabsOptions, toTabsProps } from '../widgets/tabs';

export type { TabsActivationMode, TabsIds, TabsOptions, TabsOrientation } from '../widgets/tabs';

import type { Api as ZagAccordionApi } from '@zag-js/accordion';
import type { Api as ZagCollapsibleApi } from '@zag-js/collapsible';
import { accordion, type AccordionOptions, toAccordionProps } from '../widgets/accordion';
import { collapse, type CollapseOptions, toCollapseProps } from '../widgets/collapse';

export type { AccordionIds, AccordionOptions } from '../widgets/accordion';
export type { CollapseIds, CollapseOptions, CollapseVariant } from '../widgets/collapse';

/** The accordion's API with React props for each part. */
export type AccordionApi = ZagAccordionApi<PropTypes>;

/**
 * Accordion: triggers in headings that open and close their panels, one at
 * a time or several with `multiple`; ArrowDown and ArrowUp move between
 * triggers. Items are `getItemProps({ value })`, triggers
 * `getItemTriggerProps({ value, disabled })` (rendered as `trigger`),
 * chevrons `getItemIndicatorProps` (`chevron`) and panels
 * `getItemContentProps` (`content`).
 */
export function useAccordion(options: AccordionOptions = {}): AccordionApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    accordion.machine,
    toAccordionProps({ ...options, dir }, options.id ?? fallback),
  );
  return accordion.connect(service, normalize) as unknown as AccordionApi;
}

/** The collapse's API with React props for each part. */
export type CollapseApi = ZagCollapsibleApi<PropTypes>;

/**
 * Collapse: a trigger that shows and hides one region, or clamps it with
 * `variant: 'read-more'`. Parts are `getRootProps`, `getTriggerProps`,
 * `getIndicatorProps` (rendered as `icon`) and `getContentProps`.
 */
export function useCollapse(options: CollapseOptions = {}): CollapseApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    collapse.machine,
    toCollapseProps({ ...options, dir }, options.id ?? fallback),
  );
  return collapse.connect(service, normalize) as unknown as CollapseApi;
}

/** The tabs' API with React props for each part. */
export type TabsApi = ZagTabsApi<PropTypes>;

/**
 * Tabs: a tablist with a roving tabindex, arrow keys that follow the
 * orientation and the text direction, and automatic or manual activation.
 * Triggers are `getTriggerProps({ value, disabled })`, panels
 * `getContentProps({ value })`.
 */
export function useTabs(options: TabsOptions = {}): TabsApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    tabs.machine,
    toTabsProps({ ...options, dir }, options.id ?? fallback),
  );
  const api = tabs.connect(service, normalize) as unknown as TabsApi;
  // With nothing selected, select the first enabled tab (as Alpine does), so
  // one trigger is in the Tab order; also once tabs that load late appear.
  useEffect(() => {
    if (api.value != null) return;
    const first = firstEnabledTab(api.getListProps().id as string | undefined);
    if (first !== undefined) api.setValue(first);
  });
  return api;
}
import { type ColorPickerOptions, toColorPickerProps } from '../core/color-picker-options';
import {
  colorPicker,
  type ColorPickerApi as CoreColorPickerApi,
  type ColorTextFormat,
  formatColor,
} from '../widgets/color-picker';

export type { ColorPickerOptions } from '../core/color-picker-options';
export {
  COLOR_FORMATS,
  COLOR_PICKER_LABELS,
  formatColor,
  parseColorText,
  parseColorValue,
  type ColorPickerLabels,
  type ColorTextFormat,
} from '../widgets/color-picker';

/** The color picker's API with React props for each part. */
export type ColorPickerApi = CoreColorPickerApi<PropTypes>;

/**
 * ColorPicker: a field with a text value, and a popover with a
 * saturation/brightness area, hue and opacity sliders, a format select, an
 * eyedropper and swatches. Values are text in the current format; the
 * format select changes it (uncontrolled unless `format` changes).
 */
export function useColorPicker(options: ColorPickerOptions = {}): ColorPickerApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const [format, setFormat] = useState<ColorTextFormat>(options.format ?? 'hex');
  useEffect(() => {
    if (options.format) setFormat(options.format);
  }, [options.format]);
  const reported = useMemo(
    () => ({ text: undefined as string | undefined, color: undefined as never }),
    [],
  );
  const service = useMachine(
    colorPicker.machine,
    toColorPickerProps(
      {
        ...options,
        dir,
        format,
        valueColor:
          options.value != null && options.value === reported.text ? reported.color : undefined,
        onValueChange: (details) => {
          reported.text = details.value;
          reported.color = details.color as never;
          options.onValueChange?.(details);
        },
        onFormatChange: ({ format: next }) => {
          setFormat(next);
          options.onFormatChange?.({ format: next });
          const current = service.context.get('value');
          const value = formatColor(current, next, options.alpha ?? true);
          reported.text = value;
          reported.color = current as never;
          options.onValueChange?.({ value, color: current });
        },
      },
      options.id ?? fallback,
    ) as never,
  );
  const api = colorPicker.connect(service, normalize) as unknown as ColorPickerApi;
  // React renders the text input uncontrolled: write the value's text,
  // except while someone is typing in it. The input is the one the caller
  // spread `getValueInputProps({ id })` on, whatever id it passed.
  const text = api.textValue;
  const inputId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (typeof document === 'undefined' || !inputId.current) return;
    const el = document.getElementById(inputId.current);
    if (el instanceof HTMLInputElement && el !== document.activeElement && el.value !== text) {
      el.value = text;
    }
  });
  return {
    ...api,
    getValueInputProps(props) {
      const { value, ...rest } = api.getValueInputProps(props) as Record<string, unknown>;
      inputId.current = rest.id as string | undefined;
      return { ...rest, defaultValue: value } as never;
    },
  };
}
import { type DatePickerOptions, toDatePickerProps } from '../core/date-picker-options';
import {
  datePicker,
  type DatePickerApi as CoreDatePickerApi,
  parseIso as parseIsoDate,
} from '../widgets/date-picker';

export type { DatePickerLabels, DatePickerOptions } from '../core/date-picker-options';
export {
  datePattern,
  formatDate,
  parseIso,
  timeOptions,
  toIso,
  type DatePickerMode,
  type DatePickerValue,
  type TimeOption,
} from '../widgets/date-picker';

/** The date picker's API with React props for each part, plus the time list's. */
export type DatePickerApi = CoreDatePickerApi<PropTypes>;

/**
 * DatePicker: a typed field and a calendar popover (`role=grid`), single
 * dates or a range, with a time list in time mode. Render `weeks` and
 * `weekDays` inside the table; values are ISO strings.
 */
export function useDatePicker(options: DatePickerOptions = {}): DatePickerApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    datePicker.machine,
    toDatePickerProps({ ...options, dir }, options.id ?? fallback),
  );
  const api = datePicker.connect(service, normalize) as unknown as DatePickerApi;
  // A value from outside (a reset, a parent) shows its month next time it opens.
  const first = Array.isArray(options.value) ? options.value[0] : options.value;
  useEffect(() => {
    const date = parseIsoDate(first);
    if (date && !service.state.matches('open')) service.send({ type: 'FOCUS.SET', value: date });
  }, [first, service]);
  return api;
}

export type {
  ComboboxOptions,
  ComboboxValue,
  DialogOptions,
  DropdownMenuOptions,
  MenuAlign,
  ToastGroupOptions,
} from '../core/options';
export type { ComboboxItem, LabelSegment } from '../widgets/combobox';
export {
  COMBOBOX_LABELS,
  createItem,
  filterItems,
  formatLabel,
  highlight,
} from '../widgets/combobox';
export {
  createToaster,
  staticToastParts,
  TOAST_ICONS,
  type Toaster,
  type ToasterOptions,
  type ToastOptions,
} from '../widgets/toast';

/** The dialog's API with React props for each part. */
export type DialogApi = ZagDialogApi<PropTypes>;

/** The combobox's API with React props for each part, plus the items to render. */
export type ComboboxApi = ZagComboboxApi<PropTypes, ComboboxItem> & {
  /** The items to render: those matching the typed text, or every item when remote. */
  items: ComboboxItem[];
  /** Props for the `empty` part, shown when no item matches. */
  getEmptyProps(): Attrs;
};

/** The dropdown menu's API with React props for each part. */
export type DropdownMenuApi = ZagMenuApi<PropTypes>;

/** One toast's API with React props for each part. */
export type ToastApi = CoreToastApi;

/** A toast as the region lists it: the props to pass to `useToast`. */
export type ToastEntry = Partial<ZagToastProps<string>>;

/** The region's API, plus the service each toast in it runs under. */
export interface ToasterApi {
  /** The toasts to render, newest first. */
  toasts: ToastEntry[];
  /** Props for the region (Zag's `group` part). */
  getGroupProps(options?: { label?: string }): Record<string, unknown>;
  /** Pass to `useToast` for each toast. */
  service: GroupService;
}

/** Zag's React `normalizeProps`, typed as the definitions' `connect()` takes it. */
const normalize = normalizeProps as unknown as Normalize;

/** Dialog: focus trap, Escape and outside-click dismissal, scroll lock and focus return. */
export function useDialog(options: DialogOptions = {}): DialogApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    dialog.machine,
    toDialogProps({ ...options, dir }, options.id ?? fallback),
  );
  return dialog.connect(service, normalize) as unknown as DialogApi;
}

/**
 * Combobox: `role=combobox` with a filtered, positioned listbox. Render
 * `items` (not `options.items`) inside the content part, so local filtering
 * shows only the matches.
 */
export function useCombobox(options: ComboboxOptions): ComboboxApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  // The typed text the items are filtered by; a default input value starts it.
  const [query, setQuery] = useState(options.defaultInputValue ?? '');
  // The value while uncontrolled; the machine always runs controlled.
  const [ownValue, setOwnValue] = useState(() => toValueArray(options.defaultValue));
  const local = { value: ownValue, set: setOwnValue };
  const { items: all, remote, allowCreate, max, multiple } = options;
  const valueKey = JSON.stringify(currentValue(options, local));
  const items = useMemo(
    () =>
      visibleItems(
        { items: all, remote, allowCreate, max, multiple },
        query,
        JSON.parse(valueKey) as string[],
      ),
    [all, remote, allowCreate, max, multiple, query, valueKey],
  );
  const service = useMachine(
    combobox.machine,
    toComboboxProps({ ...options, dir }, options.id ?? fallback, items, setQuery, local),
  );
  const api = combobox.connect(service, normalize) as unknown as ZagComboboxApi<
    PropTypes,
    ComboboxItem
  >;
  return { ...api, items, getEmptyProps: () => emptyProps(items) };
}

/**
 * DropdownMenu: `role=menu` with arrow keys, typeahead and dismissal. Items
 * are `getItemProps({ value })`; checkbox and radio items are
 * `getOptionItemProps({ type, value, checked, onCheckedChange })`.
 */
export function useDropdownMenu(options: DropdownMenuOptions = {}): DropdownMenuApi {
  const fallback = useId();
  const dir = useDirection(options.dir, options.id ?? fallback, options.ids);
  const service = useMachine(
    dropdownMenu.machine,
    toDropdownMenuProps({ ...options, dir }, options.id ?? fallback),
  );
  return dropdownMenu.connect(service, normalize) as unknown as DropdownMenuApi;
}

/**
 * The toast region: renders a toaster's toasts. Spread `getGroupProps()` on
 * the region and render each of `toasts` with `useToast(toast, service, index)`.
 */
export function useToaster(options: ToastGroupOptions): ToasterApi {
  const fallback = useId();
  // The region is fixed to a corner of the viewport, one per placement for
  // the page, so it follows `<html dir>`, not the element it's rendered in.
  const service = useMachine(
    toastGroup.machine,
    toToastGroupProps(options, options.id ?? fallback),
  );
  const api = toastGroup.connect(service, normalize);
  return {
    toasts: api.getToasts() as ToastEntry[],
    getGroupProps: (groupOptions) => api.getGroupProps(groupOptions) as Record<string, unknown>,
    service: service as unknown as GroupService,
  };
}

/** One toast in a region: its timer, Escape, and the action and close triggers. */
export function useToast(entry: ToastEntry, parent: GroupService, index: number): ToastApi {
  const service = useMachine(toast.machine, { ...entry, parent, index } as never);
  return toast.connect(service, normalize) as unknown as ToastApi;
}

export { useSpotlight, type SpotlightApi, type SpotlightOptions } from './spotlight';
export type { SpotlightExtras } from '../core/spotlight-options';
export { highlightLabel, type SpotlightLabelSegment } from '../widgets/spotlight';
export type {
  SpotlightGroup,
  SpotlightItem,
  SpotlightEntry,
  SpotlightResultGroup,
} from '../widgets/spotlight';
export {
  tooltipKeys,
  useDrawer,
  usePopover,
  useTooltip,
  type DrawerApi,
  type DrawerOptions,
  type DrawerSide,
  type OverlayPlacement,
  type PopoverApi,
  type PopoverIds,
  type PopoverOptions,
  type TooltipApi,
  type TooltipIds,
  type TooltipOptions,
} from './overlays';

export { useCarousel, useLightbox, type CarouselApi, type LightboxApi } from './images';
export {
  CAROUSEL_LABELS,
  carouselPageCount,
  carouselSlidesPerPage,
  formatCarouselLabel,
  type CarouselLabels,
  type CarouselOptions,
} from '../widgets/carousel';
export {
  LIGHTBOX_LABELS,
  lightboxCounter,
  lightboxLabels,
  type LightboxLabels,
  type LightboxOptions,
} from '../widgets/lightbox';
export {
  useApplePlatform,
  useClipboard,
  type UseClipboardOptions,
  type UseClipboardResult,
} from './clipboard';
export {
  CLIPBOARD_LABELS,
  CLIPBOARD_TIMEOUT,
  clipboardLabel,
  clipboardMessage,
  type ClipboardLabels,
  type ClipboardStatus,
} from '../widgets/clipboard';

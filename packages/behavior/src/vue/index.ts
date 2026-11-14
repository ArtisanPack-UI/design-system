/**
 * The Vue adapter (#36). Each composable runs a widget definition's machine
 * and `connect()` through Zag's Vue adapter, so parts, ARIA, `data-scope` and
 * `data-part` match the Alpine adapter exactly. Bind a part's props to its
 * element:
 *
 *   const dialog = useDialog(() => ({
 *     open: props.open,
 *     onOpenChange: ({ open }) => emit('update:open', open),
 *   }));
 *   <button v-bind="dialog.getTriggerProps()">Edit</button>
 *
 * Options are a plain object, a ref or a getter, so they can follow props.
 * State is controlled (`open`, `value`, which is how `v-model:open` and
 * `v-model` map onto it) or uncontrolled (`defaultOpen`, `defaultValue`).
 */
import type { Api as ZagComboboxApi } from '@zag-js/combobox';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import type { Api as ZagMenuApi } from '@zag-js/menu';
import type { GroupService, Props as ZagToastProps } from '@zag-js/toast';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/vue';
import { computed, type ComputedRef, type MaybeRefOrGetter, ref, toValue, useId, watch } from 'vue';

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
import { onMounted, onUpdated } from 'vue';

export type { TabsActivationMode, TabsIds, TabsOptions, TabsOrientation } from '../widgets/tabs';

import type { Api as ZagAccordionApi } from '@zag-js/accordion';
import type { Api as ZagCollapsibleApi } from '@zag-js/collapsible';
import { accordion, type AccordionOptions, toAccordionProps } from '../widgets/accordion';
import { collapse, type CollapseOptions, toCollapseProps } from '../widgets/collapse';

export type { AccordionIds, AccordionOptions } from '../widgets/accordion';
export type { CollapseIds, CollapseOptions, CollapseVariant } from '../widgets/collapse';

/** The accordion's API with Vue props for each part. */
export type AccordionApi = ZagAccordionApi<PropTypes>;

/**
 * Accordion: triggers in headings that open and close their panels, one at
 * a time or several with `multiple`. Options are an object, a ref or a
 * getter, so `value` can follow `v-model`. Items are
 * `getItemProps({ value })`, triggers `getItemTriggerProps({ value, disabled })`
 * (rendered as `trigger`), chevrons `getItemIndicatorProps` (`chevron`) and
 * panels `getItemContentProps` (`content`).
 */
export function useAccordion(
  options: MaybeRefOrGetter<AccordionOptions> = {},
): ComputedRef<AccordionApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: current.ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toAccordionProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(accordion.machine, props);
  return computed(
    () => accordion.connect(service, normalizeProps as never) as unknown as AccordionApi,
  );
}

/** The collapse's API with Vue props for each part. */
export type CollapseApi = ZagCollapsibleApi<PropTypes>;

/**
 * Collapse: a trigger that shows and hides one region, or clamps it with
 * `variant: 'read-more'`. Options are an object, a ref or a getter, so
 * `open` can follow `v-model:open`. Parts are `getRootProps`,
 * `getTriggerProps`, `getIndicatorProps` (rendered as `icon`) and
 * `getContentProps`.
 */
export function useCollapse(
  options: MaybeRefOrGetter<CollapseOptions> = {},
): ComputedRef<CollapseApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: current.ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toCollapseProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(collapse.machine, props);
  return computed(
    () => collapse.connect(service, normalizeProps as never) as unknown as CollapseApi,
  );
}

/** The tabs' API with Vue props for each part. */
export type TabsApi = ZagTabsApi<PropTypes>;

/**
 * Tabs: a tablist with a roving tabindex, arrow keys that follow the
 * orientation and the text direction, and automatic or manual activation.
 * Options are an object, a ref or a getter, so `value` can follow a prop
 * (`v-model`). Triggers are `getTriggerProps({ value, disabled })`, panels
 * `getContentProps({ value })`.
 */
export function useTabs(options: MaybeRefOrGetter<TabsOptions> = {}): ComputedRef<TabsApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: (current as { ids?: unknown }).ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toTabsProps({ ...current, dir: current.dir ?? measured.value }, current.id ?? fallback);
  });
  const service = useMachine(tabs.machine, props);
  const api = computed(() => tabs.connect(service, normalizeProps as never) as unknown as TabsApi);
  // With nothing selected, select the first enabled tab (as Alpine does), so
  // one trigger is in the Tab order; also once tabs that load late appear.
  const selectFirst = () => {
    if (api.value.value != null) return;
    const first = firstEnabledTab(api.value.getListProps().id as string | undefined);
    if (first !== undefined) api.value.setValue(first);
  };
  onMounted(selectFirst);
  onUpdated(selectFirst);
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

/** The color picker's API with Vue props for each part. */
export type ColorPickerApi = CoreColorPickerApi<PropTypes>;

/**
 * ColorPicker: a field with a text value, and a popover with a
 * saturation/brightness area, hue and opacity sliders, a format select, an
 * eyedropper and swatches. Options are an object, a ref or a getter, so
 * `value` can follow `v-model`. The format select changes the format
 * (uncontrolled unless `format` changes).
 */
export function useColorPicker(
  options: MaybeRefOrGetter<ColorPickerOptions> = {},
): ComputedRef<ColorPickerApi> {
  const fallback = useId();
  const format = ref<ColorTextFormat>(toValue(options).format ?? 'hex');
  watch(
    () => toValue(options).format,
    (next) => {
      if (next) format.value = next;
    },
  );
  const machine: { service?: ReturnType<typeof useMachine> } = {};
  const reported: { text?: string; color?: never } = {};
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: (current as { ids?: unknown }).ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toColorPickerProps(
      {
        ...current,
        dir: current.dir ?? measured.value,
        format: format.value,
        valueColor:
          current.value != null && current.value === reported.text ? reported.color : undefined,
        onValueChange: (details) => {
          reported.text = details.value;
          reported.color = details.color as never;
          current.onValueChange?.(details);
        },
        onFormatChange: ({ format: next }) => {
          format.value = next;
          current.onFormatChange?.({ format: next });
          const color = machine.service?.context.get('value' as never) as never;
          if (color) {
            const value = formatColor(color, next, current.alpha ?? true);
            reported.text = value;
            reported.color = color;
            current.onValueChange?.({ value, color });
          }
        },
      },
      current.id ?? fallback,
    );
  });
  const service = useMachine(colorPicker.machine as never, props as never);
  machine.service = service;
  return computed(
    () => colorPicker.connect(service as never, normalize) as unknown as ColorPickerApi,
  );
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

/** The date picker's API with Vue props for each part, plus the time list's. */
export type DatePickerApi = CoreDatePickerApi<PropTypes>;

/**
 * DatePicker: a typed field and a calendar popover (`role=grid`), single
 * dates or a range, with a time list in time mode. Render `weeks` and
 * `weekDays` inside the table; values are ISO strings.
 */
export function useDatePicker(
  options: MaybeRefOrGetter<DatePickerOptions> = {},
): ComputedRef<DatePickerApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: (current as { ids?: unknown }).ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toDatePickerProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(datePicker.machine, props);
  // A value from outside (a reset, a parent) shows its month next time it opens.
  watch(
    () => {
      const value = toValue(options).value;
      return Array.isArray(value) ? value[0] : value;
    },
    (first) => {
      const date = parseIsoDate(first);
      if (date && !service.state.matches('open')) service.send({ type: 'FOCUS.SET', value: date });
    },
  );
  return computed(() => datePicker.connect(service, normalize) as unknown as DatePickerApi);
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

/** The dialog's API with Vue props for each part. */
export type DialogApi = ZagDialogApi<PropTypes>;

/** The combobox's API with Vue props for each part, plus the items to render. */
export type ComboboxApi = ZagComboboxApi<PropTypes, ComboboxItem> & {
  /** The items to render: those matching the typed text, or every item when remote. */
  items: ComboboxItem[];
  /** Props for the `empty` part, shown when no item matches. */
  getEmptyProps(): Attrs;
};

/** The dropdown menu's API with Vue props for each part. */
export type DropdownMenuApi = ZagMenuApi<PropTypes>;

/** One toast's API with Vue props for each part. */
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

/** Zag's Vue `normalizeProps`, typed as the definitions' `connect()` takes it. */
const normalize = normalizeProps as unknown as Normalize;

/** Dialog: focus trap, Escape and outside-click dismissal, scroll lock and focus return. */
export function useDialog(options: MaybeRefOrGetter<DialogOptions> = {}): ComputedRef<DialogApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: (current as { ids?: unknown }).ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toDialogProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(dialog.machine, props);
  return computed(() => dialog.connect(service, normalize) as unknown as DialogApi);
}

/**
 * Combobox: `role=combobox` with a filtered, positioned listbox. Render
 * `items` (not `options.items`) inside the content part, so local filtering
 * shows only the matches.
 */
export function useCombobox(options: MaybeRefOrGetter<ComboboxOptions>): ComputedRef<ComboboxApi> {
  const fallback = useId();
  // The typed text the items are filtered by; a default input value starts it.
  const query = ref(toValue(options).defaultInputValue ?? '');
  const setQuery = (next: string) => (query.value = next);
  // The value while uncontrolled; the machine always runs controlled.
  const ownValue = ref<string[]>(toValueArray(toValue(options).defaultValue));
  const local = {
    get value() {
      return ownValue.value;
    },
    set: (next: string[]) => (ownValue.value = next),
  };
  const items = computed(() => {
    const current = toValue(options);
    return visibleItems(current, query.value, currentValue(current, local) ?? []);
  });
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: (current as { ids?: unknown }).ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toComboboxProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
      items.value,
      setQuery,
      local,
    );
  });
  const service = useMachine(combobox.machine, props);
  return computed(() => {
    const api = combobox.connect(service, normalize) as unknown as ZagComboboxApi<
      PropTypes,
      ComboboxItem
    >;
    const visible = items.value;
    return { ...api, items: visible, getEmptyProps: () => emptyProps(visible) };
  });
}

/**
 * DropdownMenu: `role=menu` with arrow keys, typeahead and dismissal. Items
 * are `getItemProps({ value })`; checkbox and radio items are
 * `getOptionItemProps({ type, value, checked, onCheckedChange })`.
 */
export function useDropdownMenu(
  options: MaybeRefOrGetter<DropdownMenuOptions> = {},
): ComputedRef<DropdownMenuApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: (current as { ids?: unknown }).ids };
  });
  const props = computed(() => {
    const current = toValue(options);
    return toDropdownMenuProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(dropdownMenu.machine, props);
  return computed(() => dropdownMenu.connect(service, normalize) as unknown as DropdownMenuApi);
}

/**
 * The toast region: renders a toaster's toasts. Bind `getGroupProps()` to
 * the region and render each of `toasts` with `useToast(toast, service, index)`.
 */
export function useToaster(options: MaybeRefOrGetter<ToastGroupOptions>): ComputedRef<ToasterApi> {
  const fallback = useId();
  // The region is fixed to a corner of the viewport, one per placement for
  // the page, so it follows `<html dir>`, not the element it's rendered in.
  const props = computed(() => {
    const current = toValue(options);
    return toToastGroupProps(current, current.id ?? fallback);
  });
  const service = useMachine(toastGroup.machine, props);
  return computed(() => {
    const api = toastGroup.connect(service, normalize);
    return {
      toasts: api.getToasts() as ToastEntry[],
      getGroupProps: (groupOptions?: { label?: string }) =>
        api.getGroupProps(groupOptions) as Record<string, unknown>,
      service: service as unknown as GroupService,
    };
  });
}

/** One toast in a region: its timer, Escape, and the action and close triggers. */
export function useToast(
  entry: MaybeRefOrGetter<ToastEntry>,
  parent: GroupService,
  index: MaybeRefOrGetter<number>,
): ComputedRef<ToastApi> {
  const props = computed(() => ({ ...toValue(entry), parent, index: toValue(index) }) as never);
  const service = useMachine(toast.machine, props);
  return computed(() => toast.connect(service, normalize) as unknown as ToastApi);
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

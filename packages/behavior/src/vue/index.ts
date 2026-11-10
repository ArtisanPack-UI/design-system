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
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/vue';
import { computed, type ComputedRef, type MaybeRefOrGetter, ref, toValue, useId } from 'vue';

import {
  type ComboboxOptions,
  type DialogOptions,
  emptyProps,
  toComboboxProps,
  toDialogProps,
  visibleItems,
} from '../core/options';
import type { Attrs } from '../core/props';
import type { Normalize } from '../core/widget';
import { combobox, type ComboboxItem } from '../widgets/combobox';
import { dialog } from '../widgets/dialog';

export type { ComboboxOptions, ComboboxValue, DialogOptions } from '../core/options';
export type { ComboboxItem } from '../widgets/combobox';

/** The dialog's API with Vue props for each part. */
export type DialogApi = ZagDialogApi<PropTypes>;

/** The combobox's API with Vue props for each part, plus the items to render. */
export type ComboboxApi = ZagComboboxApi<PropTypes, ComboboxItem> & {
  /** The items to render: those matching the typed text, or every item when remote. */
  items: ComboboxItem[];
  /** Props for the `empty` part, shown when no item matches. */
  getEmptyProps(): Attrs;
};

/** Zag's Vue `normalizeProps`, typed as the definitions' `connect()` takes it. */
const normalize = normalizeProps as unknown as Normalize;

/** Dialog: focus trap, Escape and outside-click dismissal, scroll lock and focus return. */
export function useDialog(options: MaybeRefOrGetter<DialogOptions> = {}): ComputedRef<DialogApi> {
  const fallback = useId();
  const props = computed(() => {
    const current = toValue(options);
    return toDialogProps(current, current.id ?? fallback);
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
  const query = ref('');
  const setQuery = (next: string) => (query.value = next);
  const items = computed(() => visibleItems(toValue(options), query.value));
  const props = computed(() => {
    const current = toValue(options);
    return toComboboxProps(current, current.id ?? fallback, items.value, setQuery);
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

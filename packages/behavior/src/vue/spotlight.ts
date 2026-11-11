/**
 * `useSpotlight` (#57): the command palette's dialog and combobox machines
 * through Zag's Vue adapter. Options are a plain object, a ref or a getter;
 * bind each part's props to its element:
 *
 *   const spotlight = useSpotlight(() => ({ groups: props.groups, open: props.open, … }));
 *   <div v-bind="spotlight.getContentProps()" class="apui-spotlight">
 */
import type { Api as ZagComboboxApi } from '@zag-js/combobox';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/vue';
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  useId,
  watch,
} from 'vue';

import type { Attrs } from '../core/props';
import { chosenItem, type SpotlightExtras, type SpotlightOptions } from '../core/spotlight-options';
import type { Normalize } from '../core/widget';
import {
  flattenGroups,
  isApplePlatform,
  matchesShortcut,
  readRecents,
  recentKey,
  rememberRecent,
  shortcutAria,
  shortcutKeys,
  SPOTLIGHT_DEFAULTS,
  spotlightDialog,
  spotlightDialogProps,
  type SpotlightEntry,
  type SpotlightItem,
  type SpotlightOption,
  spotlightPart,
  spotlightSearch,
  spotlightSearchProps,
  staticPart,
  visibleGroups,
} from '../widgets/spotlight';

export type { SpotlightOptions } from '../core/spotlight-options';

type Props = Record<string, unknown>;

/** The palette's API with Vue props for each part. */
export interface SpotlightApi extends SpotlightExtras {
  getTriggerProps(): Props;
  getBackdropProps(): Props;
  getPositionerProps(): Props;
  getContentProps(): Props;
  getCloseTriggerProps(): Props;
  getSearchProps(): Props;
  getQueryProps(): Props;
  getResultsProps(): Props;
  getItemGroupProps(group: { id: string }): Props;
  getItemGroupLabelProps(group: { htmlFor: string }): Props;
  getItemProps(props: { item: SpotlightEntry }): Props;
  getItemTextProps(props: { item: SpotlightEntry }): Props;
}

const normalize = normalizeProps as unknown as Normalize;

const option = (item: SpotlightEntry): SpotlightOption => ({
  value: item.value,
  label: item.label,
  disabled: item.disabled,
});

/**
 * Spotlight: a command palette. A modal dialog holding a combobox whose
 * listbox of grouped results is always open; the shortcut toggles it.
 * Render `groups` from the API: they're filtered by every word of the query,
 * with recent choices first while it's empty.
 */
export function useSpotlight(
  options: MaybeRefOrGetter<SpotlightOptions>,
): ComputedRef<SpotlightApi> {
  const fallback = useId();
  const current = () => toValue(options);
  const typed = ref(current().defaultSearch ?? '');
  const recents = shallowRef<SpotlightItem[]>([]);
  const apple = ref(false);
  let chosen = false;

  const id = () => current().id ?? fallback;
  const storage = () => recentKey(current().id ?? 'spotlight');
  const showRecents = () => current().recent ?? false;
  const shortcut = () => current().shortcut ?? SPOTLIGHT_DEFAULTS.shortcut;
  const query = computed(() => current().search ?? typed.value);

  const groups = computed(() =>
    visibleGroups(current().groups, query.value, {
      remote: current().remote,
      recents: showRecents() ? recents.value : [],
      recentLabel: current().recentLabel,
    }),
  );
  const entries = computed(() => flattenGroups(groups.value).map(option));

  const dialogService = useMachine(
    spotlightDialog.machine,
    computed(() => {
      const o = current();
      return spotlightDialogProps({
        id: id(),
        ids: o.ids,
        open: o.open,
        defaultOpen: o.defaultOpen,
        modal: o.modal,
        label: o.label,
        dir: o.dir,
        onOpenChange: (open) => current().onOpenChange?.(open),
      });
    }),
  );
  const dialogApi = computed(
    () => spotlightDialog.connect(dialogService, normalize) as unknown as ZagDialogApi<PropTypes>,
  );

  const searchService = useMachine(
    spotlightSearch.machine,
    computed(() => {
      const o = current();
      return spotlightSearchProps({
        id: id(),
        ids: o.ids,
        open: dialogApi.value.open,
        entries: entries.value,
        inputValue: o.search,
        defaultInputValue: o.defaultSearch,
        loading: o.loading,
        dir: o.dir,
        translations: o.translations,
        onInputValueChange: (inputValue, reason) => {
          typed.value = inputValue;
          if (reason === 'input-change') current().onSearchChange?.(inputValue);
        },
        onSelect: (value) => {
          if (chosen) return;
          const item = chosenItem(groups.value, value);
          if (!item) return;
          chosen = true;
          if (showRecents()) recents.value = rememberRecent(storage(), item, recents.value);
          current().onSelect?.(item);
          dialogApi.value.setOpen(false);
        },
      });
    }),
  );
  const searchApi = computed(
    () =>
      spotlightSearch.connect(searchService, normalize) as unknown as ZagComboboxApi<
        PropTypes,
        SpotlightOption
      >,
  );

  // Opening: a fresh choice, and the first result active. Closing: an empty query.
  watch(
    () => dialogApi.value.open,
    (open) => {
      if (open) {
        chosen = false;
        // Not while rendering on the server: the client activates it after hydrating.
        if (typeof requestAnimationFrame === 'undefined') return;
        requestAnimationFrame(() => {
          const first = entries.value.find((entry) => !entry.disabled);
          if (searchApi.value.highlightedValue == null && first) {
            searchApi.value.setHighlightValue(first.value);
          }
        });
        return;
      }
      const o = current();
      if (o.search !== undefined) {
        if (o.search !== '') o.onSearchChange?.('');
      } else if (searchApi.value.inputValue !== '') {
        searchApi.value.setInputValue('', 'script');
      }
    },
    // Rendered open, the first result is active too, as in React and Alpine.
    { immediate: true },
  );

  const onKeydown = (event: KeyboardEvent) => {
    if (!matchesShortcut(event, shortcut())) return;
    event.preventDefault();
    dialogApi.value.setOpen(!dialogApi.value.open);
  };
  // Stored recents and the platform's keys are read after mount, so the
  // server's render and hydration match.
  onMounted(() => {
    apple.value = isApplePlatform();
    if (showRecents()) recents.value = readRecents(storage());
    window.addEventListener('keydown', onKeydown);
  });
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

  const part = (name: string, props: unknown) => spotlightPart(name, props as Props);

  return computed(() => {
    const dialog = dialogApi.value;
    const search = searchApi.value;
    const loading = Boolean(current().loading);
    const count = entries.value.length;
    return {
      open: dialog.open,
      setOpen: (next: boolean) => dialog.setOpen(next),
      query: query.value,
      groups: groups.value,
      shortcutKeys: shortcutKeys(shortcut(), apple.value),
      ariaKeyShortcuts: shortcutAria(shortcut()),
      getTriggerProps: () => part('trigger', dialog.getTriggerProps()),
      getBackdropProps: () => part('backdrop', dialog.getBackdropProps()),
      getPositionerProps: () => part('positioner', dialog.getPositionerProps()),
      getContentProps: () => part('content', dialog.getContentProps()),
      getCloseTriggerProps: () => part('closeTrigger', dialog.getCloseTriggerProps()),
      getSearchProps: () => part('search', search.getControlProps()),
      getQueryProps: () => part('query', search.getInputProps()),
      getResultsProps: () => part('results', search.getContentProps()),
      getItemGroupProps: ({ id: group }: { id: string }) =>
        part('itemGroup', search.getItemGroupProps({ id: group })),
      getItemGroupLabelProps: ({ htmlFor }: { htmlFor: string }) =>
        part('itemGroupLabel', search.getItemGroupLabelProps({ htmlFor })),
      getItemProps: ({ item }: { item: SpotlightEntry }) =>
        part('item', search.getItemProps({ item: option(item) })),
      getItemTextProps: ({ item }: { item: SpotlightEntry }) =>
        part('itemText', search.getItemTextProps({ item: option(item) })),
      getEmptyProps: (): Attrs => staticPart('empty', count > 0 || loading),
      getLoadingProps: (): Attrs => staticPart('loading', !loading),
    };
  });
}

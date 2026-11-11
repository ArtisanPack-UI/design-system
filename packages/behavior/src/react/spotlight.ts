/**
 * `useSpotlight` (#57): the command palette's dialog and combobox machines
 * through Zag's React adapter. Spread each part's props onto its element:
 *
 *   const spotlight = useSpotlight({ groups, onSelect: (item) => go(item) });
 *   <div {...spotlight.getContentProps()} className="apui-spotlight">
 *     <input {...spotlight.getQueryProps()} aria-label="Search" />
 *     <div {...spotlight.getResultsProps()} aria-label="Search">
 *       {spotlight.groups.map((group) => …spotlight.getItemProps({ item }))}
 */
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react';
import type { Api as ZagComboboxApi } from '@zag-js/combobox';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

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

/** The palette's API with React props for each part. */
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
 * Render `groups` (not the groups you passed): they're filtered by every word
 * of the query, with recent choices first while it's empty.
 */
export function useSpotlight(options: SpotlightOptions): SpotlightApi {
  const fallback = useId();
  const id = options.id ?? fallback;
  const shortcut = options.shortcut ?? SPOTLIGHT_DEFAULTS.shortcut;
  const showRecents = options.recent ?? false;
  const storage = recentKey(options.id ?? 'spotlight');

  const [typed, setTyped] = useState(options.defaultSearch ?? '');
  const query = options.search ?? typed;
  const [recents, setRecents] = useState<SpotlightItem[]>([]);
  const [keys, setKeys] = useState(() => shortcutKeys(shortcut));
  const chosen = useRef(false);

  // Stored recents and the platform's keys are read after mount, so the
  // server's render and the first client render match.
  useEffect(() => {
    if (showRecents) setRecents(readRecents(storage));
  }, [showRecents, storage]);
  useEffect(() => setKeys(shortcutKeys(shortcut, isApplePlatform())), [shortcut]);

  const groups = useMemo(
    () =>
      visibleGroups(options.groups, query, {
        remote: options.remote,
        recents: showRecents ? recents : [],
        recentLabel: options.recentLabel,
      }),
    [options.groups, query, options.remote, showRecents, recents, options.recentLabel],
  );
  const entries = useMemo(() => flattenGroups(groups).map(option), [groups]);

  const dialogService = useMachine(
    spotlightDialog.machine,
    spotlightDialogProps({
      id,
      ids: options.ids,
      open: options.open,
      defaultOpen: options.defaultOpen,
      modal: options.modal,
      label: options.label,
      dir: options.dir,
      onOpenChange: (open) => options.onOpenChange?.(open),
    }),
  );
  const dialogApi = spotlightDialog.connect(
    dialogService,
    normalize,
  ) as unknown as ZagDialogApi<PropTypes>;
  const open = dialogApi.open;

  const latest = useRef({ groups, dialogApi });
  latest.current = { groups, dialogApi };

  const searchService = useMachine(
    spotlightSearch.machine,
    spotlightSearchProps({
      id,
      ids: options.ids,
      open,
      entries,
      inputValue: options.search,
      defaultInputValue: options.defaultSearch,
      loading: options.loading,
      dir: options.dir,
      translations: options.translations,
      onInputValueChange: (inputValue, reason) => {
        setTyped(inputValue);
        if (reason === 'input-change') options.onSearchChange?.(inputValue);
      },
      onSelect: (value) => {
        if (chosen.current) return;
        const item = chosenItem(latest.current.groups, value);
        if (!item) return;
        chosen.current = true;
        if (showRecents) setRecents((current) => rememberRecent(storage, item, current));
        options.onSelect?.(item);
        latest.current.dialogApi.setOpen(false);
      },
    }),
  );
  const searchApi = spotlightSearch.connect(searchService, normalize) as unknown as ZagComboboxApi<
    PropTypes,
    SpotlightOption
  >;
  const searchRef = useRef(searchApi);
  searchRef.current = searchApi;

  // Opening: a fresh choice, and the first result active. Closing: an empty query.
  useEffect(() => {
    if (open) {
      chosen.current = false;
      const frame = requestAnimationFrame(() => {
        const api = searchRef.current;
        const first = latest.current.groups.flatMap((g) => g.items).find((i) => !i.disabled);
        if (api.highlightedValue == null && first) api.setHighlightValue(first.value);
      });
      return () => cancelAnimationFrame(frame);
    }
    if (options.search !== undefined) {
      if (options.search !== '') options.onSearchChange?.('');
    } else if (searchRef.current.inputValue !== '') {
      searchRef.current.setInputValue('', 'script');
    }
    return undefined;
    // Only on open and close.
  }, [open]);

  useEffect(() => {
    if (!shortcut) return undefined;
    const onKeydown = (event: KeyboardEvent) => {
      if (!matchesShortcut(event, shortcut)) return;
      event.preventDefault();
      const api = latest.current.dialogApi;
      api.setOpen(!api.open);
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [shortcut]);

  const part = (name: string, props: unknown) => spotlightPart(name, props as Props);
  const loading = Boolean(options.loading);

  return {
    open,
    setOpen: (next) => dialogApi.setOpen(next),
    query,
    groups,
    shortcutKeys: keys,
    ariaKeyShortcuts: shortcutAria(shortcut),
    getTriggerProps: () => part('trigger', dialogApi.getTriggerProps()),
    getBackdropProps: () => part('backdrop', dialogApi.getBackdropProps()),
    getPositionerProps: () => part('positioner', dialogApi.getPositionerProps()),
    getContentProps: () => part('content', dialogApi.getContentProps()),
    getCloseTriggerProps: () => part('closeTrigger', dialogApi.getCloseTriggerProps()),
    getSearchProps: () => part('search', searchApi.getControlProps()),
    getQueryProps: () => part('query', searchApi.getInputProps()),
    getResultsProps: () => part('results', searchApi.getContentProps()),
    getItemGroupProps: ({ id: group }) =>
      part('itemGroup', searchApi.getItemGroupProps({ id: group })),
    getItemGroupLabelProps: ({ htmlFor }) =>
      part('itemGroupLabel', searchApi.getItemGroupLabelProps({ htmlFor })),
    getItemProps: ({ item }) => part('item', searchApi.getItemProps({ item: option(item) })),
    getItemTextProps: ({ item }) =>
      part('itemText', searchApi.getItemTextProps({ item: option(item) })),
    getEmptyProps: (): Attrs => staticPart('empty', entries.length > 0 || loading),
    getLoadingProps: (): Attrs => staticPart('loading', !loading),
  };
}

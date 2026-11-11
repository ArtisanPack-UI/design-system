/**
 * The `apuiSpotlight` Alpine component (#57): a command palette on the dialog
 * and combobox machines (see `widgets/spotlight.ts`). One `x-data` runs both;
 * each `x-apui:<part>` goes to the machine that owns it:
 *
 *   <div x-data="apuiSpotlight({ shortcut: 'mod+k' })">
 *     <button id="s-trigger" x-apui:trigger>Search</button>
 *     <template x-teleport="body">
 *       <div>
 *         <div id="s-backdrop" x-apui:backdrop></div>
 *         <div id="s-positioner" x-apui:positioner>
 *           <div id="s-content" x-apui:content class="apui-spotlight">
 *             <div id="s-search" x-apui:search>
 *               <input id="s-query" x-apui:query aria-label="Search">
 *               <button id="s-close" x-apui:close-trigger aria-label="Close">Esc</button>
 *             </div>
 *             <div id="s-results" x-apui:results aria-label="Search">
 *               <div id="s-pages" x-apui:item-group="{ id: 'pages' }">
 *                 <div id="s-pages-label" x-apui:item-group-label="{ htmlFor: 'pages' }">Pages</div>
 *                 <a href="/reports" wire:key="reports" x-apui:item="{ value: 'reports', label: 'Reports' }">
 *                   <span x-apui:item-text>Reports</span>
 *                 </a>
 *               </div>
 *               <div id="s-empty" x-apui:empty>No results.</div>
 *             </div>
 *           </div>
 *         </div>
 *       </div>
 *     </template>
 *   </div>
 *
 * Items are filtered as you type, by every word of the query against their
 * label, description and keywords. With `remote`, the server filters: typing
 * updates the entangled `search` and the server renders the results. With
 * `url`, the component fetches `url?search=…` and renders the JSON it returns
 * through `clientGroups('remote')`. Recent choices are kept in localStorage and
 * shown first while the query is empty (`clientGroups('recent')`).
 */
import type { Attrs } from '../core/props';
import { createWidget, type Widget } from '../core/widget';
import { iconSvg } from '../icons';
import {
  findEntry,
  highlightLabel,
  isApplePlatform,
  itemShortcutKeys,
  matchesQuery,
  matchesShortcut,
  normalizeGroups,
  readRecents,
  recentKey,
  rememberRecent,
  selectedItem,
  shortcutKeys,
  SPOTLIGHT_DEFAULTS,
  SPOTLIGHT_DIALOG_PARTS,
  SPOTLIGHT_SEARCH_PARTS,
  spotlightDialog,
  spotlightDialogProps,
  type SpotlightEntry,
  type SpotlightIds,
  type SpotlightDialogApi,
  type SpotlightDialogProps,
  type SpotlightItem,
  type SpotlightOption,
  spotlightCollection,
  spotlightPart,
  type SpotlightResultGroup,
  spotlightSearch,
  type SpotlightSearchApi,
  type SpotlightSearchProps,
  spotlightSearchProps,
  type SpotlightTranslations,
  staticPart,
  withRecents,
} from '../widgets/spotlight';

type PartArgs = Record<string, unknown> | undefined;

export interface SpotlightAlpineOptions {
  /** Machine id. Defaults to an Alpine `$id`; also keys the recent items. */
  id?: string;
  /** Initial or entangled open state. */
  open?: boolean;
  /** Initial or entangled query text. With `remote`, the server searches on it. */
  search?: string;
  /** Traps focus, locks scroll and hides the page. Default true. */
  modal?: boolean;
  /** The panel's accessible name. */
  label?: string;
  /** The global shortcut, such as `mod+k`. Empty disables it. */
  shortcut?: string;
  /** Show recent choices (kept in localStorage) while the query is empty. Default false. */
  recent?: boolean;
  recentLabel?: string;
  /** The server renders the matching items: don't filter them here. */
  remote?: boolean;
  /** Fetch results from `url?search=…` as you type. */
  url?: string;
  /** Show the loading state. The `url` search sets it while it waits. */
  loading?: boolean;
  /** Live-region strings: the results count, no results and loading. */
  translations?: SpotlightTranslations;
}

/** The magics the component's methods use. */
interface AlpineMagics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
  $nextTick(callback: () => void): void;
}

interface State extends AlpineMagics {
  open: boolean;
  search: string;
  query: string;
  loading: boolean;
  fetching: boolean;
  keys: string[];
  recents: SpotlightItem[];
  remoteGroups: SpotlightResultGroup[];
}

/** `close-trigger` → `closeTrigger`. */
const camel = (part: string) => part.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Dispatches a bubbling custom event, as the vocabulary names Livewire and Alpine events. */
function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** The machine props a getter builds, as a Spotlight part. */
function machinePart(api: object, getter: string, part: string, args: PartArgs): Attrs {
  const build = (api as Record<string, unknown>)[getter];
  if (typeof build !== 'function') throw new Error(`[apui] spotlight has no part "${part}"`);
  return spotlightPart(part, build(args) as Attrs);
}

/**
 * The authors' ids on the parts, collected before the machines start (they
 * read `ids` only then), including parts inside `x-teleport` templates.
 * Items keep the machine's ids; groups and their labels are kept by group.
 */
function authoredIds(root: Element): SpotlightIds {
  const ids: Record<string, string> = {};
  const visit = (scope: ParentNode) => {
    for (const el of Array.from(scope.querySelectorAll('*'))) {
      if (el instanceof HTMLTemplateElement) {
        if (el.hasAttribute('x-teleport')) visit(el.content);
        continue;
      }
      if (!el.id) continue;
      for (const { name } of Array.from(el.attributes)) {
        if (!name.startsWith('x-apui:')) continue;
        const part = name.slice('x-apui:'.length);
        if (!part.startsWith('item')) ids[camel(part)] = el.id;
      }
    }
  };
  visit(root);
  return ids as SpotlightIds;
}

/** The entry an item directive describes. */
function toEntry(el: Element, args: PartArgs): SpotlightEntry {
  const raw = (args ?? {}) as Record<string, unknown>;
  const text = (el.querySelector('[x-apui\\:item-text]') ?? el).textContent?.trim() ?? '';
  const label = String(raw.label ?? text);
  const normalized = normalizeGroups([
    { items: [{ ...raw, label, href: raw.href ?? el.getAttribute('href') ?? undefined }] },
  ])[0]?.items[0];
  return normalized ?? { value: label, label, group: '' };
}

/** The `apuiSpotlight` Alpine component. `open` and `search` are plain state, so they can be entangled with Livewire. */
export function spotlightComponent(options: SpotlightAlpineOptions = {}) {
  let dialog: Widget<SpotlightDialogProps, SpotlightDialogApi> | undefined;
  let search: Widget<SpotlightSearchProps, SpotlightSearchApi> | undefined;
  /** Registered items: their entry and whether the query filters them. */
  const items = new Map<Element, { entry: SpotlightEntry; filtered: boolean }>();
  const groupIds = new Map<string, string>();
  const labelIds = new Map<string, string>();
  let shown = new Set<Element>();
  let visible: SpotlightEntry[] = [];
  let scheduled = false;
  let chosen = false;
  let host: State | undefined;
  let stopShortcut: (() => void) | undefined;
  let controller: AbortController | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const shortcut = options.shortcut ?? SPOTLIGHT_DEFAULTS.shortcut;
  const showRecents = options.recent ?? false;

  return {
    open: options.open ?? false,
    search: options.search ?? '',
    query: options.search ?? '',
    loading: options.loading ?? false,
    fetching: false,
    keys: shortcutKeys(shortcut),
    recents: [] as SpotlightItem[],
    remoteGroups: [] as SpotlightResultGroup[],

    init(this: State) {
      // The module's helpers (refresh, the empty and loading parts) read the query and loading state.
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      host = this;
      const el = this.$el;
      const id = options.id ?? this.$id('apui-spotlight');
      const storage = recentKey(id);
      const authored = authoredIds(el);
      const ids: SpotlightIds = {
        ...authored,
        itemGroup: (group) => groupIds.get(group) ?? `combobox:${id}:optgroup:${group}`,
        itemGroupLabel: (group) => labelIds.get(group) ?? `combobox:${id}:optgroup-label:${group}`,
      };
      this.keys = shortcutKeys(shortcut, isApplePlatform());
      if (showRecents) this.recents = readRecents(storage);

      dialog = createWidget(spotlightDialog, {
        ...spotlightDialogProps({
          id,
          ids,
          open: Boolean(this.open),
          modal: options.modal,
          label: options.label,
          onOpenChange: (open) => {
            if (this.open !== open) this.open = open;
            dispatch(el, 'open-change', { open });
          },
        }),
        id,
      });

      search = createWidget(spotlightSearch, {
        ...spotlightSearchProps({
          id,
          ids,
          open: Boolean(this.open),
          entries: [],
          defaultInputValue: this.query,
          loading: Boolean(this.loading),
          translations: options.translations,
          onInputValueChange: (inputValue, reason) => {
            this.query = inputValue;
            if (reason !== 'input-change') {
              refresh();
              return;
            }
            if (this.search !== inputValue) this.search = inputValue;
            dispatch(el, 'search-change', { search: inputValue });
            if (options.url) fetchResults(this, inputValue);
            refresh();
          },
          onSelect: (value) => choose(this, el, value, storage),
        }),
        id,
      });

      dialog.start();
      search.start();
      // Rendered open (a server that opens it, or in place), the first result is active too.
      if (this.open) queueMicrotask(() => requestAnimationFrame(highlightFirst));

      this.$watch('open', (value: unknown) => {
        const open = Boolean(value);
        dialog?.setProps({ open });
        search?.setProps({ open });
        if (open) {
          chosen = false;
          // After the listbox renders, the first result is the active option.
          queueMicrotask(() => requestAnimationFrame(highlightFirst));
        } else {
          search?.api().setInputValue('', 'script');
          if (this.search !== '') this.search = '';
        }
      });
      this.$watch('search', (value: unknown) => {
        const text = String(value ?? '');
        if (search && search.api().inputValue !== text) search.api().setInputValue(text, 'script');
      });
      this.$watch('loading', (value: unknown) => search?.setProps({ loading: Boolean(value) }));

      if (shortcut) {
        const onKeydown = (event: KeyboardEvent) => {
          if (!matchesShortcut(event, shortcut)) return;
          event.preventDefault();
          // The palette opens itself: open-change reports it.
          dialog?.api().setOpen(!this.open);
        };
        window.addEventListener('keydown', onKeydown);
        stopShortcut = () => window.removeEventListener('keydown', onKeydown);
      }
    },

    destroy() {
      stopShortcut?.();
      controller?.abort();
      clearTimeout(timer);
      search?.stop();
      dialog?.stop();
      search = undefined;
      dialog = undefined;
      items.clear();
      host = undefined;
    },

    show(this: { open: boolean }) {
      this.open = true;
    },

    hide(this: { open: boolean }) {
      this.open = false;
    },

    /**
     * Groups the component renders itself, for `<template x-for>`: `recent`
     * (recent choices, while the query is empty) or `remote` (the `url`
     * search's results).
     */
    clientGroups(this: State, kind: 'recent' | 'remote'): SpotlightResultGroup[] {
      if (kind === 'remote') return this.remoteGroups;
      if (!showRecents || this.query.trim() !== '') return [];
      return withRecents([], this.recents, options.recentLabel ?? SPOTLIGHT_DEFAULTS.recentLabel);
    },

    /** An icon's SVG from the registry, for `x-html` in client-rendered items. */
    icon(name: string | undefined): string {
      return name ? iconSvg(name) : '';
    },

    /** An item's display shortcut as keys, for client-rendered items. */
    shortcutKeys(value: string | string[] | undefined): string[] {
      return itemShortcutKeys(value);
    },

    apuiPart(part: string, el: Element, args: () => PartArgs) {
      const name = camel(part);
      if (name in SPOTLIGHT_DIALOG_PARTS) {
        if (!dialog) return () => {};
        const getter = SPOTLIGHT_DIALOG_PARTS[name as keyof typeof SPOTLIGHT_DIALOG_PARTS];
        return dialog.bind(el, (api) => machinePart(api, getter, name, args()));
      }
      if (!search) return () => {};
      if (name === 'item') {
        const filtered = !options.remote && !el.closest('[data-apui-unfiltered]');
        items.set(el, { entry: toEntry(el, args()), filtered });
        schedule();
        const unbind = search.bind(el, (api) => ({
          ...machinePart(api, 'getItemProps', 'item', { item: itemOf(el) } as PartArgs),
          hidden: shown.has(el) ? undefined : true,
        }));
        return () => {
          unbind();
          items.delete(el);
          schedule();
        };
      }
      if (name === 'itemText') {
        const owner = el.closest('[x-apui\\:item]');
        if (!owner) return () => {};
        return search.bind(el, (api) => {
          const item = items.has(owner) ? itemOf(owner) : undefined;
          return item ? machinePart(api, 'getItemTextProps', 'itemText', { item } as PartArgs) : {};
        });
      }
      if (name === 'itemGroup') {
        const group = String(args()?.id ?? '');
        if (el.id) groupIds.set(group, el.id);
        const label = el.querySelector('[x-apui\\:item-group-label]');
        if (label?.id) labelIds.set(group, label.id);
        return search.bind(el, (api) => ({
          ...machinePart(api, 'getItemGroupProps', 'itemGroup', { id: group }),
          hidden: [...shown].some((item) => el.contains(item)) ? undefined : true,
        }));
      }
      if (name === 'itemGroupLabel') {
        const group = String(args()?.htmlFor ?? '');
        if (el.id) labelIds.set(group, el.id);
        return search.bind(el, (api) =>
          machinePart(api, 'getItemGroupLabelProps', 'itemGroupLabel', { htmlFor: group }),
        );
      }
      if (name in SPOTLIGHT_SEARCH_PARTS) {
        const getter = SPOTLIGHT_SEARCH_PARTS[name as keyof typeof SPOTLIGHT_SEARCH_PARTS];
        return search.bind(el, (api) => machinePart(api, getter, name, args()));
      }
      if (name === 'empty') {
        // Not a live region: the combobox announces the count ("No results").
        return search.bind(el, () =>
          staticPart('empty', visible.length > 0 || Boolean(host?.loading)),
        );
      }
      if (name === 'loading') {
        return search.bind(el, () => staticPart('loading', !host?.loading));
      }
      throw new Error(`[apui] spotlight has no part "${part}"`);
    },
  };

  /** The machine item for a registered element. */
  function itemOf(el: Element): SpotlightOption {
    const entry = items.get(el)?.entry;
    return { value: entry?.value ?? '', label: entry?.label ?? '', disabled: entry?.disabled };
  }

  /** Rebuilds the collection after items change, once per tick. */
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      refresh();
    });
  }

  /** Rebuilds the collection from the registered items in DOM order, hiding those the query doesn't match. */
  function refresh() {
    if (!search) return;
    // A morph removes items before Alpine runs their cleanup.
    for (const el of [...items.keys()]) if (!el.isConnected) items.delete(el);
    const query = host?.query ?? '';
    const ordered = [...items].sort(([a], [b]) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    const matching = ordered.filter(
      ([, { entry, filtered }]) => !filtered || matchesQuery(entry, query),
    );
    shown = new Set(matching.map(([el]) => el));
    for (const [el, { entry }] of matching) markLabel(el, entry.label, query);
    visible = matching.map(([, { entry }]) => entry);
    search.setProps({ collection: spotlightCollection(visible) });
    search.refresh();
  }

  /**
   * Writes an item's label into its `[data-apui-label]` span with the
   * query's matches in `<mark>`, as text nodes (never HTML).
   */
  function markLabel(el: Element, label: string, query: string) {
    const target = el.querySelector('[data-apui-label]');
    if (!target) return;
    const nodes = highlightLabel(label, query).map(({ text, match }) => {
      if (!match) return document.createTextNode(text);
      const mark = document.createElement('mark');
      mark.textContent = text;
      return mark;
    });
    target.replaceChildren(...nodes);
  }

  /** Highlights the first result when nothing is, so Enter opens it. */
  function highlightFirst() {
    const api = search?.api();
    if (!api || !host?.open || api.highlightedValue != null) return;
    const first = visible.find((entry) => !entry.disabled);
    if (first) api.setHighlightValue(first.value);
  }

  /** Reports a choice, remembers it and closes the palette. A link item is followed by the machine. */
  function choose(state: State, el: Element, value: string, storage: string) {
    if (chosen) return;
    const entry = findEntry([{ id: '', items: visible }], value);
    if (!entry) return;
    chosen = true;
    const item = selectedItem(entry);
    if (showRecents) state.recents = rememberRecent(storage, item, state.recents);
    dispatch(el, 'select', { value: item.value, item });
    dialog?.api().setOpen(false);
  }

  /** Fetches `url?search=…` after a pause in typing, replacing the remote results. */
  function fetchResults(state: State, query: string) {
    clearTimeout(timer);
    controller?.abort();
    if (!query.trim()) {
      state.remoteGroups = [];
      if (state.fetching) state.loading = state.fetching = false;
      return;
    }
    timer = setTimeout(async () => {
      controller = new AbortController();
      state.fetching = true;
      state.loading = true;
      try {
        const separator = options.url!.includes('?') ? '&' : '?';
        const response = await fetch(
          `${options.url}${separator}search=${encodeURIComponent(query)}`,
          { signal: controller.signal, headers: { Accept: 'application/json' } },
        );
        const groups = normalizeGroups(await response.json());
        state.remoteGroups = groups.map((group) => ({ ...group, id: `remote-${group.id}` }));
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        state.remoteGroups = [];
      }
      state.fetching = false;
      state.loading = options.loading ?? false;
    }, 250);
  }
}

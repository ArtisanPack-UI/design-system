/**
 * Spotlight (#57): a command palette composed from two existing machines, so
 * nothing is rebuilt (D-015). Zag's dialog is the overlay (focus trap,
 * Escape, outside click, scroll lock, `aria-hidden` on the page, focus
 * return) and Zag's combobox is the search: `role=combobox` on the query
 * with `aria-activedescendant`, a `listbox` of grouped options, arrow keys,
 * Home and End, Enter, and the polite results count announcement.
 *
 * Both machines' parts carry the `spotlight` scope. Their part names collide
 * (each has a `trigger`, `positioner` and `content`), so the dialog keeps
 * Zag's names and the combobox's overlay parts take the spec's: `control` →
 * `search`, `input` → `query`, `content` → `results`. The machines find their
 * elements by id, never by `data-part`, so renaming is safe.
 *
 * The listbox is always open while the dialog is: the combobox runs with
 * `open` controlled by the dialog and without its own dismissal layer, so
 * Escape and outside clicks reach the dialog. Choosing an item reports
 * `select` and closes the palette; a link item is followed.
 */
import * as zagCombobox from '@zag-js/combobox';
import type { Machine } from '@zag-js/core';
import * as zagDialog from '@zag-js/dialog';
import type { PropTypes } from '@zag-js/types';

import type { Attrs } from '../core/props';
import type { WidgetDefinition } from '../core/widget';
import { safeLinkUrl } from '../form/rich-text';

/** An option as the combobox machine holds it. */
export interface SpotlightOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type DialogSchema = zagDialog.Machine extends Machine<infer S> ? S : never;
type SearchSchema = zagCombobox.Machine<SpotlightOption> extends Machine<infer S> ? S : never;

export type SpotlightDialogProps = zagDialog.Props;
export type SpotlightDialogApi = zagDialog.Api;
export type SpotlightSearchProps = zagCombobox.Props<SpotlightOption>;
export type SpotlightSearchApi = zagCombobox.Api<PropTypes, SpotlightOption>;

/**
 * The overlay: Zag's dialog machine. Its parts are renamed by
 * `spotlightPart()`, not by the definition, so Spotlight doesn't depend on
 * how Dialog or Combobox spell theirs.
 */
export const spotlightDialog: WidgetDefinition<DialogSchema, SpotlightDialogApi> = {
  scope: 'spotlight',
  machine: zagDialog.machine,
  connect: (service, normalize) => zagDialog.connect(service, normalize),
};

/** The search: Zag's combobox machine, with an always-open listbox. */
export const spotlightSearch: WidgetDefinition<SearchSchema, SpotlightSearchApi> = {
  scope: 'spotlight',
  machine: zagCombobox.machine as Machine<SearchSchema>,
  connect: (service, normalize) =>
    zagCombobox.connect(service, normalize) as unknown as SpotlightSearchApi,
};

/** The `data-scope` every Spotlight part carries. */
export const SPOTLIGHT_SCOPE = 'spotlight';

/** The colors an item's icon tile takes. */
export type SpotlightColor =
  'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

/** One result: a page, record or action. */
export interface SpotlightItem {
  /** Identifies the item in `select`. Defaults to `href`, then `label`. */
  value?: string;
  /** The text shown and searched. */
  label: string;
  /** Secondary text under the label, searched too. */
  description?: string;
  /** Makes the item a link: choosing it follows the link. */
  href?: string;
  /** An icon name from the registry, drawn in a tile before the label. */
  icon?: string;
  /** Tints the icon tile. Default `neutral`. */
  color?: SpotlightColor;
  /** A keyboard hint shown at the end, such as `⌘ N`. Display only. */
  shortcut?: string | string[];
  /** More words the search matches. */
  keywords?: string[];
  disabled?: boolean;
}

/** A labelled group of results. */
export interface SpotlightGroup {
  /** A stable id for the group. Defaults to its position. */
  id?: string;
  label?: string;
  items: SpotlightItem[];
}

/** An item with its value resolved, as the widgets render it. */
export interface SpotlightEntry extends SpotlightItem {
  value: string;
  /** The id of the group it renders in. */
  group: string;
}

/** A group with its id and entries resolved. */
export interface SpotlightResultGroup {
  id: string;
  label?: string;
  items: SpotlightEntry[];
}

/** The id of the group recent items render in. */
export const RECENT_GROUP = 'recent';

/**
 * Recent items repeat items in other groups, so their values carry a prefix:
 * a collection's values (and the option ids built from them) must be unique.
 */
export const RECENT_PREFIX = 'recent:';

/** How many recent items to keep. */
export const RECENT_LIMIT = 5;

/** Built-in strings, each translatable through its prop. */
export const SPOTLIGHT_DEFAULTS = {
  label: 'Search',
  placeholder: 'Search…',
  emptyText: 'No results.',
  loadingText: 'Searching…',
  recentLabel: 'Recent',
  closeLabel: 'Close',
  navigateLabel: 'Navigate',
  selectLabel: 'Open',
  shortcut: 'mod+k',
} as const;

// ---------------------------------------------------------------------------
// Data

/** An item's value: its own, else its link, else its label. */
export function itemValue(item: SpotlightItem): string {
  return String(item.value ?? item.href ?? item.label ?? '');
}

/** The value a rendered entry reports in `select`: recent entries drop their prefix. */
export function entryValue(value: string): string {
  return value.startsWith(RECENT_PREFIX) ? value.slice(RECENT_PREFIX.length) : value;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Groups as the widgets render them, tolerating loose data (a server's JSON):
 * entries without a label are dropped, values are resolved, and a flat list
 * of items becomes one group without a label. The legacy endpoint shape
 * (`name`, `link`) is read as `label` and `href`.
 */
export function normalizeGroups(groups: unknown): SpotlightResultGroup[] {
  if (!Array.isArray(groups)) return [];
  const list = groups.filter(isRecord);
  const grouped = list.some((group) => Array.isArray(group.items));
  const source = grouped ? list : [{ items: list }];
  return source
    .filter((group) => Array.isArray(group.items))
    .map((group, index) => {
      const id = String(group.id ?? `group-${index}`);
      const items = (group.items as unknown[])
        .filter(isRecord)
        .map((raw): SpotlightEntry | null => {
          const label = raw.label ?? raw.name;
          if (typeof label !== 'string' || label === '') return null;
          const item: SpotlightItem = {
            label,
            value: raw.value == null ? undefined : String(raw.value),
            description: typeof raw.description === 'string' ? raw.description : undefined,
            // Remote JSON and stored recents are untrusted: only relative,
            // http(s), mailto and tel links survive (no `javascript:`).
            href:
              typeof (raw.href ?? raw.link) === 'string'
                ? (safeLinkUrl(String(raw.href ?? raw.link)) ?? undefined)
                : undefined,
            icon: typeof raw.icon === 'string' ? raw.icon : undefined,
            color: typeof raw.color === 'string' ? (raw.color as SpotlightColor) : undefined,
            shortcut:
              typeof raw.shortcut === 'string' || Array.isArray(raw.shortcut)
                ? (raw.shortcut as string | string[])
                : undefined,
            keywords: Array.isArray(raw.keywords) ? raw.keywords.map(String) : undefined,
            disabled: Boolean(raw.disabled) || undefined,
          };
          return { ...item, value: itemValue(item), group: id };
        })
        .filter((item): item is SpotlightEntry => item !== null);
      return {
        id,
        label: typeof group.label === 'string' && group.label !== '' ? group.label : undefined,
        items,
      };
    });
}

/** Lowercases text and strips accents, for matching. */
function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase();
}

/**
 * Whether an item matches a query: every word of the query appears in its
 * label, description or keywords, ignoring case and accents. An empty query
 * matches everything.
 */
export function matchesQuery(
  item: Pick<SpotlightItem, 'label' | 'description' | 'keywords'>,
  query: string,
): boolean {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = fold([item.label, item.description ?? '', ...(item.keywords ?? [])].join(' '));
  return words.every((word) => haystack.includes(word));
}

/** A run of a label: matched by the query or not. */
export interface SpotlightLabelSegment {
  text: string;
  match: boolean;
}

/**
 * A label split into runs, marking every occurrence of each word of the
 * query, ignoring case and accents, for `<mark>`. An empty query, or no
 * match, is one unmatched run.
 */
export function highlightLabel(label: string, query: string): SpotlightLabelSegment[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length || !label) return label ? [{ text: label, match: false }] : [];
  // Fold character by character, remembering which original character each
  // folded one came from, so matches map back onto the label.
  const chars = Array.from(label);
  let folded = '';
  const origin: number[] = [];
  chars.forEach((char, index) => {
    const part = fold(char);
    folded += part;
    for (let i = 0; i < part.length; i++) origin.push(index);
  });
  const marked = new Array<boolean>(chars.length).fill(false);
  for (const word of words) {
    let from = folded.indexOf(word);
    while (from !== -1) {
      for (let i = from; i < from + word.length; i++) marked[origin[i]!] = true;
      from = folded.indexOf(word, from + word.length);
    }
  }
  const segments: SpotlightLabelSegment[] = [];
  chars.forEach((char, index) => {
    const match = marked[index]!;
    const last = segments.at(-1);
    if (last && last.match === match) last.text += char;
    else segments.push({ text: char, match });
  });
  return segments;
}

/** The groups whose items match `query`, keeping only the matching items and dropping empty groups. */
export function filterGroups(
  groups: SpotlightResultGroup[],
  query: string,
): SpotlightResultGroup[] {
  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => matchesQuery(item, query)) }))
    .filter((group) => group.items.length > 0);
}

/** Puts a Recent group of `recents` first. */
export function withRecents(
  groups: SpotlightResultGroup[],
  recents: SpotlightItem[],
  label: string,
): SpotlightResultGroup[] {
  if (!recents.length) return groups;
  const items = recents.map((item) => ({
    ...item,
    value: RECENT_PREFIX + itemValue(item),
    group: RECENT_GROUP,
  }));
  return [{ id: RECENT_GROUP, label, items }, ...groups];
}

/**
 * The groups to render: filtered by `query` unless `remote` (the page
 * searches), with recent items first while the query is empty.
 */
export function visibleGroups(
  groups: SpotlightGroup[] | SpotlightResultGroup[] | unknown,
  query: string,
  options: { remote?: boolean; recents?: SpotlightItem[]; recentLabel?: string } = {},
): SpotlightResultGroup[] {
  const normalized = normalizeGroups(groups);
  const shown = options.remote ? normalized : filterGroups(normalized, query);
  if (query.trim() !== '' || !options.recents?.length) return shown;
  return withRecents(shown, options.recents, options.recentLabel ?? SPOTLIGHT_DEFAULTS.recentLabel);
}

/** Every entry in render order. */
export function flattenGroups(groups: SpotlightResultGroup[]): SpotlightEntry[] {
  return groups.flatMap((group) => group.items);
}

/** The combobox collection for the rendered entries. */
export function spotlightCollection(entries: SpotlightOption[]) {
  return zagCombobox.collection<SpotlightOption>({
    items: entries.map((entry) => ({
      value: entry.value,
      label: entry.label,
      disabled: entry.disabled,
    })),
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
    isItemDisabled: (item) => Boolean(item.disabled),
  });
}

// ---------------------------------------------------------------------------
// Recent items, kept per palette in localStorage

/** The storage key for a palette's recent items. */
export function recentKey(id: string): string {
  return `apui-spotlight-recent:${id}`;
}

/** The recent items stored under `key`, newest first. Empty without storage. */
export function readRecents(key: string): SpotlightItem[] {
  try {
    const stored = globalThis.localStorage?.getItem(key);
    if (!stored) return [];
    return flattenGroups(normalizeGroups(JSON.parse(stored))).map(
      ({ group: _group, ...item }) => item,
    );
  } catch {
    return [];
  }
}

/**
 * Stores `item` as the newest recent item in front of `current` (by default
 * what's stored). Returns the new list, which the caller keeps: without
 * storage (a private window, a sandboxed frame) it lasts until the page goes.
 */
export function rememberRecent(
  key: string,
  item: SpotlightItem,
  current: SpotlightItem[] = readRecents(key),
  limit = RECENT_LIMIT,
): SpotlightItem[] {
  const value = itemValue(item);
  const entry: SpotlightItem = {
    value,
    label: item.label,
    description: item.description,
    href: item.href,
    icon: item.icon,
    color: item.color,
  };
  const next = [entry, ...current.filter((recent) => itemValue(recent) !== value)].slice(0, limit);
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(next));
  } catch {
    // Storage is full or blocked: recent items just aren't kept.
  }
  return next;
}

// ---------------------------------------------------------------------------
// The global shortcut

/** A parsed shortcut. `mod` is ⌘ on Apple platforms and Ctrl elsewhere. */
export interface Shortcut {
  key: string;
  mod: boolean;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
}

/**
 * Parses a shortcut such as `mod+k`, `ctrl+shift+p` or `/`. Modifiers are
 * `mod`, `ctrl`, `meta` (or `cmd`), `alt` (or `option`) and `shift`, joined to
 * the key with `+`. Empty disables it.
 */
export function parseShortcut(shortcut: string | null | undefined): Shortcut | null {
  if (!shortcut) return null;
  const parts = shortcut
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  // `mod++` ends in the plus key.
  const key = shortcut.trim().endsWith('++') ? '+' : parts.pop();
  if (!key) return null;
  const has = (...names: string[]) => parts.some((part) => names.includes(part));
  return {
    key,
    mod: has('mod'),
    ctrl: has('ctrl', 'control'),
    meta: has('meta', 'cmd', 'command'),
    alt: has('alt', 'option'),
    shift: has('shift'),
  };
}

/** Whether the page runs on macOS or iOS, where `mod` is ⌘. */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/** Whether an element takes typed text. */
function isEditable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== 'function') return false;
  return Boolean(
    el.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'),
  );
}

/**
 * Whether a keydown is the shortcut. A shortcut without a modifier (`/`)
 * doesn't fire while the user types in a field.
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: string | Shortcut | null | undefined,
  apple = isApplePlatform(),
): boolean {
  const parsed = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut;
  if (!parsed || event.isComposing) return false;
  const ctrl = parsed.ctrl || (parsed.mod && !apple);
  const meta = parsed.meta || (parsed.mod && apple);
  if (event.ctrlKey !== ctrl || event.metaKey !== meta || event.altKey !== parsed.alt) return false;
  const key = event.key.toLowerCase();
  // Shift changes the key's character (`?` for `/`), so only check it for letters.
  if (/^[a-z]$/.test(parsed.key) && event.shiftKey !== parsed.shift) return false;
  if (key !== parsed.key && event.code.toLowerCase() !== `key${parsed.key}`) return false;
  if (!ctrl && !meta && !parsed.alt && isEditable(event.target)) return false;
  return true;
}

/** Key names as `aria-keyshortcuts` spells them. */
const ARIA_KEYS: Record<string, string> = {
  ' ': 'Space',
  space: 'Space',
  enter: 'Enter',
  escape: 'Escape',
  esc: 'Escape',
};

/**
 * The shortcut as `aria-keyshortcuts`: `mod+k` is `Meta+K Control+K`, since
 * the server can't know the platform.
 */
export function shortcutAria(shortcut: string | null | undefined): string | undefined {
  const parsed = parseShortcut(shortcut);
  if (!parsed) return undefined;
  const key =
    ARIA_KEYS[parsed.key] ?? (parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key);
  const tail = [parsed.alt && 'Alt', parsed.shift && 'Shift', key].filter(Boolean) as string[];
  const combo = (...mods: (string | false)[]) =>
    [...(mods.filter(Boolean) as string[]), ...tail].join('+');
  if (parsed.mod) return `${combo('Meta')} ${combo('Control')}`;
  return combo(parsed.ctrl && 'Control', parsed.meta && 'Meta');
}

/** The shortcut's keys as shown in a hint: `['⌘', 'K']` on Apple platforms, `['Ctrl', 'K']` elsewhere. */
export function shortcutKeys(shortcut: string | null | undefined, apple = false): string[] {
  const parsed = parseShortcut(shortcut);
  if (!parsed) return [];
  const keys: string[] = [];
  if (parsed.ctrl || (parsed.mod && !apple)) keys.push(apple ? '⌃' : 'Ctrl');
  if (parsed.meta || (parsed.mod && apple)) keys.push(apple ? '⌘' : 'Meta');
  if (parsed.alt) keys.push(apple ? '⌥' : 'Alt');
  if (parsed.shift) keys.push(apple ? '⇧' : 'Shift');
  keys.push(parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key);
  return keys;
}

/** An item's display shortcut as keys: an array as given, a string split on spaces and `+`. */
export function itemShortcutKeys(shortcut: string | string[] | undefined): string[] {
  if (Array.isArray(shortcut)) return shortcut.map(String).filter(Boolean);
  if (!shortcut) return [];
  return shortcut.split(/\s+|\+(?!$)/).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Parts

/** The dialog's parts, by Spotlight part name, and the getter that builds each. */
export const SPOTLIGHT_DIALOG_PARTS = {
  trigger: 'getTriggerProps',
  backdrop: 'getBackdropProps',
  positioner: 'getPositionerProps',
  content: 'getContentProps',
  closeTrigger: 'getCloseTriggerProps',
} as const;

/** The combobox's parts, by Spotlight part name (the spec's where Zag's collide), and the getter that builds each. */
export const SPOTLIGHT_SEARCH_PARTS = {
  search: 'getControlProps',
  query: 'getInputProps',
  results: 'getContentProps',
  itemGroup: 'getItemGroupProps',
  itemGroupLabel: 'getItemGroupLabelProps',
  item: 'getItemProps',
  itemText: 'getItemTextProps',
} as const;

export type SpotlightDialogPart = keyof typeof SPOTLIGHT_DIALOG_PARTS;
export type SpotlightSearchPart = keyof typeof SPOTLIGHT_SEARCH_PARTS;

/** `itemGroupLabel` → `item-group-label`. */
export const kebabPart = (part: string) => part.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * A machine part's props as a Spotlight part: the `spotlight` scope, the
 * Spotlight part name, and on items `aria-selected` following the highlight,
 * the option `aria-activedescendant` points at, as the listbox pattern
 * expects (a palette has no selected value).
 */
export function spotlightPart<T extends object>(part: string, props: T): T {
  const attrs = { ...(props as Record<string, unknown>) };
  attrs['data-scope'] = SPOTLIGHT_SCOPE;
  attrs['data-part'] = kebabPart(part);
  if (part === 'item') {
    const highlighted = attrs['data-highlighted'];
    attrs['aria-selected'] = highlighted !== undefined && highlighted !== false;
  }
  return attrs as T;
}

/** Props for a part that isn't a machine's (`empty`, `loading`, …): scope and part, plus `hidden`. */
export function staticPart(part: string, hidden?: boolean): Attrs {
  return {
    'data-scope': SPOTLIGHT_SCOPE,
    'data-part': kebabPart(part),
    hidden: hidden ? true : undefined,
  };
}

// ---------------------------------------------------------------------------
// Machine props, shared by the Alpine, React and Vue adapters

/** Authored ids for parts, by Spotlight part name. */
export interface SpotlightIds {
  trigger?: string;
  backdrop?: string;
  positioner?: string;
  content?: string;
  closeTrigger?: string;
  search?: string;
  query?: string;
  results?: string;
  itemGroup?: (group: string) => string;
  itemGroupLabel?: (group: string) => string;
}

/** Live-region strings: a count (`:count results`, or `one|other` forms), and the empty and loading text. */
export interface SpotlightTranslations {
  resultsCount?: string | ((count: number) => string);
  noResults?: string;
  loading?: string;
}

/** The combobox's announcement strings from Spotlight's. */
export function searchTranslations(
  translations: SpotlightTranslations = {},
): SpotlightSearchProps['translations'] {
  const count = translations.resultsCount;
  return {
    resultsCount:
      typeof count === 'function'
        ? count
        : typeof count === 'string'
          ? (n: number) => {
              const [one, other = one] = count.split('|');
              return ((n === 1 ? one : other) ?? '').replace(':count', String(n));
            }
          : undefined,
    noResults: translations.noResults,
    loading: translations.loading,
  } as SpotlightSearchProps['translations'];
}

/** The dialog machine's id for a part, when no id is authored. */
const dialogId = (id: string, part: string) => `dialog:${id}:${part}`;

/** The dialog machine's props. `label` names the panel; Escape, the backdrop and the close trigger close it. */
export function spotlightDialogProps(options: {
  id: string;
  ids?: SpotlightIds;
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  label?: string;
  dir?: 'ltr' | 'rtl';
  onOpenChange?: (open: boolean) => void;
}): Partial<SpotlightDialogProps> {
  const ids = options.ids ?? {};
  return {
    id: options.id,
    ids: {
      trigger: ids.trigger,
      backdrop: ids.backdrop,
      positioner: ids.positioner,
      content: ids.content,
      closeTrigger: ids.closeTrigger,
    },
    dir: options.dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: options.modal ?? true,
    'aria-label': options.label ?? SPOTLIGHT_DEFAULTS.label,
    onOpenChange: ({ open }) => options.onOpenChange?.(open),
  };
}

/**
 * The combobox machine's props. Its listbox is open whenever the dialog is,
 * without a dismissal layer of its own; its value stays empty (a palette
 * reports choices, it doesn't hold one); typing highlights the first match.
 */
export function spotlightSearchProps(options: {
  id: string;
  ids?: SpotlightIds;
  open: boolean;
  entries: SpotlightOption[];
  inputValue?: string;
  defaultInputValue?: string;
  loading?: boolean;
  dir?: 'ltr' | 'rtl';
  translations?: SpotlightTranslations;
  onInputValueChange?: (inputValue: string, reason?: string) => void;
  onSelect?: (value: string) => void;
}): Partial<SpotlightSearchProps> {
  const ids = options.ids ?? {};
  return {
    id: options.id,
    ids: {
      // The combobox announces the results count in live regions inside its
      // root; the panel keeps them outside the aria-hidden page.
      root: ids.content ?? dialogId(options.id, 'content'),
      control: ids.search,
      input: ids.query,
      content: ids.results,
      itemGroup: ids.itemGroup && ((group) => ids.itemGroup!(String(group))),
      itemGroupLabel: ids.itemGroupLabel && ((group) => ids.itemGroupLabel!(String(group))),
    },
    dir: options.dir,
    open: options.open,
    collection: spotlightCollection(options.entries),
    value: [],
    inputValue: options.inputValue,
    defaultInputValue: options.defaultInputValue,
    loading: options.loading,
    disableLayer: true,
    allowCustomValue: true,
    closeOnSelect: true,
    openOnClick: false,
    loopFocus: true,
    inputBehavior: 'autohighlight',
    selectionBehavior: 'clear',
    translations: searchTranslations(options.translations),
    onInputValueChange: ({ inputValue, reason }) =>
      options.onInputValueChange?.(inputValue, reason),
    onSelect: ({ itemValue }) => {
      if (itemValue != null) options.onSelect?.(itemValue);
    },
  };
}

/** The entry for a collection value, if it renders. */
export function findEntry(
  groups: SpotlightResultGroup[],
  value: string,
): SpotlightEntry | undefined {
  return flattenGroups(groups).find((entry) => entry.value === value);
}

/** An entry as `select` reports it: the item's own value, without the group. */
export function selectedItem(entry: SpotlightEntry): SpotlightItem & { value: string } {
  const { group: _group, ...item } = entry;
  return { ...item, value: entryValue(entry.value) };
}

/**
 * Spotlight's options for the React and Vue adapters (#57), mapped in one
 * place so the two can't drift, onto the same machine props the Alpine
 * adapter uses (`widgets/spotlight.ts`).
 */
import type { Attrs } from './props';
import {
  findEntry,
  selectedItem,
  type SpotlightEntry,
  type SpotlightGroup,
  type SpotlightIds,
  type SpotlightItem,
  type SpotlightResultGroup,
  type SpotlightTranslations,
} from '../widgets/spotlight';

export interface SpotlightOptions {
  /** The results, in groups. Unless `remote`, they're filtered as the user types. */
  groups: SpotlightGroup[];
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the palette opens or closes itself: the trigger, the shortcut, Escape, the backdrop, the close button or a choice. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled query text. Pair it with `onSearchChange`. */
  search?: string;
  /** Initial query text when uncontrolled. */
  defaultSearch?: string;
  /** Called with the query as the user types, and with `''` when the palette closes. */
  onSearchChange?: (search: string) => void;
  /** Called when an item is chosen, with the item. A link item is followed too. */
  onSelect?: (item: SpotlightItem & { value: string }) => void;
  /** The page searches: `groups` are the results for `search`, not filtered here. */
  remote?: boolean;
  /** Shows the loading state and marks the results busy. */
  loading?: boolean;
  /** Traps focus, locks scroll and hides the page from assistive technology. Default true. */
  modal?: boolean;
  /** The panel's accessible name. Default `Search`. */
  label?: string;
  /** The global shortcut, such as `mod+k` (⌘K on Apple platforms, Ctrl+K elsewhere). Empty disables it. */
  shortcut?: string;
  /** Show recent choices (kept in localStorage) first while the query is empty. Default false. */
  recent?: boolean;
  /** The Recent group's label. */
  recentLabel?: string;
  /** Live-region strings: the results count, no results and loading. */
  translations?: SpotlightTranslations;
  /** Machine id. Defaults to one unique on the page; also keys the recent items. */
  id?: string;
  /** Ids for the parts, by Spotlight part name. */
  ids?: SpotlightIds;
  dir?: 'ltr' | 'rtl';
}

/** The parts the hooks add to the machines' API. */
export interface SpotlightExtras {
  /** Whether it's open. */
  open: boolean;
  /** Opens or closes it, reporting `onOpenChange`. */
  setOpen(open: boolean): void;
  /** The query text. */
  query: string;
  /** The groups to render, filtered and with recent items first. */
  groups: SpotlightResultGroup[];
  /** The shortcut's keys for a hint, per platform: `['⌘', 'K']` or `['Ctrl', 'K']`. */
  shortcutKeys: string[];
  /** The shortcut as `aria-keyshortcuts`. */
  ariaKeyShortcuts: string | undefined;
  getEmptyProps(): Attrs;
  getLoadingProps(): Attrs;
}

/** The entry `value` chose, as `onSelect` reports it. */
export function chosenItem(
  groups: SpotlightResultGroup[],
  value: string,
): (SpotlightItem & { value: string }) | undefined {
  const entry: SpotlightEntry | undefined = findEntry(groups, value);
  return entry ? selectedItem(entry) : undefined;
}

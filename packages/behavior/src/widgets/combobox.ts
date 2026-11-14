/**
 * Combobox (#35, #54) on Zag's combobox machine: `role=combobox` with
 * `aria-activedescendant`, keyboard navigation, single and multiple values,
 * and a positioned listbox. Tags is the same widget with `multiple` and
 * `allowCreate`.
 *
 * The field anatomy (D-018) names the bordered box `box` and the native
 * element `control`, which Zag calls `control` and `input`, so the definition
 * renames those two parts through `repart()`. Zag finds the combobox's
 * elements by id and its options by `role=option`, never by part.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/combobox';
import type { PropTypes } from '@zag-js/types';

import type { Normalize, WidgetDefinition } from '../core/widget';

/** One option. `label` is what the input shows and what local filtering matches. */
export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
  /** A second line under the label. */
  description?: string;
  /** An icon name, resolved through the icon registry. */
  icon?: string;
  /** Tints the option's chip with `multiple`: a semantic color name. */
  color?: string;
  /** The create option: its value is the typed text. */
  create?: boolean;
}

type Schema = zag.Machine<ComboboxItem> extends Machine<infer S> ? S : never;

export type ComboboxProps = zag.Props<ComboboxItem>;
export type ComboboxApi = zag.Api<PropTypes, ComboboxItem>;

/** Zag's part names that the field anatomy spells differently (D-018). */
export const COMBOBOX_PARTS: Readonly<Record<string, string>> = {
  control: 'box',
  input: 'control',
};

/**
 * A `normalize` that renames `data-part` on every part it builds, by `parts`
 * (Zag's name → ours). See `rescope()` for the scope.
 */
export function repart(normalize: Normalize, parts: Readonly<Record<string, string>>): Normalize {
  const rename = <T>(props: T): T => {
    const attrs = props as Record<string, unknown>;
    const part = attrs['data-part'];
    return (
      typeof part === 'string' && parts[part] ? { ...attrs, 'data-part': parts[part] } : props
    ) as T;
  };
  // Zag's normalizers are proxies whose every key (`element`, `button`, …)
  // is the same function, except `style`, which has no data-part to rename.
  return new Proxy(normalize, {
    get(target, key) {
      const value = Reflect.get(target, key) as unknown;
      if (typeof value !== 'function' || key === 'style') return value;
      return (props: unknown) => (value as (p: unknown) => unknown)(rename(props));
    },
  });
}

/** A collection of items in the shape the machine expects. */
export function createCollection(items: ComboboxItem[]) {
  return zag.collection<ComboboxItem>({
    items,
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
    isItemDisabled: (item) => Boolean(item.disabled),
  });
}

/** Lowercases text and strips accents, for matching. */
export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase();
}

/**
 * Items whose label contains `query`, ignoring case and accents. An empty
 * query matches everything.
 */
export function filterItems(items: ComboboxItem[], query: string): ComboboxItem[] {
  const needle = fold(query.trim());
  return needle ? items.filter((item) => fold(item.label).includes(needle)) : items;
}

/**
 * The create option for typed text, or null when there is nothing to create:
 * the text is empty, or it already names an option or a chosen value
 * (ignoring case and accents, so “Rooftop” and “rooftop” don't both exist).
 */
export function createItem(
  query: string,
  items: readonly ComboboxItem[],
  values: readonly string[] = [],
): ComboboxItem | null {
  const text = query.trim();
  if (!text) return null;
  const needle = fold(text);
  const taken = items.some((item) => fold(item.label) === needle || fold(item.value) === needle);
  if (taken || values.some((value) => fold(value) === needle)) return null;
  return { value: text, label: text, create: true };
}

/** One run of a label: matching the query or not. */
export interface LabelSegment {
  text: string;
  match: boolean;
}

/**
 * A label split around its first match of `query`, ignoring case and
 * accents, for the `mark` part. Without a match it's one unmatched segment.
 */
export function highlight(label: string, query: string): LabelSegment[] {
  const needle = fold(query.trim());
  if (!needle) return [{ text: label, match: false }];
  // Fold each character on its own, remembering where each folded character
  // came from, so a match maps back onto the original text.
  const chars = Array.from(label);
  let folded = '';
  const origin: number[] = [];
  chars.forEach((char, index) => {
    for (const piece of Array.from(fold(char))) {
      folded += piece;
      origin.push(index);
    }
  });
  const at = folded.indexOf(needle);
  if (at < 0) return [{ text: label, match: false }];
  const start = origin[at]!;
  const end = origin[at + needle.length - 1]! + 1;
  return [
    { text: chars.slice(0, start).join(''), match: false },
    { text: chars.slice(start, end).join(''), match: true },
    { text: chars.slice(end).join(''), match: false },
  ].filter((segment) => segment.text !== '');
}

/** Fills `{name}` placeholders in a label: `Remove {label}` → `Remove Rooftop`. */
export function formatLabel(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => values[name] ?? whole);
}

/** The built-in labels, in English. Livewire passes translated ones; React and Vue take props. */
export const COMBOBOX_LABELS = {
  placeholder: 'Search…',
  empty: 'No matches for “{search}”.',
  loading: 'Loading…',
  create: 'Create “{value}”',
  remove: 'Remove {label}',
  removed: 'Removed {label}.',
  clear: 'Clear',
  trigger: 'Show options',
} as const;

export const combobox: WidgetDefinition<Schema, ComboboxApi> = {
  scope: 'combobox',
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) =>
    zag.connect(service, repart(normalize, COMBOBOX_PARTS)) as ComboboxApi,
};

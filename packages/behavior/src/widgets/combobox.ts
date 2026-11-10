/**
 * Combobox (#35, #54) on Zag's combobox machine: `role=combobox` with
 * `aria-activedescendant`, keyboard navigation, single and multiple values,
 * and a positioned listbox.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/combobox';
import type { PropTypes } from '@zag-js/types';

import type { WidgetDefinition } from '../core/widget';

/** One option. `label` is what the input shows and what local filtering matches. */
export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

type Schema = zag.Machine<ComboboxItem> extends Machine<infer S> ? S : never;

export type ComboboxProps = zag.Props<ComboboxItem>;
export type ComboboxApi = zag.Api<PropTypes, ComboboxItem>;

/** A collection of items in the shape the machine expects. */
export function createCollection(items: ComboboxItem[]) {
  return zag.collection<ComboboxItem>({
    items,
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
    isItemDisabled: (item) => Boolean(item.disabled),
  });
}

/**
 * Items whose label contains `query`, ignoring case and accents. An empty
 * query matches everything.
 */
export function filterItems(items: ComboboxItem[], query: string): ComboboxItem[] {
  /** Lowercases text and strips accents, for matching. */
  const fold = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase();
  const needle = fold(query.trim());
  return needle ? items.filter((item) => fold(item.label).includes(needle)) : items;
}

export const combobox: WidgetDefinition<Schema, ComboboxApi> = {
  scope: 'combobox',
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) => zag.connect(service, normalize) as ComboboxApi,
};

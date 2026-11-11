/**
 * Tabs (#56) on Zag's tabs machine: `role=tablist` with `tab` triggers and
 * `tabpanel` contents, a roving tabindex, arrow keys that follow the
 * orientation and the text direction (Zag maps ArrowLeft and ArrowRight
 * through `dir`), Home and End, and automatic or manual activation.
 *
 * The parts keep Zag's names and scope (`tabs`): root, list, trigger,
 * content and indicator. The spec's `panel` is Zag's `content` (D-019).
 * Triggers and contents are named per value (`ids.trigger(value)`), so the
 * adapters map authored ids per value rather than per part.
 *
 * The options for the React and Vue adapters are mapped here, next to the
 * definition, rather than in `core/options.ts`.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/tabs';

import type { WidgetDefinition } from '../core/widget';
import type { Direction } from '../positioning';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type TabsProps = zag.Props;
export type TabsApi = zag.Api;

/** The `data-scope` Tabs' parts carry. */
export const TABS_SCOPE = 'tabs';

export const tabs: WidgetDefinition<Schema, TabsApi> = {
  scope: TABS_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) => zag.connect(service as never, normalize),
};

/** How a tab is selected from the keyboard. */
export type TabsActivationMode = 'automatic' | 'manual';

/** Tabs' layout, which picks the arrow keys that move between tabs. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** Part ids for Tabs: the root, list and indicator by id, triggers and contents per value. */
export interface TabsIds {
  root?: string;
  list?: string;
  indicator?: string;
  trigger?: (value: string) => string;
  content?: (value: string) => string;
}

/** Options for `useTabs` in React and Vue. */
export interface TabsOptions {
  /** Controlled value: the selected tab. Pair it with `onValueChange`. */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Called when another tab is selected, by click or the keyboard. */
  onValueChange?: (details: { value: string }) => void;
  /** Called when focus moves to another tab. */
  onFocusChange?: (details: { focusedValue: string }) => void;
  /** Default `horizontal`. */
  orientation?: TabsOrientation;
  /** Default `automatic`: the arrow keys select. `manual` only moves focus. */
  activationMode?: TabsActivationMode;
  /** Wrap from the last tab to the first. Default true. */
  loopFocus?: boolean;
  /** Names the tablist (`aria-label`). */
  label?: string;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: TabsIds;
  /** Text direction. Defaults to `<html dir>`. */
  dir?: Direction;
}

/** The text direction: the option, else `<html dir>`. */
export function tabsDirection(dir?: Direction): Direction {
  if (dir) return dir;
  if (typeof document === 'undefined') return 'ltr';
  return document.documentElement.getAttribute('dir')?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * The first enabled trigger's value in a tablist, or undefined. React and
 * Vue select it when nothing is (as the Alpine adapter does), so a tab is
 * always in the Tab order, including tabs that render after mount.
 */
export function firstEnabledTab(listId: string | undefined): string | undefined {
  if (typeof document === 'undefined' || !listId) return undefined;
  const list = document.getElementById(listId);
  const first = list?.querySelector(
    '[data-scope="tabs"][data-part="trigger"]:not([disabled]):not([data-disabled])',
  );
  return first?.getAttribute('data-value') ?? undefined;
}

/** The tabs machine's props for `options`. */
export function toTabsProps(options: TabsOptions, id: string): Partial<TabsProps> {
  return {
    id,
    ids: options.ids,
    dir: tabsDirection(options.dir),
    value: options.value,
    defaultValue: options.defaultValue,
    orientation: options.orientation ?? 'horizontal',
    activationMode: options.activationMode ?? 'automatic',
    loopFocus: options.loopFocus ?? true,
    translations: options.label ? { listLabel: options.label } : undefined,
    onValueChange: ({ value }) => options.onValueChange?.({ value }),
    onFocusChange: ({ focusedValue }) => options.onFocusChange?.({ focusedValue }),
  };
}

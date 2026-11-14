/**
 * Accordion (#58) on Zag's accordion machine: triggers that are buttons in
 * headings, with aria-expanded and aria-controls, panels that are regions
 * labelled by their trigger and hidden while closed, ArrowDown and ArrowUp
 * between triggers (skipping disabled ones), Home and End.
 *
 * The parts keep Zag's scope (`accordion`). Zag's `item-trigger`,
 * `item-indicator` and `item-content` render as the spec's `trigger`,
 * `chevron` and `content` (the spec's panel, named as in Tabs) through
 * `repart()`: Zag finds the triggers by `data-controls` and `data-ownedby`,
 * never by part. Items, triggers and contents are named per value
 * (`ids.itemTrigger(value)`), so the adapters map authored ids per value.
 *
 * The options for the React and Vue adapters are mapped here, next to the
 * definition.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/accordion';

import type { WidgetDefinition } from '../core/widget';
import type { Direction } from '../positioning';
import { repart } from './combobox';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type AccordionProps = zag.Props;
export type AccordionApi = zag.Api;

/** The `data-scope` Accordion's parts carry. */
export const ACCORDION_SCOPE = 'accordion';

/** Zag's part names that the spec spells differently. */
export const ACCORDION_PARTS: Readonly<Record<string, string>> = {
  'item-trigger': 'trigger',
  'item-indicator': 'chevron',
  'item-content': 'content',
};

export const accordion: WidgetDefinition<Schema, AccordionApi> = {
  scope: ACCORDION_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) =>
    zag.connect(service as never, repart(normalize, ACCORDION_PARTS)) as AccordionApi,
};

/** Part ids for Accordion: the root by id, items, triggers and contents per value. */
export interface AccordionIds {
  root?: string;
  item?: (value: string) => string;
  itemTrigger?: (value: string) => string;
  itemContent?: (value: string) => string;
}

/** Options for `useAccordion` in React and Vue. */
export interface AccordionOptions {
  /** Controlled value: the open items. Pair it with `onValueChange`. */
  value?: string[];
  /** The items open at first when uncontrolled. */
  defaultValue?: string[];
  /** Called when an item opens or closes, by click or the keyboard. */
  onValueChange?: (details: { value: string[] }) => void;
  /** Several items open at once. Default false. */
  multiple?: boolean;
  /** The open item of a single accordion can close. Default true. */
  collapsible?: boolean;
  /** Disables every item. */
  disabled?: boolean;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: AccordionIds;
  /** Text direction. Defaults to `<html dir>`. */
  dir?: Direction;
}

/** The accordion machine's props for `options`. */
export function toAccordionProps(options: AccordionOptions, id: string): Partial<AccordionProps> {
  return {
    id,
    ids: options.ids,
    dir: options.dir,
    value: options.value,
    defaultValue: options.defaultValue,
    multiple: options.multiple ?? false,
    collapsible: options.collapsible ?? true,
    disabled: options.disabled,
    onValueChange: ({ value }) => options.onValueChange?.({ value }),
  };
}

/** A value as the open items: an array, a single string, or none. */
export function toOpenItems(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item) => item != null && item !== '').map(String);
  if (value == null || value === '') return [];
  return [String(value)];
}

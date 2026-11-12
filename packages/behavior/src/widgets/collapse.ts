/**
 * Collapse (#58) on Zag's collapsible machine: a trigger button with
 * aria-expanded and aria-controls, and a region hidden while closed. A
 * read-more passes `collapsedHeight`, so its closed region stays rendered,
 * clamped, and in the accessibility tree.
 *
 * Zag scopes the parts `collapsible`; they carry the spec's `collapse`
 * through `rescope()`, and Zag's `indicator` renders as the spec's `icon`
 * through `repart()`. Zag finds the parts by id.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/collapsible';

import type { Normalize, WidgetDefinition } from '../core/widget';
import type { Direction } from '../positioning';
import { repart } from './combobox';
import { rescope } from './dropdown-menu';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type CollapseProps = zag.Props;
export type CollapseApi = zag.Api;

/** The `data-scope` Collapse's parts carry. */
export const COLLAPSE_SCOPE = 'collapse';

/** Zag's part names that the spec spells differently. */
export const COLLAPSE_PARTS: Readonly<Record<string, string>> = { indicator: 'icon' };

/** A read-more's clamped height: the token, 64px by default. */
export const COLLAPSE_CLAMP_HEIGHT = 'var(--apui-collapse-clamp-height, 64px)';

/**
 * Drops the `min-height` Zag gives a closed read-more's content alongside its
 * `max-height`: it would pad content shorter than the clamp to the clamp.
 */
function withoutCollapsedMinHeight(normalize: Normalize): Normalize {
  const trim = <T>(props: T): T => {
    const attrs = props as Record<string, unknown>;
    const style = attrs.style as Record<string, unknown> | undefined;
    if (attrs['data-part'] !== 'content' || !style || !('minHeight' in style)) return props;
    const { minHeight: _minHeight, ...rest } = style;
    return { ...attrs, style: rest } as T;
  };
  // Zag's normalizers are proxies whose every key (`element`, `button`, …)
  // is the same function, except `style`.
  return new Proxy(normalize, {
    get(target, key) {
      const value = Reflect.get(target, key) as unknown;
      if (typeof value !== 'function' || key === 'style') return value;
      return (props: unknown) => (value as (p: unknown) => unknown)(trim(props));
    },
  });
}

export const collapse: WidgetDefinition<Schema, CollapseApi> = {
  scope: COLLAPSE_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) =>
    zag.connect(
      service as never,
      rescope(
        repart(withoutCollapsedMinHeight(normalize), COLLAPSE_PARTS),
        'collapsible',
        COLLAPSE_SCOPE,
      ),
    ) as CollapseApi,
};

/** The two Collapse layouts. */
export type CollapseVariant = 'section' | 'read-more';

/** Part ids for Collapse. */
export interface CollapseIds {
  root?: string;
  trigger?: string;
  content?: string;
}

/** Options for `useCollapse` in React and Vue. */
export interface CollapseOptions {
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Whether it starts open when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the trigger opens or closes the region. */
  onOpenChange?: (details: { open: boolean }) => void;
  /** `read-more` clamps the closed region instead of hiding it. */
  variant?: CollapseVariant;
  disabled?: boolean;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: CollapseIds;
  /** Text direction. Defaults to `<html dir>`. */
  dir?: Direction;
}

/** The collapsible machine's props for `options`. */
export function toCollapseProps(options: CollapseOptions, id: string): Partial<CollapseProps> {
  return {
    id,
    ids: options.ids,
    dir: options.dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    disabled: options.disabled,
    collapsedHeight: options.variant === 'read-more' ? COLLAPSE_CLAMP_HEIGHT : undefined,
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
  };
}

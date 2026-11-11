/**
 * DropdownMenu (pilot #50) on Zag's menu machine: `role=menu` with
 * `menuitem`, `menuitemcheckbox` and `menuitemradio` items, arrow keys,
 * typeahead, Escape and outside-click dismissal, and a positioned panel.
 *
 * Zag scopes its parts `menu`, which is the navigation Menu's scope here, so
 * the definition renames it to `dropdown-menu` (D-019). The machine finds its
 * elements by id; only its fallbacks for several triggers on one menu
 * (`getTriggerProps({ value })`) query by scope, so a DropdownMenu has one
 * trigger.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/menu';

import type { Normalize, WidgetDefinition } from '../core/widget';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type DropdownMenuProps = zag.Props;
export type DropdownMenuApi = zag.Api;

/** The `data-scope` DropdownMenu's parts carry. */
export const DROPDOWN_MENU_SCOPE = 'dropdown-menu';

/**
 * A `normalize` that renames `data-scope` from `from` to `to` on every part
 * it builds, so a machine's parts can carry a component's scope.
 */
export function rescope(normalize: Normalize, from: string, to: string): Normalize {
  const rename = <T>(props: T): T => {
    const attrs = props as Record<string, unknown>;
    return (attrs['data-scope'] === from ? { ...attrs, 'data-scope': to } : props) as T;
  };
  // Zag's normalizers are proxies whose every key (`element`, `button`, …)
  // is the same function, except `style`, which has no data-scope to rename.
  return new Proxy(normalize, {
    get(target, key) {
      const value = Reflect.get(target, key) as unknown;
      if (typeof value !== 'function' || key === 'style') return value;
      return (props: unknown) => (value as (p: unknown) => unknown)(rename(props));
    },
  });
}

export const dropdownMenu: WidgetDefinition<Schema, DropdownMenuApi> = {
  scope: DROPDOWN_MENU_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) =>
    zag.connect(service as never, rescope(normalize, 'menu', DROPDOWN_MENU_SCOPE)),
};

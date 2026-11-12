/**
 * Drawer (#58) on Zag's dialog machine: the same focus trap, Escape and
 * outside-click dismissal, scroll lock, `aria-hidden` on the page behind it
 * and focus return as Dialog, for a panel that slides in from an edge.
 *
 * The parts keep the dialog machine's names (D-019): trigger, backdrop (the
 * spec's scrim), positioner, content (the panel, carrying `.apui-drawer`),
 * title, description and closeTrigger. Zag scopes them `dialog`, so the
 * definition renames the scope to `drawer`, as DropdownMenu does for the menu
 * machine. The dialog machine finds its elements by id; its only scope query
 * is a fallback for the element focus returns to, which then falls back to
 * the element focused before the drawer opened (the trigger, when it opened
 * the drawer).
 *
 * The side (`end`, `start`, `bottom`) is CSS only: logical properties put
 * `end` on the right in LTR and on the left in RTL.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/dialog';

import type { WidgetDefinition } from '../core/widget';
import { rescope } from './dropdown-menu';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type DrawerProps = zag.Props;
export type DrawerApi = zag.Api;

/** The `data-scope` Drawer's parts carry. */
export const DRAWER_SCOPE = 'drawer';

/** The edge a drawer slides in from. `end` and `start` follow the text direction. */
export type DrawerSide = 'end' | 'start' | 'bottom';

export const drawer: WidgetDefinition<Schema, DrawerApi> = {
  scope: DRAWER_SCOPE,
  machine: zag.machine as Machine<Schema>,
  connect: (service, normalize) =>
    zag.connect(service as never, rescope(normalize, 'dialog', DRAWER_SCOPE)),
};

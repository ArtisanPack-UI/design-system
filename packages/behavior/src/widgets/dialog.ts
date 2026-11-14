/**
 * Dialog (#34, pilot #49) on Zag's dialog machine: focus trap, Escape and
 * outside-click dismissal, scroll lock, `aria-hidden` on everything else, and
 * focus returned to the trigger.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/dialog';

import type { WidgetDefinition } from '../core/widget';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type DialogProps = zag.Props;
export type DialogApi = zag.Api;

export const dialog: WidgetDefinition<Schema, DialogApi> = {
  scope: 'dialog',
  machine: zag.machine,
  connect: (service, normalize) => zag.connect(service, normalize),
};

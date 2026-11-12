/** What the Drawer, Popover and Tooltip fixtures (React, Vue) share with the Alpine tests. */
import type { OverlayPlacement } from '../../src/widgets/popover';

export interface OverlaysFixture {
  /** `controlled`: the parent owns `open`. `uncontrolled`: the widget does. */
  mode: 'controlled' | 'uncontrolled';
  placement?: OverlayPlacement;
}

export const DRAWER_IDS = {
  trigger: 'd-trigger',
  backdrop: 'd-backdrop',
  positioner: 'd-positioner',
  content: 'd-content',
  title: 'd-title',
  closeTrigger: 'd-close',
};

export const POPOVER_IDS = {
  trigger: 'p-trigger',
  positioner: 'p-positioner',
  content: 'p-content',
  arrow: 'p-arrow',
  title: 'p-title',
};

export const TOOLTIP_IDS = {
  trigger: 't-trigger',
  positioner: 't-positioner',
  content: 't-content',
  arrow: 't-arrow',
};

export interface OverlaysFixtureApi {
  mount(options: OverlaysFixture): void;
  /** Sets the parent's open state for one widget. */
  set(widget: 'drawer' | 'popover' | 'tooltip', open: boolean): void;
  events: [string, unknown][];
}

export function installOverlays(
  api: Pick<OverlaysFixtureApi, 'mount' | 'set'>,
): OverlaysFixtureApi {
  const fixture: OverlaysFixtureApi = { ...api, events: [] };
  (window as unknown as { overlaysFixture: OverlaysFixtureApi }).overlaysFixture = fixture;
  return fixture;
}

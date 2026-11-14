/**
 * Drawer, Popover and Tooltip through the Vue adapter (#58, #59), with the
 * same ids as the Alpine tests. Render functions, so no SFC compiler is needed.
 */
import { type App, createApp, defineComponent, h, ref } from 'vue';

import { useDrawer, usePopover, useTooltip } from '../../src/vue';
import {
  DRAWER_IDS,
  installOverlays,
  type OverlaysFixture,
  POPOVER_IDS,
  TOOLTIP_IDS,
} from './overlays-shared';

const opens = { drawer: ref(false), popover: ref(false), tooltip: ref(false) };
const fixture = installOverlays({ mount, set: (widget, open) => (opens[widget].value = open) });
let app: App | undefined;

function state(name: keyof typeof opens, options: OverlaysFixture) {
  return options.mode === 'controlled'
    ? {
        open: opens[name].value,
        onOpenChange: ({ open }: { open: boolean }) => {
          fixture.events.push([`${name}:open-change`, open]);
          opens[name].value = open;
        },
      }
    : {
        onOpenChange: ({ open }: { open: boolean }) =>
          fixture.events.push([`${name}:open-change`, open]),
      };
}

function mount(options: OverlaysFixture) {
  app?.unmount();
  for (const open of Object.values(opens)) open.value = false;
  const Overlays = defineComponent(() => {
    const drawer = useDrawer(() => ({ ids: DRAWER_IDS, ...state('drawer', options) }));
    const popover = usePopover(() => ({
      ids: POPOVER_IDS,
      placement: options.placement,
      ...state('popover', options),
    }));
    const tooltip = useTooltip(() => ({
      ids: TOOLTIP_IDS,
      placement: options.placement ?? 'top',
      delay: 100,
      ...state('tooltip', options),
    }));
    return () =>
      h('div', { style: { padding: '160px' } }, [
        h('button', drawer.value.getTriggerProps(), 'Filters'),
        h('div', drawer.value.getBackdropProps()),
        h('div', drawer.value.getPositionerProps(), [
          h('aside', drawer.value.getContentProps(), [
            h('h2', drawer.value.getTitleProps(), 'Filters'),
            h('input', { id: 'd-field' }),
            h('button', drawer.value.getCloseTriggerProps(), 'Close'),
          ]),
        ]),
        h('button', popover.value.getTriggerProps(), 'Share'),
        h('div', popover.value.getPositionerProps(), [
          h('div', popover.value.getContentProps(), [
            h('span', popover.value.getArrowProps()),
            h('h3', popover.value.getTitleProps(), 'Share report'),
            h('button', { id: 'p-copy' }, 'Copy'),
          ]),
        ]),
        h('button', { ...tooltip.value.getTriggerProps(), 'aria-label': 'Archive' }, 'A'),
        h('div', tooltip.value.getPositionerProps(), [
          h('div', tooltip.value.getContentProps(), [
            h('span', tooltip.value.getArrowProps()),
            'Archive',
          ]),
        ]),
      ]);
  });
  app = createApp(Overlays);
  app.mount('#root');
}

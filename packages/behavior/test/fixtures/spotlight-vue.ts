/**
 * Spotlight through the Vue adapter, with the same ids and markup as the
 * React fixture. Built with esbuild and loaded into Chromium.
 */
import { type App, createApp, defineComponent, h, nextTick, ref } from 'vue';

import { useSpotlight } from '../../src/vue';
import {
  install,
  SPOTLIGHT_GROUPS,
  SPOTLIGHT_IDS,
  type SpotlightFixture,
} from './spotlight-shared';

const open = ref(false);
const search = ref('');
let state: { open?: boolean; search?: string } = {};

function palette(options: SpotlightFixture) {
  return defineComponent({
    setup() {
      const spotlight = useSpotlight(() => ({
        id: 's',
        ids: SPOTLIGHT_IDS,
        groups: SPOTLIGHT_GROUPS,
        remote: options.remote,
        loading: options.loading,
        shortcut: options.shortcut,
        recent: true,
        ...(options.mode === 'controlled' ? { open: open.value } : { defaultOpen: false }),
        ...(options.controlledSearch ? { search: search.value } : {}),
        onOpenChange: (next: boolean) => {
          fixture.events.push(['open-change', { open: next }]);
          if (options.mode === 'controlled') open.value = next;
        },
        onSearchChange: (next: string) => {
          fixture.events.push(['search-change', { search: next }]);
          if (options.controlledSearch) search.value = next;
        },
        onSelect: (item) => fixture.events.push(['select', { value: item.value, item }]),
      }));

      return () => {
        const api = spotlight.value;
        state = { open: api.open, search: api.query };
        return h('div', { id: 'host' }, [
          h('button', api.getTriggerProps(), 'Search'),
          h('div', api.getBackdropProps()),
          h('div', api.getPositionerProps(), [
            h('div', { ...api.getContentProps(), class: 'apui-spotlight' }, [
              h('div', api.getSearchProps(), [
                h('input', { ...api.getQueryProps(), 'aria-label': 'Search' }),
                h('button', { ...api.getCloseTriggerProps(), 'aria-label': 'Close' }, 'Esc'),
              ]),
              h('div', { ...api.getResultsProps(), 'aria-label': 'Search' }, [
                ...api.groups.map((group) =>
                  h('div', { key: group.id, ...api.getItemGroupProps({ id: group.id }) }, [
                    h('div', api.getItemGroupLabelProps({ htmlFor: group.id }), group.label),
                    ...group.items.map((item) =>
                      h(
                        item.href ? 'a' : 'div',
                        { key: item.value, href: item.href, ...api.getItemProps({ item }) },
                        [h('span', api.getItemTextProps({ item }), item.label)],
                      ),
                    ),
                  ]),
                ),
                h('div', { id: 's-empty', ...api.getEmptyProps() }, 'No results.'),
                h('div', { id: 's-loading', ...api.getLoadingProps() }, 'Searching…'),
              ]),
            ]),
          ]),
        ]);
      };
    },
  });
}

let app: App | undefined;

const fixture = install({
  mount(options) {
    open.value = false;
    search.value = '';
    app = createApp(palette(options));
    app.mount('#root');
  },
  unmount() {
    app?.unmount();
    app = undefined;
  },
  set(key, value) {
    if (key === 'open') open.value = Boolean(value);
    else search.value = String(value);
    void nextTick();
  },
  get(key) {
    return state[key];
  },
});

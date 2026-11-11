/**
 * Tabs through the Vue adapter (#56), with the same ids as the Alpine tests.
 * Render functions, so no SFC compiler is needed.
 */
import { type App, createApp, defineComponent, h, ref } from 'vue';

import { useTabs } from '../../src/vue';
import { TABS, TABS_IDS, type TabsFixture, installTabs } from './tabs-shared';

const value = ref('overview');
const shown = ref(TABS);
const fixture = installTabs({
  mount,
  set: (next) => (value.value = next),
  load: () => (shown.value = TABS),
});
let app: App | undefined;

function mount(options: TabsFixture) {
  app?.unmount();
  value.value = options.initial ?? 'overview';
  shown.value = options.late ? [] : TABS;
  const Tabs = defineComponent(() => {
    const tabs = useTabs(() => ({
      ids: TABS_IDS,
      activationMode: options.activationMode,
      label: 'Sections',
      ...(options.mode === 'uncontrolled'
        ? { defaultValue: options.initial }
        : { value: value.value }),
      onValueChange: (details) => {
        fixture.events.push(['value-change', details]);
        if (options.mode === 'controlled') value.value = details.value;
      },
    }));
    return () => {
      fixture.value = options.mode === 'uncontrolled' ? tabs.value.value : value.value;
      return h('div', { id: 'tabs', ...tabs.value.getRootProps() }, [
        h(
          'div',
          tabs.value.getListProps(),
          shown.value.map(([v, label, disabled]) =>
            h('button', { key: v, ...tabs.value.getTriggerProps({ value: v, disabled }) }, label),
          ),
        ),
        ...shown.value.map(([v, label]) =>
          h('div', { key: v, ...tabs.value.getContentProps({ value: v }) }, `${label} panel`),
        ),
      ]);
    };
  });
  app = createApp(Tabs);
  app.mount('#root');
}

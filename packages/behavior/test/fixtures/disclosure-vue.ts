/**
 * Accordion and Collapse through the Vue adapter (#58), with the same ids as
 * the Alpine tests. Render functions, so no SFC compiler is needed.
 */
import { type App, createApp, defineComponent, h, ref } from 'vue';

import { useAccordion, useCollapse } from '../../src/vue';
import {
  ACCORDION_IDS,
  COLLAPSE_IDS,
  type DisclosureFixture,
  installDisclosure,
  ITEMS,
} from './disclosure-shared';

const items = ref<string[]>([]);
const open = ref(false);
const fixture = installDisclosure({
  mount,
  set: (next) => {
    if (Array.isArray(next)) items.value = next;
    else open.value = next;
  },
});
let app: App | undefined;

function mount(options: DisclosureFixture) {
  app?.unmount();
  fixture.events = [];
  items.value = options.initial ?? [];
  open.value = options.open ?? false;
  const Accordion = defineComponent(() => {
    const accordion = useAccordion(() => ({
      ids: ACCORDION_IDS,
      multiple: options.multiple,
      ...(options.mode === 'uncontrolled'
        ? { defaultValue: options.initial }
        : { value: items.value }),
      onValueChange: (details) => {
        fixture.events.push(['value-change', details]);
        if (options.mode === 'controlled') items.value = details.value;
      },
    }));
    return () => {
      const api = accordion.value;
      fixture.value = options.mode === 'uncontrolled' ? api.value : items.value;
      return h(
        'div',
        api.getRootProps(),
        ITEMS.map(([v, title, disabled]) =>
          h('div', { key: v, ...api.getItemProps({ value: v, disabled }) }, [
            h('h3', [
              h('button', api.getItemTriggerProps({ value: v, disabled }), [
                title,
                h('span', api.getItemIndicatorProps({ value: v })),
              ]),
            ]),
            h('div', api.getItemContentProps({ value: v }), `${title} answer`),
          ]),
        ),
      );
    };
  });
  const Collapse = defineComponent(() => {
    const collapse = useCollapse(() => ({
      ids: COLLAPSE_IDS,
      variant: options.variant,
      ...(options.mode === 'uncontrolled' ? { defaultOpen: options.open } : { open: open.value }),
      onOpenChange: (details) => {
        fixture.events.push(['open-change', details]);
        if (options.mode === 'controlled') open.value = details.open;
      },
    }));
    return () => {
      const api = collapse.value;
      fixture.value = options.mode === 'uncontrolled' ? api.open : open.value;
      return h('div', api.getRootProps(), [
        h('button', api.getTriggerProps(), [
          'Advanced settings',
          h('span', api.getIndicatorProps()),
        ]),
        h('div', api.getContentProps(), 'Custom URL and search visibility.'),
      ]);
    };
  });
  app = createApp(options.widget === 'accordion' ? Accordion : Collapse);
  app.mount('#root');
}

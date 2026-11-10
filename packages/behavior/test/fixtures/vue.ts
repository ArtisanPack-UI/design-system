/**
 * Dialog and Combobox through the Vue adapter, with the same markup and ids
 * as the Alpine tests. Built with esbuild and loaded into Chromium; render
 * functions, so no SFC compiler is needed.
 */
import { type App, computed, createApp, defineComponent, h, nextTick, ref } from 'vue';

import type { ComboboxValue } from '../../src/core/options';
import { useCombobox, useDialog } from '../../src/vue';
import {
  COMBOBOX_IDS,
  COUNTRIES,
  type ComboboxFixture,
  DIALOG_IDS,
  type DialogFixture,
  install,
  toItems,
} from './shared';

/** The parent's state, for `fixture.set` and `fixture.get`. */
const open = ref(false);
const value = ref<ComboboxValue>(null);
const pairs = ref<[string, string][]>(COUNTRIES);
/** What `fixture.get` reads in uncontrolled mode: the widget's own state. */
let own: { open?: () => boolean; value?: () => ComboboxValue } = {};

const Dialog = defineComponent({
  props: { options: { type: Object as () => DialogFixture, required: true } },
  setup(props) {
    const { mode, initial, id } = props.options;
    const dialog = useDialog(() => ({
      id,
      ids: DIALOG_IDS,
      ...(mode === 'uncontrolled' ? { defaultOpen: initial } : { open: open.value }),
      onOpenChange: (details) => {
        fixture.events.push(['open-change', details]);
        if (mode === 'controlled') open.value = details.open;
      },
    }));
    own = { open: () => dialog.value.open };

    return () =>
      h('div', { id: 'dialog' }, [
        h('button', dialog.value.getTriggerProps(), 'Edit profile'),
        h('div', dialog.value.getBackdropProps()),
        h('div', dialog.value.getPositionerProps(), [
          h('div', dialog.value.getContentProps(), [
            h('h2', dialog.value.getTitleProps(), 'Edit profile'),
            h('p', dialog.value.getDescriptionProps(), 'Saved 0 times.'),
            h('input', { id: 'name', value: 'Jordan' }),
            h('button', { id: 'save' }, 'Save'),
            h('button', dialog.value.getCloseTriggerProps(), 'Close'),
          ]),
        ]),
      ]);
  },
});

const Combobox = defineComponent({
  props: { options: { type: Object as () => ComboboxFixture, required: true } },
  setup(props) {
    const { mode, initial, multiple, remote, id } = props.options;
    const items = computed(() => toItems(pairs.value));
    const cb = useCombobox(() => ({
      id,
      ids: COMBOBOX_IDS,
      items: items.value,
      multiple,
      remote,
      ...(mode === 'uncontrolled' ? { defaultValue: initial } : { value: value.value }),
      onValueChange: (details) => {
        fixture.events.push(['value-change', details]);
        if (mode === 'controlled') value.value = details.value;
      },
      onInputValueChange: (details) => fixture.events.push(['input-value-change', details]),
      onOpenChange: (details) => fixture.events.push(['open-change', details]),
    }));
    own = {
      value: () => (multiple ? cb.value.value : (cb.value.value[0] ?? null)),
    };

    return () =>
      h('div', { id: 'cb' }, [
        h('label', cb.value.getLabelProps(), 'Country'),
        h('div', cb.value.getControlProps(), [
          h('input', cb.value.getInputProps()),
          h('button', cb.value.getTriggerProps(), '▾'),
        ]),
        h('div', cb.value.getPositionerProps(), [
          h('ul', cb.value.getContentProps(), [
            ...cb.value.items.map((item) =>
              h('li', { key: item.value, ...cb.value.getItemProps({ item }) }, item.label),
            ),
            h('li', { id: 'cb-empty', ...cb.value.getEmptyProps() }, 'No matches'),
          ]),
        ]),
      ]);
  },
});

let app: App | undefined;
let controlled = false;

function render(component: object, options: DialogFixture | ComboboxFixture) {
  fixture.unmount();
  controlled = options.mode !== 'uncontrolled';
  app = createApp(component, { options });
  app.mount('#root');
}

const fixture = install({
  dialog(options) {
    open.value = options.initial ?? false;
    render(Dialog, options);
  },
  combobox(options) {
    value.value = options.initial ?? (options.multiple ? [] : null);
    pairs.value = options.items ?? COUNTRIES;
    render(Combobox, options);
  },
  unmount() {
    app?.unmount();
    app = undefined;
    own = {};
  },
  set(key, next) {
    if (key === 'open') open.value = next as boolean;
    if (key === 'value') value.value = next as ComboboxValue;
    if (key === 'items') pairs.value = next as [string, string][];
    void nextTick();
  },
  get(key) {
    if (key === 'open') return controlled ? open.value : own.open?.();
    return controlled ? value.value : own.value?.();
  },
});

/**
 * Dialog and Combobox through the Vue adapter, with the same markup and ids
 * as the Alpine tests. Built with esbuild and loaded into Chromium; render
 * functions, so no SFC compiler is needed.
 */
import { type App, computed, createApp, defineComponent, h, nextTick, ref } from 'vue';

import type { ComboboxValue } from '../../src/core/options';
import {
  createToaster,
  type Toaster as CoreToaster,
  type ToasterApi,
  type ToastEntry,
  useCombobox,
  useDialog,
  useDropdownMenu,
  useToast,
  useToaster,
} from '../../src/vue';
import {
  COMBOBOX_IDS,
  COUNTRIES,
  type ComboboxFixture,
  DIALOG_IDS,
  type DialogFixture,
  install,
  MENU_IDS,
  MENU_ITEMS,
  type MenuFixture,
  toItems,
  type ToasterFixture,
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

const Menu = defineComponent({
  props: { options: { type: Object as () => MenuFixture, required: true } },
  setup(props) {
    const { mode, initial, id } = props.options;
    const grid = ref(false);
    const menu = useDropdownMenu(() => ({
      id,
      ids: MENU_IDS,
      ...(mode === 'uncontrolled' ? { defaultOpen: initial } : { open: open.value }),
      onOpenChange: (details) => {
        fixture.events.push(['open-change', details]);
        if (mode === 'controlled') open.value = details.open;
      },
      onSelect: (details) => fixture.events.push(['select', details]),
    }));
    own = { open: () => menu.value.open };
    const option = () => ({
      type: 'checkbox' as const,
      value: 'grid',
      checked: grid.value,
      onCheckedChange: (checked: boolean) => {
        fixture.events.push(['checked-change', { value: 'grid', checked }]);
        grid.value = checked;
      },
    });

    return () =>
      h('div', { id: 'menu' }, [
        h('button', menu.value.getTriggerProps(), 'Options'),
        h('div', menu.value.getPositionerProps(), [
          h('div', menu.value.getContentProps(), [
            h('div', menu.value.getItemGroupProps({ id: 'edit' }), [
              h('div', menu.value.getItemGroupLabelProps({ htmlFor: 'edit' }), 'Edit'),
              ...MENU_ITEMS.map(([value, label, disabled]) =>
                h('div', { key: value, ...menu.value.getItemProps({ value, disabled }) }, [
                  h('span', menu.value.getItemTextProps({ value }), label),
                ]),
              ),
            ]),
            h('hr', menu.value.getSeparatorProps()),
            h('div', menu.value.getOptionItemProps(option()), [
              h('span', menu.value.getItemIndicatorProps(option()), '✓'),
              h('span', menu.value.getItemTextProps(option()), 'Show grid'),
            ]),
          ]),
        ]),
      ]);
  },
});

const ToastItem = defineComponent({
  props: {
    entry: { type: Object as () => ToastEntry, required: true },
    parentService: { type: Object as () => ToasterApi['service'], required: true },
    index: { type: Number, required: true },
  },
  setup(props) {
    const toast = useToast(
      () => props.entry,
      props.parentService,
      () => props.index,
    );
    return () =>
      h('div', toast.value.getRootProps(), [
        h('span', toast.value.getIconProps()),
        h('p', toast.value.getTitleProps(), toast.value.title),
        h('p', toast.value.getDescriptionProps(), toast.value.description),
        h('button', toast.value.getCloseTriggerProps(), '×'),
      ]);
  },
});

let toaster: CoreToaster | undefined;

const Toaster = defineComponent({
  props: { options: { type: Object as () => ToasterFixture, required: true } },
  setup(props) {
    const instance = (toaster = createToaster({ duration: 0 }));
    const region = useToaster({ toaster: instance, id: props.options.id });
    return () =>
      h('div', { id: 'toaster' }, [
        h(
          'div',
          region.value.getGroupProps({ label: 'Notifications' }),
          region.value.toasts.map((entry, index) =>
            h(ToastItem, {
              key: entry.id,
              entry,
              parentService: region.value.service,
              index,
            }),
          ),
        ),
      ]);
  },
});

let app: App | undefined;
let controlled = false;

function render(
  component: object,
  options: DialogFixture | ComboboxFixture | MenuFixture | ToasterFixture,
) {
  fixture.unmount();
  controlled = 'mode' in options && options.mode !== 'uncontrolled';
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
  menu(options) {
    open.value = options.initial ?? false;
    render(Menu, options);
  },
  toaster(options) {
    render(Toaster, options);
  },
  toast(options) {
    toaster?.create(options);
    void nextTick();
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

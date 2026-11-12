/**
 * Every Vue composable rendered inside `<div dir="rtl">` on an LTR page, for
 * direction-frameworks.test.ts: each widget must measure the direction it
 * sits in, not read `<html dir>`.
 */
import { createApp, defineComponent, h } from 'vue';

import {
  createToaster,
  useColorPicker,
  useCombobox,
  useDatePicker,
  useDialog,
  useDropdownMenu,
  useSpotlight,
  useTabs,
  useToaster,
} from '../../src/vue';

const Widgets = defineComponent({
  setup() {
    const dialog = useDialog({ id: 'dialog' });
    const combobox = useCombobox({ id: 'combobox', items: [{ value: 'a', label: 'A' }] });
    const menu = useDropdownMenu({ id: 'menu' });
    const tabs = useTabs({ id: 'tabs', defaultValue: 'one' });
    const color = useColorPicker({ id: 'color' });
    const spotlight = useSpotlight({ id: 'spotlight', groups: [] });
    const region = useToaster({ id: 'toaster', toaster: createToaster() });
    const date = useDatePicker({ id: 'date', defaultValue: '2026-11-12' });

    return () => {
      const d = date.value;
      return [
        h('button', { 'data-test': 'dialog', ...dialog.value.getTriggerProps() }, 'Open'),
        h('div', combobox.value.getControlProps(), [
          h('input', {
            'data-test': 'combobox',
            ...combobox.value.getInputProps(),
            'aria-label': 'Pick',
          }),
        ]),
        h('button', { 'data-test': 'menu', ...menu.value.getTriggerProps() }, 'Menu'),
        h('div', { 'data-test': 'tabs', ...tabs.value.getRootProps() }, [
          h('div', tabs.value.getListProps(), [
            h('button', tabs.value.getTriggerProps({ value: 'one' }), 'One'),
          ]),
        ]),
        h('div', { 'data-test': 'color', ...color.value.getRootProps() }),
        h('button', { 'data-test': 'spotlight', ...spotlight.value.getTriggerProps() }, 'Search'),
        h('div', { 'data-test': 'toaster', ...region.value.getGroupProps() }),
        h('div', { 'data-test': 'date', ...d.getRootProps() }, [
          h('div', d.getControlProps(), [
            h('button', d.getTriggerProps(), 'Choose'),
            h('input', { ...d.getInputProps(), 'aria-label': 'Date' }),
          ]),
          h('div', d.getPositionerProps(), [
            h('div', d.getContentProps(), [
              h('table', d.getTableProps(), [
                h(
                  'tbody',
                  d.getTableBodyProps(),
                  d.weeks.map((week, row) =>
                    h(
                      'tr',
                      { key: row, ...d.getTableRowProps() },
                      week.map((day) =>
                        h(
                          'td',
                          { key: day.toString(), ...d.getDayTableCellProps({ value: day }) },
                          [
                            h(
                              'div',
                              d.getDayTableCellTriggerProps({ value: day }),
                              String(day.day),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ]),
            ]),
          ]),
        ]),
      ];
    };
  },
});

createApp(Widgets).mount('#root');
(window as unknown as { mounted: boolean }).mounted = true;

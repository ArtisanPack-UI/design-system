/**
 * DatePicker through the Vue adapter (#55), with the same ids as the Alpine
 * tests. Built with esbuild by date-picker-frameworks.test.ts; render
 * functions, so no SFC compiler is needed.
 */
import { type App, createApp, defineComponent, h, nextTick, ref } from 'vue';

import { type DatePickerValue, timeOptions, useDatePicker } from '../../src/vue';
import { DATE_PICKER_IDS, type DatePickerFixture, installDatePicker } from './date-picker-shared';

const value = ref<DatePickerValue>(null);

const Picker = defineComponent({
  props: { options: { type: Object as () => DatePickerFixture, required: true } },
  setup(props) {
    const options = props.options;
    const controlled = options.mode !== 'uncontrolled';
    value.value = options.initial ?? null;
    const dp = useDatePicker(() => ({
      id: 'dp',
      ids: DATE_PICKER_IDS,
      locale: 'en-US',
      ...options.picker,
      ...(controlled ? { value: value.value } : { defaultValue: options.initial }),
      onValueChange: (details) => {
        fixture.events.push(['value-change', details]);
        if (controlled) value.value = details.value;
      },
      onOpenChange: (details) => fixture.events.push(['open-change', details]),
    }));
    const range = options.picker?.mode === 'range';

    return () => {
      const api = dp.value;
      return h('div', api.getRootProps(), [
        h('label', api.getLabelProps(), 'Move-in date'),
        h('div', api.getControlProps(), [
          h('button', api.getTriggerProps(), '📅'),
          h('input', api.getInputProps({ index: 0 })),
          range
            ? h('input', { ...api.getInputProps({ index: 1 }), 'aria-label': 'End date' })
            : null,
        ]),
        h('div', api.getPositionerProps(), [
          h('div', api.getContentProps(), [
            h('div', api.getViewControlProps(), [
              h('button', api.getPrevTriggerProps(), '‹'),
              h('span', api.getRangeTextProps(), api.visibleRangeText.start),
              h('button', api.getNextTriggerProps(), '›'),
            ]),
            h('table', api.getTableProps(), [
              h('thead', api.getTableHeadProps(), [
                h(
                  'tr',
                  api.getTableRowProps(),
                  api.weekDays.map((day, i) =>
                    h('th', { key: i, ...api.getTableHeaderProps(), abbr: day.long }, day.short),
                  ),
                ),
              ]),
              h(
                'tbody',
                api.getTableBodyProps(),
                api.weeks.map((week, r) =>
                  h(
                    'tr',
                    { key: r, ...api.getTableRowProps() },
                    week.map((day) =>
                      h(
                        'td',
                        { key: day.toString(), ...api.getDayTableCellProps({ value: day }) },
                        [
                          h(
                            'div',
                            api.getDayTableCellTriggerProps({ value: day }),
                            String(day.day),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ]),
            options.picker?.time
              ? h(
                  'div',
                  api.getTimeListProps({ label: 'Time', id: 'dp-times' }),
                  timeOptions(30).map((t) =>
                    h(
                      'div',
                      { key: t.value, ...api.getTimeOptionProps({ value: t.value }) },
                      t.label,
                    ),
                  ),
                )
              : null,
          ]),
        ]),
      ]);
    };
  },
});

let app: App | undefined;

const fixture = installDatePicker({
  mount(options) {
    app?.unmount();
    app = createApp(Picker, { options });
    app.mount('#root');
  },
  async set(next) {
    value.value = next;
    await nextTick();
  },
  get: () => value.value,
});

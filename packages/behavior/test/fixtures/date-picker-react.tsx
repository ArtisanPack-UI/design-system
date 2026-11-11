/**
 * DatePicker through the React adapter (#55), with the same ids as the Alpine
 * tests. Built with esbuild by date-picker-frameworks.test.ts.
 */
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import { type DatePickerValue, timeOptions, useDatePicker } from '../../src/react';
import { DATE_PICKER_IDS, type DatePickerFixture, installDatePicker } from './date-picker-shared';

const parent: { setValue?: (value: DatePickerValue) => void; value?: DatePickerValue } = {};

function Picker({ options }: { options: DatePickerFixture }) {
  const [value, setValue] = useState<DatePickerValue>(options.initial ?? null);
  parent.setValue = setValue;
  const controlled = options.mode !== 'uncontrolled';
  const api = useDatePicker({
    id: 'dp',
    ids: DATE_PICKER_IDS,
    locale: 'en-US',
    ...options.picker,
    ...(controlled ? { value } : { defaultValue: options.initial }),
    onValueChange: (details) => {
      fixture.events.push(['value-change', details]);
      if (controlled) setValue(details.value);
    },
    onOpenChange: (details) => fixture.events.push(['open-change', details]),
  });
  parent.value = controlled ? value : null;
  const range = options.picker?.mode === 'range';

  return (
    <div {...api.getRootProps()}>
      <label {...api.getLabelProps()}>Move-in date</label>
      <div {...api.getControlProps()}>
        <button {...api.getTriggerProps()}>📅</button>
        <input {...api.getInputProps({ index: 0 })} />
        {range ? <input {...api.getInputProps({ index: 1 })} aria-label="End date" /> : null}
      </div>
      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <div {...api.getViewControlProps()}>
            <button {...api.getPrevTriggerProps()}>‹</button>
            <span {...api.getRangeTextProps()}>{api.visibleRangeText.start}</span>
            <button {...api.getNextTriggerProps()}>›</button>
          </div>
          <table {...api.getTableProps()}>
            <thead {...api.getTableHeadProps()}>
              <tr {...api.getTableRowProps()}>
                {api.weekDays.map((day, i) => (
                  <th key={i} {...api.getTableHeaderProps()} abbr={day.long}>
                    {day.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody {...api.getTableBodyProps()}>
              {api.weeks.map((week, r) => (
                <tr key={r} {...api.getTableRowProps()}>
                  {week.map((day) => (
                    <td key={day.toString()} {...api.getDayTableCellProps({ value: day })}>
                      <div {...api.getDayTableCellTriggerProps({ value: day })}>{day.day}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {options.picker?.time ? (
            <div {...api.getTimeListProps({ label: 'Time', id: 'dp-times' })}>
              {timeOptions(30).map((t) => (
                <div key={t.value} {...api.getTimeOptionProps({ value: t.value })}>
                  {t.label}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

let root: Root | undefined;

const fixture = installDatePicker({
  mount(options) {
    root?.unmount();
    root = createRoot(document.getElementById('root')!);
    flushSync(() => root!.render(<Picker options={options} />));
  },
  set(value) {
    flushSync(() => parent.setValue?.(value));
  },
  get: () => parent.value ?? null,
});

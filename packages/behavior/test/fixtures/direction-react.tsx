/**
 * Every React hook rendered inside `<div dir="rtl">` on an LTR page, for
 * direction-frameworks.test.ts: each widget must measure the direction it
 * sits in, not read `<html dir>`.
 */
import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';

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
} from '../../src/react';

function Widgets() {
  const dialog = useDialog({ id: 'dialog' });
  const combobox = useCombobox({ id: 'combobox', items: [{ value: 'a', label: 'A' }] });
  const menu = useDropdownMenu({ id: 'menu' });
  const tabs = useTabs({ id: 'tabs', defaultValue: 'one' });
  const color = useColorPicker({ id: 'color' });
  const spotlight = useSpotlight({ id: 'spotlight', groups: [] });
  const toaster = useMemo(() => createToaster(), []);
  const region = useToaster({ id: 'toaster', toaster });
  const date = useDatePicker({ id: 'date', defaultValue: '2026-11-12' });

  return (
    <>
      <button data-test="dialog" {...dialog.getTriggerProps()}>
        Open
      </button>
      <div {...combobox.getControlProps()}>
        <input data-test="combobox" {...combobox.getInputProps()} aria-label="Pick" />
      </div>
      <button data-test="menu" {...menu.getTriggerProps()}>
        Menu
      </button>
      <div data-test="tabs" {...tabs.getRootProps()}>
        <div {...tabs.getListProps()}>
          <button {...tabs.getTriggerProps({ value: 'one' })}>One</button>
        </div>
      </div>
      <div data-test="color" {...color.getRootProps()} />
      <button data-test="spotlight" {...spotlight.getTriggerProps()}>
        Search
      </button>
      <div data-test="toaster" {...region.getGroupProps()} />
      <div data-test="date" {...date.getRootProps()}>
        <div {...date.getControlProps()}>
          <button {...date.getTriggerProps()}>Choose</button>
          <input {...date.getInputProps()} aria-label="Date" />
        </div>
        <div {...date.getPositionerProps()}>
          <div {...date.getContentProps()}>
            <table {...date.getTableProps()}>
              <tbody {...date.getTableBodyProps()}>
                {date.weeks.map((week, row) => (
                  <tr key={row} {...date.getTableRowProps()}>
                    {week.map((day) => (
                      <td key={day.toString()} {...date.getDayTableCellProps({ value: day })}>
                        <div {...date.getDayTableCellTriggerProps({ value: day })}>{day.day}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Widgets />);
(window as unknown as { mounted: boolean }).mounted = true;

/**
 * The Calendar's Alpine component (#64): `x-data="apuiCalendar()"` on the
 * server-rendered `.apui-calendar`. The server renders every day, event and
 * tab stop (`Support\CalendarModel` in Livewire UI Components); this only
 * adds the keyboard: arrow keys between the grid's cells, following the
 * text direction (D-004), and roving focus in the view tabs. The view and
 * date controls dispatch `view-change` and `date-change` from the markup,
 * which the Livewire Calendar answers by re-rendering.
 */
import { calendarGridKeydown } from '../data/calendar';
import { rovingKeydown } from '../form/roving';

export function calendarComponent() {
  return {
    /** On the grid: moves between cells. */
    gridKeydown(event: KeyboardEvent) {
      calendarGridKeydown(event, event.currentTarget as Element);
    },
    /** On the view tablist: moves between tabs; Enter or Space chooses one. */
    tabsKeydown(event: KeyboardEvent) {
      rovingKeydown(event, event.currentTarget as Element, '[role="tab"]');
    },
  };
}

/**
 * The Calendar's Alpine component (#64): `x-data="apuiCalendar()"` on the
 * server-rendered `.apui-calendar`. The server renders every day, event and
 * tab stop (`Support\CalendarModel` in Livewire UI Components); this only
 * adds the keyboard: arrow keys between the grid's cells, following the
 * text direction (D-004), roving focus in the view tabs, and focus on the
 * day "+N more" opens. The view and date controls dispatch `view-change`
 * and `date-change` from the markup, which the Livewire Calendar answers by
 * re-rendering.
 */
import { calendarGridKeydown, focusCalendarCell } from '../data/calendar';
import { rovingKeydown } from '../form/roving';

/** How long "+N more" waits for the re-rendered day view before giving up. */
const MORE_FOCUS_TIMEOUT = 10_000;

interface AlpineMagics {
  $root: HTMLElement;
}

export function calendarComponent() {
  let watcher: MutationObserver | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const stopWatching = () => {
    watcher?.disconnect();
    watcher = null;
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };

  return {
    /** On the grid: moves between cells. */
    gridKeydown(event: KeyboardEvent) {
      calendarGridKeydown(event, event.currentTarget as Element);
    },
    /** On the view tablist: moves between tabs; Enter or Space chooses one. */
    tabsKeydown(event: KeyboardEvent) {
      rovingKeydown(event, event.currentTarget as Element, '[role="tab"]');
    },
    /**
     * On "+N more", before it asks for the day view: focuses the date's cell
     * now (the button is about to go) and, after the next re-render, again if
     * focus fell out of the calendar, so keyboard users stay on that day.
     */
    moreFocus(this: AlpineMagics, date: string) {
      const root = this.$root;
      stopWatching();
      focusCalendarCell(root, date);
      if (typeof MutationObserver === 'undefined') return;
      watcher = new MutationObserver(() => {
        stopWatching();
        const active = document.activeElement;
        if (!active || active === document.body || !root.contains(active)) {
          focusCalendarCell(root, date);
        }
      });
      watcher.observe(root, { childList: true, subtree: true });
      timer = setTimeout(stopWatching, MORE_FOCUS_TIMEOUT);
    },
    destroy() {
      stopWatching();
    },
  };
}

import { useState } from 'react';
import { Calendar, type CalendarEvent, type CalendarView } from '@artisanpack-ui/react';

export default function AgendaExample({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = useState<CalendarView>('agenda');
  const [date, setDate] = useState('2026-11-07');

  return (
    <Calendar
      events={events}
      view={view}
      onViewChange={setView}
      date={date}
      onDateChange={setDate}
      creatable
      onCreate={(day) => console.log('New event on', day)}
    />
  );
}

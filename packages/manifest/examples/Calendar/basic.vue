<script setup lang="ts">
import { Calendar, type CalendarEvent } from '@artisanpack-ui/vue';

const events: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
  },
  { id: 2, start: '2026-11-05', title: 'Anna’s birthday', color: 'accent', category: 'People' },
  {
    id: 3,
    start: '2026-11-12T11:00',
    title: 'Viewing · Lakeview',
    color: 'primary',
    category: 'Viewings',
    description: 'Meet the buyers at the lobby.',
  },
];
</script>

<template>
  <Calendar :events="events" :week-starts-on="1" />
</template>

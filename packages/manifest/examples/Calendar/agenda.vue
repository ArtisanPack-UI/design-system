<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, type CalendarEvent, type CalendarView } from '@artisanpack-ui/vue';

defineProps<{ events: CalendarEvent[] }>();

const view = ref<CalendarView>('agenda');
const date = ref('2026-11-07');
</script>

<template>
  <Calendar
    v-model:view="view"
    v-model:date="date"
    :events="events"
    creatable
    @create="(day) => console.log('New event on', day)"
  />
</template>

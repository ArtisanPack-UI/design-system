<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/vue';

defineProps<{ blackoutDates: string[] }>();

const stay = ref<DatePickerValue>([]);
const today = new Date().toISOString().slice(0, 10);
</script>

<template>
  <DatePicker
    v-model="stay"
    mode="range"
    label="Stay"
    :min="today"
    :disabled-dates="blackoutDates"
  />
</template>

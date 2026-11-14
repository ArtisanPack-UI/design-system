<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/vue';

const viewingAt = ref<DatePickerValue>(null);
</script>

<template>
  <DatePicker v-model="viewingAt" time :step="30" time-zone="Europe/Madrid" label="Viewing" />
</template>

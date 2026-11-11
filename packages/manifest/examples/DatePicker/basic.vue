<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/vue';

const moveIn = ref<DatePickerValue>(null);
</script>

<template>
  <DatePicker v-model="moveIn" label="Move-in date" hint="MM/DD/YYYY" required />
</template>

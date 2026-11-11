<script setup lang="ts">
import { Tabs, type TabData } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const range = ref('week');
const ranges: TabData[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];
</script>

<template>
  <Tabs v-model="range" size="sm" label="Range" :tabs="ranges" />
</template>

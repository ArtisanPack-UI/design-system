<script setup lang="ts">
import { ref } from 'vue';
import { Combobox } from '@artisanpack-ui/vue';

const property = ref<string | null>(null);
const properties = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: 'United States, Chicago' },
  { value: 'lakeside', label: 'Lakeside Commons', description: 'Canada, Toronto' },
  {
    value: 'silver-lake',
    label: 'Silver Lake Bungalows',
    description: 'United States, Los Angeles',
  },
];
</script>

<template>
  <Combobox v-model="property" label="Property" leading-icon="search" :options="properties" />
</template>

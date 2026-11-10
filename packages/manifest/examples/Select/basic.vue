<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@artisanpack-ui/vue';

const country = ref('');
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
];
</script>

<template>
  <Select v-model="country" label="Country" :options="countries" />
</template>

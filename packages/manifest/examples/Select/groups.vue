<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@artisanpack-ui/vue';

const type = ref('');
const types = [
  {
    label: 'Apartments',
    options: [
      { value: 'studio', label: 'Studio' },
      { value: 'loft', label: 'Loft' },
    ],
  },
  {
    label: 'Houses',
    options: [
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'detached', label: 'Detached house' },
    ],
  },
];
</script>

<template>
  <Select v-model="type" label="Property type" :options="types" />
</template>

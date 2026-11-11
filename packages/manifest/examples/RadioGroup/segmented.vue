<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup } from '@artisanpack-ui/vue';

const period = ref('monthly');
const periods = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];
</script>

<template>
  <RadioGroup
    v-model="period"
    label="Billing period"
    variant="segmented"
    orientation="horizontal"
    :options="periods"
  />
</template>

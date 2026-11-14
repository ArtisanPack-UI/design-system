<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup } from '@artisanpack-ui/vue';

const plan = ref('growth');
const plans = [
  { value: 'starter', label: 'Starter', description: 'Up to 5 listings', meta: '$0 / month' },
  {
    value: 'growth',
    label: 'Growth',
    description: 'Up to 50 listings and analytics',
    meta: '$39 / month',
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    description: 'Unlimited listings, team seats',
    meta: '$129 / month',
  },
];
</script>

<template>
  <RadioGroup
    v-model="plan"
    label="Plan"
    variant="cards"
    orientation="horizontal"
    :options="plans"
  />
</template>

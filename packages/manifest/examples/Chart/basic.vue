<script setup lang="ts">
import { Chart } from '@artisanpack-ui/vue';
</script>

<template>
  <Chart
    type="bar"
    title="Weekly revenue"
    description="The Grove at Greenfield · best week labeled"
    :labels="['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10']"
    :series="[
      { name: 'Revenue', data: [4100, 6000, 8200, 10000, 4000, 8000, 4000, 8000, 6000, 4000] },
    ]"
    prefix="$"
    notation="compact"
  />
</template>

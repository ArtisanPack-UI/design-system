<script setup lang="ts">
import { Chart } from '@artisanpack-ui/vue';
</script>

<template>
  <Chart
    type="donut"
    title="Active listings"
    description="By country"
    :labels="['United States', 'Mexico', 'Canada', 'Other']"
    :series="[1240, 990, 723, 260]"
    tabular
  />
</template>

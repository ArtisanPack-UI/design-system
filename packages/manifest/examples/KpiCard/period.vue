<script setup lang="ts">
import { KpiCard, Select } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const period = ref('month');
</script>

<template>
  <KpiCard
    :stat="{ label: 'Total income', value: '$348,261', change: 10.9, description: 'vs last month' }"
    :sparkline="[1, 3, 2, 7, 6, 10, 12, 11, 16]"
  >
    <template #period>
      <Select
        v-model="period"
        label="Period"
        size="sm"
        :options="[
          { value: 'month', label: 'This month' },
          { value: 'quarter', label: 'This quarter' },
        ]"
      />
    </template>
  </KpiCard>
</template>

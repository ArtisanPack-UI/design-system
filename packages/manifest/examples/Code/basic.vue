<script setup lang="ts">
import { Code } from '@artisanpack-ui/vue';

const snippet = `export function formatPrice(amount: number, currency = 'USD') {
  // Tabular figures line up in tables
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}`;
</script>

<template>
  <Code
    :code="snippet"
    file-name="format-price.ts"
    language="TypeScript"
    numbered
    :highlight="[3]"
  />
</template>

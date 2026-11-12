<script setup lang="ts">
import { Table } from '@artisanpack-ui/vue';

defineProps<{ transactions: Record<string, unknown>[] }>();

const headers = [
  { key: 'symbol', label: 'Product name', secondary: 'company' },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date' },
  { key: 'owner.name', label: 'Executed by' },
];
</script>

<template>
  <Table title="Transaction history" :headers="headers" :rows="transactions" density="compact" />
</template>

<script setup lang="ts">
import { Badge, Button, Table } from '@artisanpack-ui/vue';

defineProps<{ transactions: Record<string, unknown>[] }>();

const headers = [
  { key: 'symbol', label: 'Product name' },
  { key: 'status', label: 'Status' },
];
</script>

<template>
  <Table label="Transactions" :headers="headers" :rows="transactions" expandable>
    <template #cell-status="{ row }">
      <Badge :color="row.color" :value="row.status" />
    </template>
    <template #actions="{ row }">
      <Button variant="ghost" size="sm" :href="`/transactions/${row.id}`">View</Button>
    </template>
    <template #expansion="{ row }">{{ row.notes }}</template>
  </Table>
</template>

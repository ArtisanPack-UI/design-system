<script setup lang="ts">
import { ref } from 'vue';
import { Table, type TableKey, type TableSort } from '@artisanpack-ui/vue';

defineProps<{ transactions: Record<string, unknown>[] }>();

const headers = [
  { key: 'symbol', label: 'Product name', sortable: true },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date', sortable: true },
];
const selected = ref<TableKey[]>([]);
const sort = ref<TableSort>({ column: 'date', direction: 'desc' });
</script>

<template>
  <Table
    v-model="selected"
    v-model:sort-by="sort"
    title="Transaction history"
    :headers="headers"
    :rows="transactions"
    selectable
  />
</template>

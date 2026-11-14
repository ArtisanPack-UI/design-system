<script setup lang="ts">
import { Table, type TableColumn } from '@artisanpack-ui/vue';

const props = defineProps<{
  headers: TableColumn[];
  transactions: {
    data: Record<string, unknown>[];
    current_page: number;
    total: number;
    per_page: number;
  };
}>();
const emit = defineEmits<{ 'page-change': [page: number] }>();
</script>

<template>
  <Table
    title="Transaction history"
    :headers="headers"
    :rows="props.transactions.data"
    :footer="`${props.transactions.total} transactions`"
    :pagination="{
      page: props.transactions.current_page,
      total: props.transactions.total,
      perPage: props.transactions.per_page,
      onPageChange: (page: number) => emit('page-change', page),
    }"
  />
</template>

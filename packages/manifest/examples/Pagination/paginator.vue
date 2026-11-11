<script setup lang="ts">
import { Pagination } from '@artisanpack-ui/vue';

defineProps<{ listings: { current_page: number; total: number; per_page: number } }>();
defineEmits<{ 'page-change': [page: number] }>();
</script>

<template>
  <Pagination
    :page="listings.current_page"
    :total="listings.total"
    :per-page="listings.per_page"
    summary
    @page-change="$emit('page-change', $event)"
  />
</template>

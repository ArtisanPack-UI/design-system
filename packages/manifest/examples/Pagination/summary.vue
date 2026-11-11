<script setup lang="ts">
import { Pagination } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const page = ref(3);
</script>

<template>
  <Pagination
    v-model:page="page"
    :total="318"
    :per-page="10"
    summary
    summary-label="Showing {from}–{to} of {total} properties"
  />
</template>

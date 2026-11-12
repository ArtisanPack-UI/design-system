<script setup lang="ts">
import { Card, Loading } from '@artisanpack-ui/vue';

defineProps<{ loading: boolean }>();
</script>

<template>
  <Card title="Weekly revenue" style="position: relative" :aria-busy="loading">
    <!-- … -->
    <Loading v-if="loading" overlay size="lg">Loading revenue…</Loading>
  </Card>
</template>

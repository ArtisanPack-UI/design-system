<script setup lang="ts">
import { Rating } from '@artisanpack-ui/vue';
</script>

<template>
  <div style="display: grid; gap: 12px">
    <Rating readonly size="sm" :model-value="5" :count="4" />
    <Rating readonly :model-value="5" :count="4" />
    <Rating readonly size="lg" :model-value="5" :count="4" />
  </div>
</template>

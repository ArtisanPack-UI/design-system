<script setup lang="ts">
import { Rating } from '@artisanpack-ui/vue';
</script>

<template>
  <div style="display: grid; gap: 12px">
    <Rating readonly :model-value="4.2" :count="17" />
    <Rating readonly :model-value="3.5" :count="128" />
  </div>
</template>

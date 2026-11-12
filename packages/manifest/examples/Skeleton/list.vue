<script setup lang="ts">
import { Skeleton } from '@artisanpack-ui/vue';
</script>

<template>
  <div aria-busy="true" style="display: grid; gap: 14px">
    <div v-for="row in 3" :key="row" style="display: flex; gap: 12px; align-items: center">
      <Skeleton shape="circle" :width="40" :height="40" />
      <div style="flex: 1">
        <Skeleton shape="text" width="50%" />
        <Skeleton shape="text" width="80%" />
      </div>
    </div>
  </div>
</template>

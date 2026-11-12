<script setup lang="ts">
import { Sparkline } from '@artisanpack-ui/vue';
</script>

<template>
  <Sparkline :data="[2, 4, 3, 7, 6, 9, 12, 11, 14]" />
  <Sparkline :data="[2, 6, 4, 7, 5, 8, 10, 7, 12]" variant="area" />
  <Sparkline :data="[2, 6, 4, 7, 5, 8, 10, 7, 12]" variant="bar" />
  <Sparkline :data="[2, 4, 3, 7, 6, 9, 12, 11, 14]" variant="area" :width="160" :height="40" />
</template>

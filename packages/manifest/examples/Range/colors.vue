<script setup lang="ts">
import { Range } from '@artisanpack-ui/vue';
</script>

<template>
  <Range label="Volume" :model-value="80" color="success" />
  <Range label="Opacity" :model-value="30" size="sm" />
  <Range label="Locked" :model-value="50" disabled />
</template>

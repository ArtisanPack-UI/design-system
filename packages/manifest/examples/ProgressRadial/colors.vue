<script setup lang="ts">
import { ProgressRadial } from '@artisanpack-ui/vue';
</script>

<template>
  <ProgressRadial :value="85" color="success" :size="76" aria-label="Main debt repaid" />
  <ProgressRadial :value="60" color="info" :size="76" aria-label="Fines returned" />
  <ProgressRadial indeterminate :size="48" :thickness="5" aria-label="Calculating" />
</template>

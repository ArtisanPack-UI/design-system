<script setup lang="ts">
import { ProgressRadial } from '@artisanpack-ui/vue';
</script>

<template>
  <ProgressRadial :value="68" :size="40" :thickness="4" hide-value label="Profile complete" />
  <ProgressRadial :value="68" :size="80" :thickness="7" label="complete" />
  <ProgressRadial :value="68" :size="112" :thickness="9" label="of goal" />
</template>

<script setup lang="ts">
import { Icon, Swap } from '@artisanpack-ui/vue';
</script>

<template>
  <Swap label="Menu" transition="rotate" on-icon="x" off-icon="list" size="lg" />
  <Swap label="Starred" transition="none">
    <template #on><Icon name="star" color="warning" /></template>
    <template #off><Icon name="star" /></template>
  </Swap>
</template>

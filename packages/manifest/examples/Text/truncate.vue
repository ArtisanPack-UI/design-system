<script setup lang="ts">
import { Text } from '@artisanpack-ui/vue';

defineProps<{ description: string; summary: string }>();
</script>

<template>
  <Text truncate>{{ description }}</Text>
  <Text :clamp="2">{{ summary }}</Text>
</template>

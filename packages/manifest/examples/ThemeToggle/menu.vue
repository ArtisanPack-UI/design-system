<script setup lang="ts">
import { ThemeToggle, type ThemeChoice } from '@artisanpack-ui/vue';
import { ref, watch } from 'vue';

const emit = defineEmits<{ save: [theme: ThemeChoice] }>();
const theme = ref<ThemeChoice>('system');

watch(theme, (next) => emit('save', next));
</script>

<template>
  <ThemeToggle v-model="theme" variant="menu" size="sm" />
</template>

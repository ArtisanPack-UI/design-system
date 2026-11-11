<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@artisanpack-ui/vue';

const accent = ref('#de9d16');
const brand = [
  '#1f74bf',
  '#0b9488',
  '#1f6f3d',
  '#de9d16',
  '#e88761',
  '#c92f33',
  '#91256c',
  '#23272b',
];
</script>

<template>
  <ColorPicker
    v-model="accent"
    label="Accent color"
    hint="Pick a brand color or enter any CSS color."
    format="oklch"
    :swatches="brand"
  />
</template>

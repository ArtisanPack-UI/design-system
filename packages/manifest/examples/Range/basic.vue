<script setup lang="ts">
import { ref } from 'vue';
import { Range } from '@artisanpack-ui/vue';

const radius = ref(20);
const marks = [
  { value: 0, label: '0 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
];
</script>

<template>
  <Range v-model="radius" label="Search radius" :max="50" format="{value} km" :marks="marks" />
</template>

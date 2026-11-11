<script setup lang="ts">
import { ref } from 'vue';
import { CheckboxGroup } from '@artisanpack-ui/vue';

const notifications = ref<(string | number)[]>(['offers']);
const topics = [
  { value: 'offers', label: 'New offers', description: 'Within an hour of submission' },
  { value: 'prices', label: 'Price changes in saved searches' },
  { value: 'digest', label: 'Weekly analytics digest' },
  { value: 'news', label: 'Product news' },
];
</script>

<template>
  <CheckboxGroup v-model="notifications" label="Notify me about" :options="topics" select-all />
</template>

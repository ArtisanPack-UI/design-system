<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup } from '@artisanpack-ui/vue';

const visibility = ref('public');
const options = [
  { value: 'public', label: 'Public', description: 'Anyone can find it in search.' },
  { value: 'unlisted', label: 'Unlisted', description: 'Only people with the link.' },
  { value: 'private', label: 'Private', description: 'Only you and co-owners.' },
];
</script>

<template>
  <RadioGroup v-model="visibility" label="Listing visibility" :options="options" />
</template>

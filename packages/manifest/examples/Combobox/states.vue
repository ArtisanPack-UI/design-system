<script setup lang="ts">
import { ref } from 'vue';
import { Combobox } from '@artisanpack-ui/vue';

const owner = ref<string | null>(null);
const people = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
];
</script>

<template>
  <Combobox
    v-model="owner"
    label="Owner"
    placeholder="Search people…"
    required
    clearable
    :error="owner ? undefined : 'Choose an owner from the list.'"
    :options="people"
  />
  <Combobox size="sm" label="Small" :options="people" />
  <Combobox size="lg" label="Large" :options="people" disabled />
</template>

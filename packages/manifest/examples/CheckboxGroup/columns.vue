<script setup lang="ts">
import { ref } from 'vue';
import { CheckboxGroup } from '@artisanpack-ui/vue';

const selected = ref<(string | number)[]>(['Parking']);
const amenities = [
  'In-unit laundry',
  'Parking',
  'Rooftop terrace',
  'Gym',
  'Bike storage',
  'Pets allowed',
];
</script>

<template>
  <CheckboxGroup v-model="selected" label="Amenities" :options="amenities" :columns="3" />
</template>

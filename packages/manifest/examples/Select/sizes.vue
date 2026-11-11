<script setup lang="ts">
import { Select } from '@artisanpack-ui/vue';
</script>

<template>
  <Select size="sm" label="Small" :options="['One', 'Two']" />
  <Select size="md" label="Medium" :options="['One', 'Two']" />
  <Select size="lg" label="Large" :options="['One', 'Two']" />
</template>

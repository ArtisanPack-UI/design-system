<script setup lang="ts">
import { ValidationSummary } from '@artisanpack-ui/vue';
</script>

<template>
  <ValidationSummary
    color="warning"
    :errors="[
      { field: 'description', message: 'Description is shorter than 80 characters.' },
      { field: 'floor-plan', message: 'No floor plan uploaded.' },
    ]"
  />
</template>

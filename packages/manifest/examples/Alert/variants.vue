<script setup lang="ts">
import { Alert } from '@artisanpack-ui/vue';

const emit = defineEmits<{ seen: [] }>();
</script>

<template>
  <Alert
    variant="outline"
    color="info"
    title="Outline variant"
    description="For alerts inside dense forms, where a tint would be too loud."
  />
  <Alert
    variant="solid"
    color="error"
    title="Solid variant"
    description="For page-level failures that block work."
  />
  <Alert color="success" title="Listing published" dismissible @open-change="emit('seen')" />
</template>

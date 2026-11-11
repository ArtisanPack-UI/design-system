<script setup lang="ts">
import { ValidationSummary } from '@artisanpack-ui/vue';

// A map of field to message(s), such as Inertia's page.props.errors.
const errors = {
  'postal-code': 'Spanish postal codes have 5 digits.',
  photos: 'Add at least 2 more photos.',
};
</script>

<template>
  <ValidationSummary :errors="errors" />
  <ValidationSummary
    :errors="[{ field: 'photos', message: 'Add at least 2 more photos.' }]"
    title="Fix these before publishing"
  />
</template>

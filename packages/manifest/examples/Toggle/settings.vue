<script setup lang="ts">
import { ref } from 'vue';
import { Toggle } from '@artisanpack-ui/vue';

const digest = ref(false);
</script>

<template>
  <Toggle
    v-model:checked="digest"
    label="Weekly revenue digest"
    description="Every Monday at 9:00."
  />
  <Toggle
    label="Two-factor authentication"
    description="Required by your workspace admin."
    checked
    disabled
  />
</template>

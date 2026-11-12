<script setup lang="ts">
import { Progress } from '@artisanpack-ui/vue';

defineProps<{ uploaded: number }>();
</script>

<template>
  <Progress
    :value="(uploaded / 12) * 100"
    label="Uploading 12 photos"
    :value-text="`${uploaded} of 12`"
  />
  <Progress :value="92" color="warning" label="Monthly visits used" value-text="46,120 / 50,000" />
  <Progress :value="40" size="sm" aria-label="Profile completeness" />
</template>

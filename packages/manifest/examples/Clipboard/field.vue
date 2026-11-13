<script setup lang="ts">
import { Clipboard } from '@artisanpack-ui/vue';

const emit = defineEmits<{ share: [url: string] }>();
</script>

<template>
  <Clipboard
    value="https://horizonhomes.com/l/grove-greenfield"
    variant="field"
    size="md"
    label="Copy share link"
    @copied="emit('share', $event)"
  />
</template>

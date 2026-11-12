<script setup lang="ts">
import { Button, Input, Popover } from '@artisanpack-ui/vue';

defineProps<{ shareUrl: string }>();
</script>

<template>
  <Popover trigger="Share" title="Share report">
    <Input label="Link" readonly :value="shareUrl" />

    <template #actions>
      <Button size="sm" leading-icon="copy">Copy link</Button>
    </template>
  </Popover>
</template>

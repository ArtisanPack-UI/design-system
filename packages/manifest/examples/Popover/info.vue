<script setup lang="ts">
import { Button, Popover } from '@artisanpack-ui/vue';
</script>

<template>
  <Popover placement="top" title="What counts as a visit?">
    <template #trigger>
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="info"
        aria-label="About visits"
      />
    </template>

    <p>A unique person who opened the listing for at least 5 seconds, counted once a day.</p>
  </Popover>
</template>

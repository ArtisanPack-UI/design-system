<script setup lang="ts">
import { Button, Tooltip } from '@artisanpack-ui/vue';
</script>

<template>
  <Tooltip content="Edit" shortcut="E">
    <Button
      variant="outline"
      color="neutral"
      size="sm"
      icon-only
      leading-icon="pencil"
      aria-label="Edit"
    />
  </Tooltip>
</template>

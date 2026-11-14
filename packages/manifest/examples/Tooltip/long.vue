<script setup lang="ts">
import { Button, Tooltip } from '@artisanpack-ui/vue';
</script>

<template>
  <Tooltip
    size="lg"
    placement="end"
    content="Conversion is completed deals divided by unique visits in the period."
  >
    <Button
      variant="ghost"
      color="neutral"
      size="sm"
      icon-only
      leading-icon="info"
      aria-label="About conversion"
    />
  </Tooltip>
</template>

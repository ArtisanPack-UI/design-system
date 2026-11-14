<script setup lang="ts">
import { ColorPicker } from '@artisanpack-ui/vue';
</script>

<template>
  <div style="display: grid; gap: 16px">
    <ColorPicker
      label="Brand color"
      required
      :alpha="false"
      model-value="#c92f33"
      error="Enter a color, such as #1f74bf."
    />
    <ColorPicker label="Locked color" disabled model-value="#23272b" />
  </div>
</template>

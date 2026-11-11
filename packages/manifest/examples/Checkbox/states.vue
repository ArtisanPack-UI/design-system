<script setup lang="ts">
import { Checkbox } from '@artisanpack-ui/vue';
</script>

<template>
  <Checkbox label="I agree to the listing terms" error="Required to publish." required />
  <Checkbox label="Managed by your organization" checked disabled />
</template>

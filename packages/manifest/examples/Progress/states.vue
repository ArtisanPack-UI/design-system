<script setup lang="ts">
import { Progress } from '@artisanpack-ui/vue';
</script>

<template>
  <Progress indeterminate label="Preparing export" value-text="Estimating…" />
  <Progress segmented :value="3" :max="5" label="Listing setup" value-text="3 of 5" />
</template>

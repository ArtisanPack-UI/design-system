<script setup lang="ts">
import { Input } from '@artisanpack-ui/vue';
</script>

<template>
  <Input
    label="Username"
    hint="Letters and numbers only."
    error="That username is taken."
    model-value="jacob"
  />
  <Input label="Account ID" model-value="AP-20931" readonly />
  <Input label="Team" model-value="Design" disabled />
</template>

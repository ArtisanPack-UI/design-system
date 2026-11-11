<script setup lang="ts">
import { Select } from '@artisanpack-ui/vue';
</script>

<template>
  <Select
    label="Time zone"
    hint="Used for reports and reminders."
    error="Choose a time zone."
    :options="['UTC', 'America/New_York', 'Europe/Paris']"
    required
  />
  <Select label="Region" :options="['North America']" disabled />
</template>

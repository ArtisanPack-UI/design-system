<script setup lang="ts">
import { Select } from '@artisanpack-ui/vue';
</script>

<template>
  <Select label="Plan" leading-icon="user">
    <option value="starter">Starter</option>
    <option value="team">Team</option>
    <option value="enterprise" disabled>Enterprise (contact us)</option>
  </Select>
</template>

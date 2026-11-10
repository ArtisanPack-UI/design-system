<script setup lang="ts">
import { Input } from '@artisanpack-ui/vue';
</script>

<template>
  <Input type="search" label="Search" leading-icon="search" />
  <Input type="number" label="Price" prefix="USD" suffix="/mo" />
  <Input type="url" label="Website" prefix="https://" trailing-icon="arrow-right" />
</template>

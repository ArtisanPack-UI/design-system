<script setup lang="ts">
import { Breadcrumbs } from '@artisanpack-ui/vue';
</script>

<template>
  <Breadcrumbs
    :max-items="4"
    overflow-label="Show {count} more levels"
    :items="[
      { label: 'Home', href: '/', icon: 'house', hideLabel: true },
      { label: 'Properties', href: '/properties' },
      { label: 'Lakeview Lofts', href: '/properties/lakeview-lofts' },
      { label: 'Analytics', href: '/properties/lakeview-lofts/analytics' },
      { label: 'Visitor' },
    ]"
  />
</template>

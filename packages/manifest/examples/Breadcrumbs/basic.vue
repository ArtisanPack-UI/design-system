<script setup lang="ts">
import { Breadcrumbs } from '@artisanpack-ui/vue';
</script>

<template>
  <Breadcrumbs
    :items="[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Properties', href: '/properties' },
      { label: 'Lakeview Lofts' },
    ]"
  />
</template>

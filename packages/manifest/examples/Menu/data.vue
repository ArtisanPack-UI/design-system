<script setup lang="ts">
import { Menu, type MenuItemData } from '@artisanpack-ui/vue';

const items: MenuItemData[] = [
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '/settings/profile', current: true },
      { label: 'Security', href: '/settings/security' },
    ],
  },
  { type: 'separator' },
  { label: 'Billing', href: '/settings/billing', icon: 'lock' },
];
</script>

<template>
  <Menu label="Settings" :collapsible="false" :items="items" />
</template>

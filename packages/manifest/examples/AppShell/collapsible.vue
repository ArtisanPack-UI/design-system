<script setup lang="ts">
import { AppShell, Menu, MenuItem } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const collapsed = ref(false);
</script>

<template>
  <AppShell
    collapsible
    :collapsed="collapsed"
    sidebar-width="280px"
    brand="Apexify"
    @collapsed-change="collapsed = $event"
  >
    <template #sidebar>
      <Menu label="Main">
        <MenuItem href="/dashboard" icon="house" current>Dashboard</MenuItem>
        <MenuItem href="/settings" icon="settings">Settings</MenuItem>
      </Menu>
    </template>
    Page content
  </AppShell>
</template>

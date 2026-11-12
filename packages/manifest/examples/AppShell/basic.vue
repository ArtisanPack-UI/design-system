<script setup lang="ts">
import { AppShell, Menu, MenuItem, MenuTitle, Navbar, PageHeader } from '@artisanpack-ui/vue';
</script>

<template>
  <AppShell>
    <template #brand><a href="/">Apexify</a></template>
    <template #sidebar>
      <Menu label="Main">
        <MenuItem href="/dashboard" icon="house" current>Dashboard</MenuItem>
        <MenuItem href="/inbox" icon="inbox" badge="4">Inbox</MenuItem>
        <MenuTitle>Workspace</MenuTitle>
        <MenuItem href="/settings" icon="settings">Settings</MenuItem>
      </Menu>
    </template>
    <template #header>
      <Navbar layout="island" :sticky="false" actions="Olivia Rhye" />
    </template>
    <template #footer>Olivia Rhye</template>

    <PageHeader title="Dashboard" />
  </AppShell>
</template>

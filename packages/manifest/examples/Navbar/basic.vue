<script setup lang="ts">
import { Button, Navbar, NavbarItem } from '@artisanpack-ui/vue';
</script>

<template>
  <Navbar>
    <template #brand>
      <a href="/">Horizon</a>
    </template>

    <NavbarItem href="/properties" current>Properties</NavbarItem>
    <NavbarItem href="/analytics">Analytics</NavbarItem>
    <NavbarItem href="/tools">Tools &amp; calculators</NavbarItem>

    <template #actions>
      <Button variant="ghost" color="neutral" size="sm" href="/login">Sign in</Button>
      <Button size="sm" href="/register">Get started</Button>
    </template>
  </Navbar>
</template>

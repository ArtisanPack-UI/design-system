<script setup lang="ts">
import { Button, Input, Navbar } from '@artisanpack-ui/vue';
</script>

<template>
  <Navbar layout="island" surface="glass" brand="Socials">
    <template #search>
      <Input
        type="search"
        size="sm"
        leading-icon="search"
        placeholder="Search"
        aria-label="Search"
      />
    </template>

    <template #actions>
      <Button size="sm" leading-icon="plus">New page</Button>
    </template>
  </Navbar>
</template>

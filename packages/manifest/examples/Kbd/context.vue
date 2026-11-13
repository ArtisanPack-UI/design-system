<script setup lang="ts">
import { Kbd } from '@artisanpack-ui/vue';
</script>

<template>
  <p>Press <Kbd :keys="['mod', 'k']" /> to search, or <Kbd :keys="['?']" /> for all shortcuts.</p>
  <Kbd :keys="['mod', 'd']" size="sm" />
</template>

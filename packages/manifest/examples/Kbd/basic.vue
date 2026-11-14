<script setup lang="ts">
import { Kbd } from '@artisanpack-ui/vue';
</script>

<template>
  <Kbd :keys="['mod', 'k']" />
  <Kbd :keys="['ctrl', 'shift', 'p']" />
  <Kbd :keys="['esc']" />
  <Kbd :keys="['enter']" />
  <Kbd>Tab</Kbd>
</template>

<script setup lang="ts">
import { ThemeToggle } from '@artisanpack-ui/vue';
</script>

<!--
  In index.html's <head>, before the stylesheets, add the snippet themeScript()
  from @artisanpack-ui/behavior returns, or render <ThemeScript /> in an SSR head.
-->
<template>
  <ThemeToggle label="Theme" />
</template>

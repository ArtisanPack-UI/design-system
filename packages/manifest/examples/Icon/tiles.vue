<script setup lang="ts">
import { Icon } from '@artisanpack-ui/vue';
</script>

<template>
  <Icon name="wallet" variant="tile" color="primary" />
  <Icon name="trending-up" variant="tile" color="success" />
  <Icon name="triangle-alert" variant="tile" color="warning" size="lg" />
  <Icon variant="tile" size="sm" label="Spreadsheet">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  </Icon>
</template>

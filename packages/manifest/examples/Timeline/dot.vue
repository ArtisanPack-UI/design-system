<script setup lang="ts">
import { Timeline } from '@artisanpack-ui/vue';
</script>

<template>
  <Timeline
    variant="dot"
    label="Shipping history"
    :items="[
      { title: 'Delivered', time: 'Nov 7, 14:02', datetime: '2026-11-07T14:02', color: 'success' },
      {
        title: 'Out for delivery',
        time: 'Nov 7, 08:15',
        datetime: '2026-11-07T08:15',
        color: 'primary',
      },
      { title: 'Arrived at Barcelona hub', time: 'Nov 6, 22:40', datetime: '2026-11-06T22:40' },
      { title: 'Shipped from Madrid', time: 'Nov 6, 09:10', datetime: '2026-11-06T09:10' },
    ]"
  />
</template>

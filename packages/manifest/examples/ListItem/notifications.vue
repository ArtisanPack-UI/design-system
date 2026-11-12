<script setup lang="ts">
import { List, ListItem } from '@artisanpack-ui/vue';

defineEmits<{ open: [id: number] }>();
</script>

<template>
  <List variant="divided">
    <ListItem
      interactive
      selected
      leading-icon="mail"
      title="Offer received"
      description="Lakeview Lofts · $248,000"
      trailing="2m"
      @click="$emit('open', 1)"
    />
    <ListItem
      interactive
      leading-icon="calendar"
      title="Viewing booked"
      description="Thu, Nov 12 · 11:00"
      trailing="1h"
      @click="$emit('open', 2)"
    />
  </List>
</template>

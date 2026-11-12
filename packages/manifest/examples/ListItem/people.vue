<script setup lang="ts">
import { Avatar, Badge, List, ListItem } from '@artisanpack-ui/vue';

defineProps<{ members: { id: number; name: string; email: string; role: string }[] }>();
</script>

<template>
  <List variant="bordered">
    <ListItem
      v-for="member in members"
      :key="member.id"
      :title="member.name"
      :description="member.email"
      :href="`/members/${member.id}`"
    >
      <template #leading><Avatar :name="member.name" /></template>
      <template #trailing
        ><Badge>{{ member.role }}</Badge></template
      >
    </ListItem>
  </List>
</template>

<script setup lang="ts">
import { Button, EmptyState } from '@artisanpack-ui/vue';

defineProps<{ search: string }>();
const emit = defineEmits<{ clear: [] }>();
</script>

<template>
  <EmptyState
    title="No properties yet"
    description="Add your first property to start tracking visits, offers and revenue."
  >
    <template #actions>
      <Button leading-icon="plus" href="/properties/create">Add property</Button>
      <Button variant="outline" color="neutral" leading-icon="upload">Import CSV</Button>
    </template>
  </EmptyState>
  <EmptyState
    variant="no-results"
    :title="`No results for “${search}”`"
    description="Check the spelling, or clear filters to see all properties."
  >
    <template #actions>
      <Button variant="outline" color="neutral" @click="emit('clear')">Clear filters</Button>
    </template>
  </EmptyState>
  <EmptyState
    variant="cleared"
    size="sm"
    :heading-level="4"
    title="You’re all caught up"
    description="New offers will appear here."
  />
</template>

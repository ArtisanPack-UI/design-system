<script setup lang="ts">
import { Badge, Button, PageHeader } from '@artisanpack-ui/vue';
</script>

<template>
  <PageHeader title="The Grove at Greenfield">
    <template #meta>
      <Badge color="warning">Draft</Badge>
      Edited 20 min ago
    </template>
    <template #actions>
      <Button variant="ghost" color="neutral" size="sm" leading-icon="eye">Preview</Button>
      <Button size="sm">Publish</Button>
    </template>
  </PageHeader>
</template>

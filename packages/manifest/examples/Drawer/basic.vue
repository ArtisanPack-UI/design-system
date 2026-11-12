<script setup lang="ts">
import { Button, Drawer, Input, Toggle } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <Drawer v-model:open="open" trigger="Filters" title="Filters" description="218 properties match">
    <Input label="Location" leading-icon="search" />
    <Toggle label="Only show pet friendly" />

    <template #footer>
      <Button variant="ghost" color="neutral">Reset</Button>
      <Button @click="open = false">Show 218 results</Button>
    </template>
  </Drawer>
</template>

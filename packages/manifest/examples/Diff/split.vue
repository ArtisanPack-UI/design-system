<script setup lang="ts">
import { Button, Diff } from '@artisanpack-ui/vue';
import { ref } from 'vue';

defineProps<{ before: string; after: string }>();

const view = ref<'unified' | 'split'>('split');
</script>

<template>
  <Diff :old-content="before" :new-content="after" file-name="Version 3 → Version 4" :view="view">
    <template #actions>
      <Button
        size="xs"
        variant="ghost"
        color="neutral"
        @click="view = view === 'split' ? 'unified' : 'split'"
      >
        {{ view === 'split' ? 'Unified' : 'Split' }}
      </Button>
    </template>
  </Diff>
</template>

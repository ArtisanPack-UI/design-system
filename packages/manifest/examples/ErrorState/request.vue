<script setup lang="ts">
import { Button, ErrorState } from '@artisanpack-ui/vue';

defineProps<{ requestId: string }>();
const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <ErrorState
    title="Couldn’t load transactions"
    description="The payments service didn’t respond. Your data is safe; try again in a moment."
    :code="`Error 503 · ${requestId}`"
  >
    <template #actions>
      <Button leading-icon="refresh-cw" @click="emit('retry')">Try again</Button>
      <Button
        variant="ghost"
        color="neutral"
        trailing-icon="external-link"
        href="https://status.example.com"
      >
        Status page
      </Button>
    </template>
  </ErrorState>
  <ErrorState
    variant="offline"
    title="You’re offline"
    description="Changes are saved on this device and will sync when you reconnect."
  />
</template>

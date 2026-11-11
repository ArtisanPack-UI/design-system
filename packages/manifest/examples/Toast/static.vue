<script setup lang="ts">
import { Button, Toast } from '@artisanpack-ui/vue';
</script>

<template>
  <Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
  <Toast color="error" title="Upload failed" description="The file is larger than 10 MB." />
  <Toast variant="inverse" title="Listing archived">
    <template #actions>
      <Button size="sm" variant="outline" color="neutral">Undo</Button>
    </template>
  </Toast>
</template>

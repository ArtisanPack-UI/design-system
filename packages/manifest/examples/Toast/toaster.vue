<script setup lang="ts">
import { Button, Toaster, toast } from '@artisanpack-ui/vue';

function archive() {
  toast.create({
    title: 'Listing archived',
    description: 'Cedarwood Estates is hidden from search.',
    action: { label: 'Undo', onClick: () => console.log('restored') },
  });
}
</script>

<template>
  <Toaster />
  <Button @click="archive">Archive listing</Button>
</template>

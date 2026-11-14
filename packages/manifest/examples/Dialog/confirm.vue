<script setup lang="ts">
import { Button, Dialog } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <Button color="error" variant="soft" @click="open = true">Delete listing</Button>
  <Dialog
    v-model:open="open"
    role="alertdialog"
    size="sm"
    color="error"
    icon="trash"
    title="Delete Cedarwood Estates?"
    description="The listing and its 3 open offers will be removed. This can't be undone."
  >
    <template #footer>
      <Button variant="outline" color="neutral" @click="open = false">Cancel</Button>
      <Button color="error" @click="open = false">Delete listing</Button>
    </template>
  </Dialog>
</template>

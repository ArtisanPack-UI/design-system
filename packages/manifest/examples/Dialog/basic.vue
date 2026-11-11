<script setup lang="ts">
import { Button, Dialog, Input } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <Dialog
    v-model:open="open"
    trigger="Invite member"
    title="Invite member"
    description="They'll get an email with a link to join the project."
  >
    <Input type="email" label="Email" />

    <template #footer>
      <Button variant="outline" color="neutral" @click="open = false">Cancel</Button>
      <Button @click="open = false">Send invite</Button>
    </template>
  </Dialog>
</template>

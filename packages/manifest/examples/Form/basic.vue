<script setup lang="ts">
import { ref } from 'vue';
import { Button, Form, Input, Textarea } from '@artisanpack-ui/vue';

const email = ref('');
const message = ref('');

function save() {
  // Send the invite.
}
</script>

<template>
  <Form aria-label="Invite member" @submit.prevent="save">
    <Input v-model="email" type="email" label="Email" required />
    <Textarea v-model="message" label="Message" :rows="3" />

    <template #actions>
      <Button variant="ghost" type="button">Cancel</Button>
      <Button type="submit">Send invite</Button>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Password } from '@artisanpack-ui/vue';

const confirmation = ref('');
</script>

<template>
  <Password
    v-model="confirmation"
    label="Confirm password"
    autocomplete="new-password"
    error="Passwords don't match."
  />
  <Password label="Current password" error="That password is incorrect." />
</template>

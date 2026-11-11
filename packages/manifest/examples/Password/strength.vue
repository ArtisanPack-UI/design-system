<script setup lang="ts">
import { ref } from 'vue';
import { Password } from '@artisanpack-ui/vue';

const newPassword = ref('');
const requirements = [
  { label: 'At least 12 characters', pattern: '.{12,}' },
  { label: 'One number', pattern: '\\d' },
  { label: 'One symbol', pattern: '[^A-Za-z0-9]' },
];
</script>

<template>
  <Password
    v-model="newPassword"
    label="New password"
    autocomplete="new-password"
    leading-icon="lock"
    strength-meter
    :requirements="requirements"
  />
</template>

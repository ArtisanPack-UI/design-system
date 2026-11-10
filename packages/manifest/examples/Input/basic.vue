<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@artisanpack-ui/vue';

const email = ref('');
</script>

<template>
  <Input
    v-model="email"
    type="email"
    label="Email"
    hint="We never share it."
    placeholder="you@example.com"
    required
  />
</template>

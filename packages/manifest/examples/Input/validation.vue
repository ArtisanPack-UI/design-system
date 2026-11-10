<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@artisanpack-ui/vue';

const username = ref('jacob');
</script>

<template>
  <Input
    v-model="username"
    label="Username"
    hint="Letters and numbers only."
    error="That username is taken."
  />
  <Input label="Account ID" model-value="AP-20931" readonly />
  <Input label="Team" model-value="Design" disabled />
</template>

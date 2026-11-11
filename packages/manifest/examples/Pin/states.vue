<script setup lang="ts">
import { ref } from 'vue';
import { Pin } from '@artisanpack-ui/vue';

const code = ref('991027');
</script>

<template>
  <Pin
    v-model="code"
    label="Verification code"
    :group-size="3"
    error="That code has expired. We sent a new one."
  />
  <Pin label="Small" size="sm" :group-size="3" />
  <Pin label="Disabled" model-value="503186" :group-size="3" disabled />
</template>

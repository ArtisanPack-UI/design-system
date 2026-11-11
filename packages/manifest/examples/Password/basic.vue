<script setup lang="ts">
import { ref } from 'vue';
import { Password } from '@artisanpack-ui/vue';

const password = ref('');
</script>

<template>
  <Password v-model="password" label="Password" leading-icon="lock" required />
</template>

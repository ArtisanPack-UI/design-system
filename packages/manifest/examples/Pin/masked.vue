<script setup lang="ts">
import { ref } from 'vue';
import { Pin } from '@artisanpack-ui/vue';

const pin = ref('');
const recoveryCode = ref('');
</script>

<template>
  <Pin v-model="pin" label="PIN" :length="4" mask />
  <Pin
    v-model="recoveryCode"
    label="Recovery code"
    :length="8"
    type="alphanumeric"
    :group-size="4"
  />
</template>

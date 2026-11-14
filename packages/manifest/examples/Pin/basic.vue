<script setup lang="ts">
import { ref } from 'vue';
import { Pin } from '@artisanpack-ui/vue';

const code = ref('');

function verify(value: string) {
  // Submit the code.
  console.log(value);
}
</script>

<template>
  <Pin
    v-model="code"
    label="Verification code"
    hint="Enter the 6-digit code we sent to your phone."
    :group-size="3"
    @complete="verify"
  />
</template>

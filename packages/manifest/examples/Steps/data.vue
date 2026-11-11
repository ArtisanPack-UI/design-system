<script setup lang="ts">
import { Steps } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const step = ref(3);
</script>

<template>
  <Steps
    v-model="step"
    clickable
    label="Checkout progress"
    :steps="[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }, { title: 'Confirm' }]"
  />
</template>

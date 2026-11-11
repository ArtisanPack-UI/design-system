<script setup lang="ts">
import { ref } from 'vue';
import { Signature } from '@artisanpack-ui/vue';

const signature = ref('');
</script>

<template>
  <Signature
    v-model="signature"
    mode="type"
    :modes="['draw', 'type']"
    label="Signature"
    pen-color="primary"
  />
</template>

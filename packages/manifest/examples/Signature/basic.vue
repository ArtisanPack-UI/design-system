<script setup lang="ts">
import { ref } from 'vue';
import { Signature } from '@artisanpack-ui/vue';

const signature = ref('');
</script>

<template>
  <Signature v-model="signature" label="Signature" hint="Olivia Rhye · Nov 7, 2026" />
</template>

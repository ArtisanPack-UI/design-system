<script setup lang="ts">
import { ref } from 'vue';
import { Rating } from '@artisanpack-ui/vue';

const score = ref(4);
</script>

<template>
  <Rating v-model="score" size="lg" label="Rate the viewing" />
</template>

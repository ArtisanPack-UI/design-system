<script setup lang="ts">
import { ref } from 'vue';
import { Swap } from '@artisanpack-ui/vue';

const darkMode = ref(false);
</script>

<template>
  <Swap v-model:checked="darkMode" label="Dark mode" />
</template>

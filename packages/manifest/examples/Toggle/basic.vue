<script setup lang="ts">
import { ref } from 'vue';
import { Toggle } from '@artisanpack-ui/vue';

const darkMode = ref(false);
</script>

<template>
  <Toggle v-model:checked="darkMode" label="Dark mode" />
</template>

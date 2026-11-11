<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@artisanpack-ui/vue';

const primary = ref('#1f74bf');
</script>

<template>
  <ColorPicker v-model="primary" label="Primary color" />
</template>

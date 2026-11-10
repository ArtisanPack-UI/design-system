<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@artisanpack-ui/vue';

const newsletter = ref(false);
</script>

<template>
  <Checkbox v-model:checked="newsletter" label="Send me the monthly newsletter" />
</template>

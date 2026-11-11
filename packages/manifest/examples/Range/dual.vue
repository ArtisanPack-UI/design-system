<script setup lang="ts">
import { ref } from 'vue';
import { Range, type RangeValue } from '@artisanpack-ui/vue';

const price = ref<RangeValue>([200, 450]);
</script>

<template>
  <Range
    v-model="price"
    label="Price"
    dual
    :min="100"
    :max="700"
    :step="10"
    format="${value}k"
    show-value="always"
  />
</template>

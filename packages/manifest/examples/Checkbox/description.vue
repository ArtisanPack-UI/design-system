<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@artisanpack-ui/vue';

const offers = ref(true);
</script>

<template>
  <Checkbox
    v-model:checked="offers"
    label="Email me when a property gets a new offer"
    description="Sent at most once a day, as a summary."
  />
</template>

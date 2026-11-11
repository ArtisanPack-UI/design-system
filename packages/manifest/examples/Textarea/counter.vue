<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@artisanpack-ui/vue';

const description = ref('');
</script>

<template>
  <Textarea
    v-model="description"
    label="Description"
    placeholder="Describe the property, nearby amenities and anything renters should know…"
    :max-length="500"
    auto-resize
  />
</template>

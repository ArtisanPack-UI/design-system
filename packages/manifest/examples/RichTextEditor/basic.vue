<script setup lang="ts">
import { ref } from 'vue';
import { RichTextEditor } from '@artisanpack-ui/vue';

const description = ref('<p>Twenty-four bright apartments.</p>');
</script>

<template>
  <RichTextEditor
    v-model="description"
    label="Description"
    hint="Shown on the listing page."
    counter
  />
</template>

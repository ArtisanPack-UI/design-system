<script setup lang="ts">
import { ref } from 'vue';
import { RichTextEditor } from '@artisanpack-ui/vue';

const note = ref('');
</script>

<template>
  <RichTextEditor
    v-model="note"
    toolbar="compact"
    label="Note to buyer"
    placeholder="Write a note for the buyer…"
  />
</template>

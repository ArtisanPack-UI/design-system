<script setup lang="ts">
import { ref } from 'vue';
import { RichTextEditor } from '@artisanpack-ui/vue';

const summary = ref('## Highlights\n\n- In-unit laundry');
</script>

<template>
  <RichTextEditor v-model="summary" output="markdown" :max-length="500" label="Summary" />
</template>

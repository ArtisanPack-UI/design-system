<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor } from '@artisanpack-ui/vue';

const source = ref("const fraction: number = '0';");
const diagnostics = [
  {
    line: 1,
    column: 26,
    message: "Type 'string' is not assignable to type 'number'.",
    severity: 'error' as const,
  },
];
</script>

<template>
  <CodeEditor v-model="source" language="TypeScript" label="Source" :diagnostics="diagnostics" />
</template>

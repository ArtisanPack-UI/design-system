<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor } from '@artisanpack-ui/vue';

const css = ref('.listing {\n  color: var(--apui-text-default);\n}');
</script>

<template>
  <CodeEditor
    v-model="css"
    language="CSS"
    label="Custom CSS"
    hint="Added after the theme styles."
    :rows="8"
  />
</template>

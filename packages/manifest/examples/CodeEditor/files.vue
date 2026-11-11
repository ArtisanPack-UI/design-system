<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CodeEditor } from '@artisanpack-ui/vue';

const sources = reactive<Record<string, string>>({
  'format-price.ts': "export const currency = 'USD';",
  'listing.blade.php': '<x-artisanpack-card />',
});
const file = ref('format-price.ts');
const language = ref('typescript');
const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
];
</script>

<template>
  <CodeEditor
    v-model="sources[file]"
    label="Source"
    :tabs="Object.keys(sources)"
    :tab="file"
    :languages="languages"
    :language="language"
    @tab-change="(value) => (file = value)"
    @language-change="(value) => (language = value)"
  />
</template>

<script setup lang="ts">
import { Markdown } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const props = defineProps<{ initial: string }>();

const notes = ref(props.initial);
</script>

<template>
  <Markdown v-model:source="notes" mode="split" />
</template>

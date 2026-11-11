<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@artisanpack-ui/vue';

const summary = ref('Too short');
</script>

<template>
  <Textarea v-model="summary" label="Summary" error="Write at least 40 characters." required />
  <Textarea label="Imported text" model-value="Imported from the March listing feed." readonly />
  <Textarea label="Internal notes" model-value="Locked while the listing is reviewed." disabled />
</template>

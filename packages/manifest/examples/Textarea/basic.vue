<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@artisanpack-ui/vue';

const notes = ref('');
</script>

<template>
  <Textarea v-model="notes" label="Notes" hint="Only your team sees these." :rows="3" />
</template>

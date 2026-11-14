<script setup lang="ts">
import { Loading } from '@artisanpack-ui/vue';

defineProps<{ saving: boolean }>();
</script>

<template>
  <Loading />
  <Loading variant="dots" color="neutral" />
  <Loading v-if="saving" size="sm">Saving changes…</Loading>
</template>

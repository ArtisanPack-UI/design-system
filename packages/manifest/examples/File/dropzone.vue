<script setup lang="ts">
import { ref } from 'vue';
import { File as FileUpload } from '@artisanpack-ui/vue';

const photos = ref<File[]>([]);
</script>

<template>
  <FileUpload
    v-model="photos"
    label="Listing photos"
    title="Drop photos here or browse"
    hint="JPG or PNG, up to 20 MB each, 12 files max"
    multiple
    accept="image/jpeg,image/png"
    :max-size="20 * 1024 * 1024"
  />
</template>

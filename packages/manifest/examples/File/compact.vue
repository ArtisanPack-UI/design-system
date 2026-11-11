<script setup lang="ts">
import { File as FileUpload } from '@artisanpack-ui/vue';
</script>

<template>
  <FileUpload
    variant="compact"
    name="contract"
    accept="application/pdf"
    title="Upload a contract"
    hint="PDF up to 10 MB"
    :max-size="10 * 1024 * 1024"
  />
</template>

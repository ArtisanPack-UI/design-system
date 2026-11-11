<script setup lang="ts">
import { File as FileUpload } from '@artisanpack-ui/vue';
</script>

<template>
  <div style="display: grid; gap: 16px">
    <FileUpload label="Documents" required error="Add at least one document." />
    <FileUpload label="Archived documents" disabled />
  </div>
</template>

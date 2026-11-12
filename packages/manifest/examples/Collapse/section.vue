<script setup lang="ts">
import { Collapse, Input, Toggle } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(false);
const slug = ref('grove-greenfield');
</script>

<template>
  <Collapse v-model:open="open" label="Advanced settings">
    <Input v-model="slug" label="Custom URL" prefix="horizonhomes.com/l/" />
    <Toggle label="Hide from search engines" />
  </Collapse>
</template>

<script setup lang="ts">
import { Breadcrumbs, BreadcrumbsItem } from '@artisanpack-ui/vue';

defineProps<{ folder: string }>();
defineEmits<{ root: [] }>();
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbsItem label="All media" href="#" @click.prevent="$emit('root')" />
    <BreadcrumbsItem :label="folder" />
  </Breadcrumbs>
</template>

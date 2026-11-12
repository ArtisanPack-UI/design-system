<script setup lang="ts">
import { Avatar } from '@artisanpack-ui/vue';

defineProps<{ avatarUrl: string }>();
</script>

<template>
  <Avatar name="Olivia Rhye" />
  <Avatar name="Phoenix Baker" :src="avatarUrl" size="lg" />
  <Avatar name="Apexify" shape="square" color="neutral" />
</template>

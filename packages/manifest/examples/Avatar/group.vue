<script setup lang="ts">
import { AvatarGroup } from '@artisanpack-ui/vue';

defineProps<{ members: { name: string; src?: string }[] }>();
</script>

<template>
  <AvatarGroup :avatars="members" :max="4" size="sm" label="Project members" />
</template>

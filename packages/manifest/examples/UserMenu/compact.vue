<script setup lang="ts">
import { UserMenu } from '@artisanpack-ui/vue';

defineEmits<{ select: [value: string] }>();
</script>

<template>
  <UserMenu
    :user="{ name: 'Olivia Rhye', email: 'olivia@company.com' }"
    compact
    align="end"
    hide-theme
    @select="$emit('select', $event)"
  />
</template>

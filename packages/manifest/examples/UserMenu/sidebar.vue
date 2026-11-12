<script setup lang="ts">
import { UserMenu } from '@artisanpack-ui/vue';
import { ref } from 'vue';

defineEmits<{ select: [value: string] }>();

const workspace = ref('apexify');
const theme = ref<'light' | 'dark' | 'system'>('system');
</script>

<template>
  <UserMenu
    :user="{ name: 'Olivia Rhye', email: 'olivia@company.com', role: 'Admin · Apexify' }"
    :workspaces="[
      { id: 'apexify', name: 'Apexify' },
      { id: 'horizon', name: 'Horizon Homes' },
    ]"
    :workspace="workspace"
    :theme="theme"
    :items="[
      { value: 'profile', label: 'Profile', icon: 'user' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
    ]"
    @workspace-change="workspace = $event"
    @theme-change="theme = $event"
    @select="$emit('select', $event)"
  />
</template>

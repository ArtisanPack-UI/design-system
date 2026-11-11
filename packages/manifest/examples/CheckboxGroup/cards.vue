<script setup lang="ts">
import { ref } from 'vue';
import { CheckboxGroup } from '@artisanpack-ui/vue';

const selected = ref<(string | number)[]>([]);
const channels = [
  { value: 'email', label: 'Email', description: 'olivia@company.com' },
  { value: 'sms', label: 'SMS', description: '•••• 4821' },
  { value: 'push', label: 'Push', description: '2 devices' },
];
</script>

<template>
  <CheckboxGroup
    v-model="selected"
    label="Channels"
    variant="cards"
    :columns="3"
    :options="channels"
    :error="selected.length ? undefined : 'Choose at least one channel.'"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Combobox, type ComboboxOption } from '@artisanpack-ui/vue';

const tags = ref<string[]>(['Downtown']);
const options = ref<ComboboxOption[]>([
  { value: 'Downtown', label: 'Downtown' },
  { value: 'Garden', label: 'Garden', color: 'success' },
  { value: 'Gated community', label: 'Gated community', color: 'info' },
]);

function addTag(value: string) {
  options.value.push({ value, label: value });
}
</script>

<template>
  <Combobox
    v-model="tags"
    label="Listing tags"
    placeholder="Add a tag…"
    hint="Press Enter to add, Backspace to remove the last tag."
    multiple
    allow-create
    :max="8"
    :options="options"
    @create="addTag"
  />
</template>

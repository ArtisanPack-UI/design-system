<script setup lang="ts">
import { computed, ref } from 'vue';
import { Checkbox } from '@artisanpack-ui/vue';

const rows = ['Invoices', 'Receipts', 'Contracts'];
const selected = ref<string[]>(['Invoices']);
const all = computed(() => selected.value.length === rows.length);

function toggleAll(checked: boolean) {
  selected.value = checked ? [...rows] : [];
}

function toggle(row: string, checked: boolean) {
  selected.value = checked
    ? [...selected.value, row]
    : selected.value.filter((item) => item !== row);
}
</script>

<template>
  <Checkbox
    label="Select all"
    :checked="all"
    :indeterminate="selected.length > 0 && !all"
    @update:checked="toggleAll"
  />
  <Checkbox
    v-for="row in rows"
    :key="row"
    :label="row"
    :checked="selected.includes(row)"
    @update:checked="(checked: boolean) => toggle(row, checked)"
  />
</template>

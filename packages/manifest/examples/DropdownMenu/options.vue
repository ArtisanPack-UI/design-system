<script setup lang="ts">
import { DropdownMenu } from '@artisanpack-ui/vue';
import { computed, ref } from 'vue';

const showGrid = ref(true);
const sort = ref('newest');

const items = computed(() => [
  { type: 'checkbox', value: 'grid', label: 'Show grid', checked: showGrid.value },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Sort by',
    items: [
      { type: 'radio', value: 'newest', label: 'Newest', checked: sort.value === 'newest' },
      { type: 'radio', value: 'price', label: 'Price', checked: sort.value === 'price' },
    ],
  },
]);

function onCheckedChange({ value, checked }: { value: string; checked: boolean }) {
  if (value === 'grid') showGrid.value = checked;
  else if (checked) sort.value = value;
}
</script>

<template>
  <DropdownMenu label="View" align="end" :items="items" @checked-change="onCheckedChange" />
</template>

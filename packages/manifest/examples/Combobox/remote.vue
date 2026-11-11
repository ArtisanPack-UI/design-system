<script setup lang="ts">
import { ref, watch } from 'vue';
import { Combobox, type ComboboxOption } from '@artisanpack-ui/vue';

const props = defineProps<{ searchPeople: (query: string) => Promise<ComboboxOption[]> }>();

const owner = ref<string | null>(null);
const query = ref('');
const options = ref<ComboboxOption[]>([]);
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  query,
  (text) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      loading.value = true;
      const results = await props.searchPeople(text);
      if (text === query.value) options.value = results;
      loading.value = false;
    }, 300);
  },
  { immediate: true },
);
</script>

<template>
  <Combobox
    v-model="owner"
    label="Owner"
    placeholder="Search people…"
    remote
    :loading="loading"
    :options="options"
    @search-change="query = $event"
  />
</template>

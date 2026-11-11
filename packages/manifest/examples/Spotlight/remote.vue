<script setup lang="ts">
import { Spotlight, type SpotlightGroup } from '@artisanpack-ui/vue';
import { ref, watch } from 'vue';

const search = ref('');
const groups = ref<SpotlightGroup[]>([]);
const loading = ref(false);

watch(search, (query, _previous, onCleanup) => {
  if (!query.trim()) {
    groups.value = [];
    return;
  }
  const controller = new AbortController();
  loading.value = true;
  const timer = setTimeout(async () => {
    try {
      const response = await fetch(`/spotlight?search=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      groups.value = await response.json();
      loading.value = false;
    } catch {
      // Aborted by the next keystroke.
    }
  }, 250);
  onCleanup(() => {
    clearTimeout(timer);
    controller.abort();
  });
});
</script>

<template>
  <Spotlight
    :groups="groups"
    :search="search"
    remote
    :loading="loading"
    placeholder="Search listings…"
    empty-label="No listings match."
    @search-change="search = $event"
  />
</template>

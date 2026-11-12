<script setup lang="ts">
import { ImageGallery } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const photos = [
  {
    src: '/photos/ridge.jpg',
    alt: 'Sunrise over the ridge, seen from the east terrace',
    caption: 'Sunrise over the ridge',
  },
  {
    src: '/photos/courtyard.jpg',
    alt: 'Courtyard garden with benches under the trees',
    caption: 'Courtyard garden',
  },
  { src: '/photos/facade.jpg', alt: 'The west facade at dusk', caption: 'Evening, west façade' },
  {
    src: '/photos/lake.jpg',
    alt: 'Lake view from the window of unit 4A',
    caption: 'Lake view from 4A',
  },
];

const open = ref(false);
const index = ref(0);
</script>

<template>
  <ImageGallery
    v-model:open="open"
    :images="photos"
    :columns="3"
    featured
    downloadable
    :index="index"
    previous-label="Foto anterior"
    next-label="Foto siguiente"
    close-label="Cerrar"
    @index-change="index = $event"
  />
</template>

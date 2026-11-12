<script setup lang="ts">
import { ImageSlider } from '@artisanpack-ui/vue';

const images = [
  {
    src: '/photos/lake.jpg',
    alt: 'Lake view from the window of unit 4A',
    caption: 'Lake view from 4A',
    description: 'South-facing, 11th floor',
  },
  { src: '/photos/ridge.jpg', alt: 'Sunrise over the ridge', caption: 'Sunrise over the ridge' },
  { src: '/photos/courtyard.jpg', alt: 'Courtyard garden with benches' },
];
</script>

<template>
  <ImageSlider label="Lakeview Lofts photos" :images="images" />
</template>

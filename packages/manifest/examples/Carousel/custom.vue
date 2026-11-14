<script setup lang="ts">
import { Card, Carousel, Text } from '@artisanpack-ui/vue';

const quotes = [
  { text: 'Weekly digests replaced three spreadsheets for our team.', author: 'Property manager' },
  { text: 'Tenants find what they need without calling us.', author: 'Leasing lead' },
  { text: 'Setup took an afternoon.', author: 'Operations director' },
];
</script>

<template>
  <Carousel label="Customer notes" :slides="quotes" autoplay loop>
    <template #slide="{ slide }">
      <Card>
        <Text size="lg">{{ slide.text }}</Text>
        <Text size="sm" tone="muted">{{ slide.author }}</Text>
      </Card>
    </template>
  </Carousel>
</template>

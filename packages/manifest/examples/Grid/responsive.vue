<script setup lang="ts">
import { Card, Grid } from '@artisanpack-ui/vue';

const stats = ['Revenue', 'Orders', 'Visitors', 'Refunds'];
</script>

<template>
  <Grid :columns="4" min-item-width="16rem">
    <Card v-for="label in stats" :key="label" :title="label" />
  </Grid>
</template>

<script setup lang="ts">
import { Card, Grid } from '@artisanpack-ui/vue';
</script>

<template>
  <Grid :columns="3" gap="6">
    <Card title="Revenue" />
    <Card title="Orders" />
    <Card title="Visitors" />
  </Grid>
</template>

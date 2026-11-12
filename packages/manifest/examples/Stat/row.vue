<script setup lang="ts">
import { Grid, Stat } from '@artisanpack-ui/vue';
</script>

<template>
  <Grid :columns="3">
    <Stat
      label="Total income"
      value="$348,261"
      icon="wallet"
      color="primary"
      :change="10.9"
      description="vs last month"
      emphasis
    />
    <Stat
      label="Profit"
      value="$15,708.98"
      icon="trending-up"
      color="success"
      :change="8.1"
      description="vs last month"
    />
    <Stat label="Hours listened" value="34.6" delta="6.2 hrs" trend="up" description="this week" />
  </Grid>
</template>

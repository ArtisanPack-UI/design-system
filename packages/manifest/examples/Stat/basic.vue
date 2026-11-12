<script setup lang="ts">
import { Stat } from '@artisanpack-ui/vue';
</script>

<template>
  <Stat
    label="Total revenue"
    value="7,415,644"
    icon="wallet"
    color="info"
    :change="-5.4"
    description="vs last month"
  />
</template>

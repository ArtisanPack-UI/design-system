<script setup lang="ts">
import { Breadcrumbs, Button, PageHeader, Tabs } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const view = ref('overview');
</script>

<template>
  <PageHeader title="Dashboard" description="Income, profit and transactions across all stores.">
    <template #breadcrumbs>
      <Breadcrumbs :items="[{ label: 'Apexify', href: '/' }, { label: 'Dashboard' }]" />
    </template>
    <template #actions>
      <Button variant="outline" color="neutral" size="sm" leading-icon="calendar">
        Last 30 days
      </Button>
      <Button size="sm">Share</Button>
    </template>
    <template #tabs>
      <Tabs
        v-model="view"
        variant="underline"
        :tabs="[
          { value: 'overview', label: 'Overview' },
          { value: 'history', label: 'Trade history' },
        ]"
      />
    </template>
  </PageHeader>
</template>

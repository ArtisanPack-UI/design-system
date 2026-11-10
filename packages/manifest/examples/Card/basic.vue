<script setup lang="ts">
import { Button, Card } from '@artisanpack-ui/vue';
</script>

<template>
  <Card title="Quarterly report" description="Updated 2 hours ago">
    <template #actions>
      <Button variant="ghost" color="neutral" size="sm">Share</Button>
    </template>

    Revenue grew 12% this quarter, led by renewals.

    <template #footer>
      <Button variant="outline" color="neutral">Dismiss</Button>
      <Button>Open report</Button>
    </template>
  </Card>
</template>

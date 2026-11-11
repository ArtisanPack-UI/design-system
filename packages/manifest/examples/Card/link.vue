<script setup lang="ts">
import { Button, Card } from '@artisanpack-ui/vue';
</script>

<template>
  <Card href="/reports/q3" title="Q3 report" description="Revenue, churn and pipeline">
    <template #actions>
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="download"
        aria-label="Download"
      />
    </template>
  </Card>
</template>

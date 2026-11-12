<script setup lang="ts">
import { Button, ErrorState } from '@artisanpack-ui/vue';
</script>

<template>
  <ErrorState
    variant="not-found"
    :heading-level="1"
    focus-title
    title="This page doesn’t exist"
    description="The listing may have been archived, or the link is mistyped."
  >
    <template #actions>
      <Button href="/dashboard">Go to dashboard</Button>
      <Button variant="outline" color="neutral" leading-icon="search" href="/properties">
        Search properties
      </Button>
    </template>
  </ErrorState>
</template>

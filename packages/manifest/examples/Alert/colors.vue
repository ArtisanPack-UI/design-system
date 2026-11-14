<script setup lang="ts">
import { Alert, Button } from '@artisanpack-ui/vue';
</script>

<template>
  <Alert
    color="info"
    title="New reporting period"
    description="Q4 numbers are now available in Analytics."
  />
  <Alert
    color="warning"
    title="Your monthly traffic is close to the limit"
    description="You’ve used 92% of 50,000 visits. Upgrade to avoid throttling."
  >
    <template #actions>
      <Button size="xs" color="warning">Upgrade</Button>
      <Button size="xs" variant="ghost" color="neutral">Learn more</Button>
    </template>
  </Alert>
  <Alert color="error" title="Payment failed">
    We couldn’t charge the card ending in 4242. Update it to keep your listings active.
  </Alert>
</template>

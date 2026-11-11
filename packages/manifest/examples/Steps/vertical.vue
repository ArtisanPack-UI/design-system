<script setup lang="ts">
import { Step, Steps } from '@artisanpack-ui/vue';
</script>

<template>
  <Steps :value="3" orientation="vertical">
    <Step title="Account created" description="Nov 2 · Olivia Rhye" />
    <Step title="Identity verified" description="Nov 3" />
    <Step
      state="error"
      title="Payout account"
      description="IBAN rejected by the bank. Update it to continue."
    />
    <Step title="Go live" description="Listings become public" />
  </Steps>
</template>

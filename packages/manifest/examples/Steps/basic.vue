<script setup lang="ts">
import { Step, Steps } from '@artisanpack-ui/vue';
</script>

<template>
  <Steps :value="3" label="Listing progress">
    <Step title="Basics" description="Title and type" />
    <Step title="Location" description="Address and map" />
    <Step title="Pricing" description="Price and rent" />
    <Step title="Photos" description="At least 6" />
    <Step title="Review" description="Publish" />
  </Steps>
</template>

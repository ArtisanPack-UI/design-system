<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox, Fieldset, Input } from '@artisanpack-ui/vue';

const sameAddress = ref(true);
</script>

<template>
  <Fieldset variant="divided" title="Billing address">
    <Checkbox v-model:checked="sameAddress" label="Same as property address" />
  </Fieldset>
  <Fieldset
    variant="plain"
    title="Payout account"
    description="Locked while a payout is processing."
    disabled
  >
    <Input label="IBAN" model-value="ES91 •••• •••• 1332" />
  </Fieldset>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Checkbox, Fieldset, Form, Input, ValidationSummary } from '@artisanpack-ui/vue';

const postalCode = ref('');
const terms = ref(false);
const errors = ref<Record<string, string>>({});

function publish() {
  errors.value = {
    'postal-code': 'Spanish postal codes have 5 digits.',
    terms: 'Accept the listing terms.',
  };
}
</script>

<template>
  <Form aria-label="Listing" divided @submit.prevent="publish">
    <ValidationSummary :errors="errors" />

    <Fieldset variant="divided" title="Location">
      <Input
        id="postal-code"
        v-model="postalCode"
        label="Postal code"
        :error="errors['postal-code']"
      />
    </Fieldset>
    <Fieldset variant="plain" title="Agreements">
      <Checkbox
        id="terms"
        v-model:checked="terms"
        label="I accept the listing terms"
        :error="errors.terms"
      />
    </Fieldset>

    <template #actions>
      <Button type="submit">Publish listing</Button>
    </template>
  </Form>
</template>

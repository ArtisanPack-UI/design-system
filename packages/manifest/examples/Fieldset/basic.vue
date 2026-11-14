<script setup lang="ts">
import { ref } from 'vue';
import { Fieldset, Input } from '@artisanpack-ui/vue';

const name = ref('');
const email = ref('');
const phone = ref('');
</script>

<template>
  <Fieldset title="Contact" description="Who buyers and renters should reach.">
    <div data-scope="fieldset" data-part="row">
      <Input v-model="name" label="Full name" />
      <Input v-model="email" type="email" label="Email" leading-icon="mail" />
    </div>
    <Input v-model="phone" type="tel" label="Phone" />
  </Fieldset>
</template>

<script setup lang="ts">
import { Diff } from '@artisanpack-ui/vue';

const before = `{
  price: 220000,
  rent: 1600,
  currency: "USD",
  available: "2027-01-01",
}`;

const after = `{
  price: 220000,
  rent: 1650,
  deposit: 3300,
  currency: "USD",
  available: "2027-01-15",
}`;
</script>

<template>
  <Diff :old-content="before" :new-content="after" file-name="listings/grove-greenfield.json" />
</template>

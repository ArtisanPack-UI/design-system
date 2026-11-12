<script setup lang="ts">
import { Accordion, AccordionItem, Card } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(['billing']);
</script>

<template>
  <Accordion v-model="open" variant="separated" multiple>
    <AccordionItem value="billing" title="Billing">
      Invoices go to the account owner on the first of each month.
    </AccordionItem>
    <AccordionItem value="seats" title="Seats">
      Add or remove seats at any time; changes are prorated.
    </AccordionItem>
  </Accordion>

  <Card>
    <Accordion variant="flush" :heading-level="4">
      <AccordionItem value="details" title="Listing details">
        Three bedrooms, two bathrooms, 118 m².
      </AccordionItem>
    </Accordion>
  </Card>
</template>

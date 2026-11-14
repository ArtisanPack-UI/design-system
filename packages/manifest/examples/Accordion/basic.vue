<script setup lang="ts">
import { Accordion, AccordionItem } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(['live']);
</script>

<template>
  <Accordion v-model="open">
    <AccordionItem value="live" title="How long does a listing stay live?">
      Listings stay live until you archive them or mark them as sold. Drafts are kept for 90 days.
    </AccordionItem>
    <AccordionItem value="owners" title="Can co-owners edit a listing?">
      Yes. Invite them from the listing's Sharing tab.
    </AccordionItem>
    <AccordionItem value="files" title="Which file types can I upload?">
      Images, PDFs and floor plans up to 20 MB each.
    </AccordionItem>
  </Accordion>
</template>

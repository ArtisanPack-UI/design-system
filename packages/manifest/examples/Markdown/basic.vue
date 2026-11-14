<script setup lang="ts">
import { Markdown } from '@artisanpack-ui/vue';

const notes = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room
- [ ] Ask about \`heating costs\`

> Viewings run 30 minutes.`;
</script>

<template>
  <Markdown :source="notes" />
</template>

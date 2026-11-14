<script setup lang="ts">
import { Badge } from '@artisanpack-ui/vue';
</script>

<template>
  <Badge color="success">Paid</Badge>
  <Badge color="info" variant="solid">New</Badge>
  <Badge color="warning" variant="outline">Pending</Badge>
  <Badge color="error" variant="ghost" dot>Overdue</Badge>
</template>

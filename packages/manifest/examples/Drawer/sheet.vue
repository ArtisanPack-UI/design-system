<script setup lang="ts">
import { Button, Drawer } from '@artisanpack-ui/vue';
</script>

<template>
  <Drawer side="bottom" trigger="Share" title="Share listing">
    <Button variant="outline" color="neutral" leading-icon="copy">Copy link</Button>
    <Button variant="outline" color="neutral" leading-icon="mail">Email</Button>
  </Drawer>
</template>

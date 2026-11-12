<script setup lang="ts">
import { Button, Input, Stack } from '@artisanpack-ui/vue';
</script>

<template>
  <Stack gap="4">
    <Input label="Name" />
    <Input label="Email" type="email" />
    <Button>Save</Button>
  </Stack>
</template>

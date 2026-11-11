<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@artisanpack-ui/vue';
</script>

<template>
  <DropdownMenu label="Options" @select="(value) => console.log(value)">
    <DropdownMenuGroup label="Listing">
      <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
      <DropdownMenuItem value="duplicate" icon="copy">Duplicate</DropdownMenuItem>
      <DropdownMenuItem value="archive" disabled>Archive</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
  </DropdownMenu>
</template>

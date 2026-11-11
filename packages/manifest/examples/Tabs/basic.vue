<script setup lang="ts">
import { Tab, Tabs } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const section = ref('profile');
</script>

<template>
  <Tabs v-model="section" label="Account">
    <Tab value="profile" label="Profile" icon="user">Your name, photo and contact details.</Tab>
    <Tab value="notifications" label="Notifications" icon="mail">
      Choose what we email you about.
    </Tab>
    <Tab value="security" label="Security" icon="lock">Password and two-factor authentication.</Tab>
  </Tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Avatar, Calendar, Dialog, Pagination, Stat, Tabs, Tooltip } from '@artisanpack-ui/vue';
import { ErrorState } from '@artisanpack-ui/vue';

const tab = ref('profile');
const page = ref(1);
const day = ref(new Date());
const confirming = ref(false);
</script>

<template>
  <div class="card bg-base-100 p-6">
    <ErrorState v-if="error" :description="error" />
    <Tooltip :content="user.email" placement="end">
      <Avatar :src="user.avatar" status="online" />
    </Tooltip>
    <Stat label="Projects" :value="12" trend="flat" />
    <tabs :model-value="tab" orientation="vertical" :tabs="tabs" />
    <Pagination :page="page" :page-count="9" :siblings="2" />
    <Calendar v-model:date="day" :week-starts-on="1" />
    <Dialog v-model:open="confirming" description="This cannot be undone." surface="glass">
      Delete the workspace?
      <template #footer>
        <button class="btn btn-error" @click="confirming = false">Delete</button>
      </template>
    </Dialog>
  </div>
</template>

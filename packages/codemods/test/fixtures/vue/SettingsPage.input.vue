<script setup lang="ts">
import { ref } from 'vue';
import { Avatar, Calendar, Modal, Pagination, Stat, Tabs, Tooltip } from '@artisanpack-ui/vue';
import { ErrorDisplay } from '@artisanpack-ui/vue';

const tab = ref('profile');
const page = ref(1);
const day = ref(new Date());
const confirming = ref(false);
</script>

<template>
  <div class="card bg-base-100 p-6">
    <ErrorDisplay v-if="error" :message="error" />
    <Tooltip :text="user.email" position="right">
      <Avatar :src="user.avatar" online />
    </Tooltip>
    <Stat title="Projects" :value="12" change-direction="neutral" />
    <tabs :active-tab="tab" vertical :tabs="tabs" />
    <Pagination :current-page="page" :total-pages="9" :sibling-count="2" />
    <Calendar v-model="day" :week-start="1" />
    <Modal v-model:open="confirming" subtitle="This cannot be undone." glass>
      Delete the workspace?
      <template #actions>
        <button class="btn btn-error" @click="confirming = false">Delete</button>
      </template>
    </Modal>
  </div>
</template>

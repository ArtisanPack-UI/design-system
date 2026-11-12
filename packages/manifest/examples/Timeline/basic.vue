<script setup lang="ts">
import { Timeline, TimelineItem } from '@artisanpack-ui/vue';
</script>

<template>
  <Timeline label="Activity">
    <TimelineItem
      icon="circle-check"
      color="success"
      time="2h ago"
      datetime="2026-11-12T08:00"
      description="Phoenix Baker accepted $248,000."
    >
      <strong>Offer accepted</strong> on Lakeview Lofts
    </TimelineItem>
    <TimelineItem
      icon="message-square"
      time="5h ago"
      card="Can we move the viewing to Thursday at 11:00?"
    >
      <strong>Olivia Rhye</strong> commented
    </TimelineItem>
    <TimelineItem
      icon="house"
      color="primary"
      time="Dec 13"
      datetime="2026-12-13"
      title="Listing published"
    />
  </Timeline>
</template>

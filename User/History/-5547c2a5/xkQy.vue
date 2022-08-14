<template>
  <n-card class="inform-index">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="消息">
        <message />
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="公告">
        <announcement />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
  import Message from './message/index.vue'
  import Announcement from './announcement/index.vue'
</script>

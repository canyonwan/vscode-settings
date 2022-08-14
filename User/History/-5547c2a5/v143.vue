<template>
  <n-card class="inform-index">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="消息" display-directive="show:lazy">
        <message />
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="公告" display-directive="show:lazy">
        <announcement />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
  import Message from './message/index.vue'
  import Announcement from './announcement/index.vue'
</script>

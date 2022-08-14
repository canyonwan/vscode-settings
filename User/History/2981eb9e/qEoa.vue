<script setup lang="ts">
  import type { ISaveTimelineNodeParams } from '@/api/program/types'

  const state = reactive<ISaveTimelineNodeParams>({
    timeLineId: ''
  })

  function handleSubmit() {}
</script>
<template>
  <div class="save-timeline-node">
    <n-form label-placement="left" label-width="100px" :style="{ width: '80%' }">
      <!-- 案由编号-->
      <n-form-item label="案由编号">
        <n-input v-model:value="data.identifier" placeholder="请输入案由编号" />
      </n-form-item>
      <n-form-item label="&nbsp;">
        <n-button type="success" @click="handleSubmit">保存</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

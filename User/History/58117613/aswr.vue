<script setup lang="ts">
  import { type IRelateProgramOrTask, relateProgramOrTask } from '@/api/workflow/cause'

  async function onRelateProgram() {
    let params: IRelateProgramOrTask = {
      dataId: '',
      dataType: '',
      targetType: '',
      targetId: '',
      timeLineId: '',
      toolId: '',
      toolGroup: ''
    }
    await relateProgramOrTask(params)
  }
</script>
<template>
  <div class="relate-program">
    <n-button type="primary" @click="onRelateProgram">确定</n-button>
  </div>
</template>

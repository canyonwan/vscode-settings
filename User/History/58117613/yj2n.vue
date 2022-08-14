<script setup lang="ts">
  import { type IRelateProgramOrTask, relateProgramOrTask } from '@/api/workflow/cause'

  async function onRelateProgram() {
    let params: IRelateProgramOrTask = {
  dataId: string
  dataType: string
  targetType: string
  targetId: string
  timeLineId: string
  toolId: string
  toolGroup: string
    }
    await relateProgramOrTask(params)
  }
</script>
<template>
  <div class="relate-program"> relate-program </div>
</template>

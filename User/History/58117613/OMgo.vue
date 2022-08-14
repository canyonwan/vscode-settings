<script setup lang="ts">
  import type { ICaseConnectInfo } from '@/api/time-line/types'
  import { type IRelateProgramOrTask, relateProgramOrTask } from '@/api/workflow/cause'
  import ProgramList from '@/views/program/index.vue'

  const props = defineProps({
    caseInfo: {
      type: Object as PropType<ICaseConnectInfo>,
      default: () => {}
    }
  })

  const emit = defineEmits(['submit-handler'])

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
    emit('submit-handler')
  }
</script>
<template>
  <div class="relate-program">
    <ProgramList use-selector />
    <n-button class="float-right" type="primary" @click="onRelateProgram">确定</n-button>
  </div>
</template>

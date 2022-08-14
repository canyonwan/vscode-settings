<script setup lang="ts">
  import { ICaseConnectInfo } from '@/api/time-line/types'
  import { type IRelateProgramOrTask, relateProgramOrTask } from '@/api/workflow/cause'

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
    <n-button type="primary" @click="onRelateProgram">确定</n-button>
  </div>
</template>

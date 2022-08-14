<script setup lang="ts">
  import { ICauseItemForProgram } from '@/api/program/types'
  import type { ICaseConnectInfo } from '@/api/time-line/types'
  import { chooseCauseWhenTransferoutProgram, confirmTransferoutProgram, IConfirmTransferoutCauseListParams, IConfirmTransferoutParams } from '@/api/workflow/cause'
  import { useDialog } from 'naive-ui'

  const props = defineProps({
    caseInfo: {
      type: Object as PropType<ICaseConnectInfo>,
      default: () => {}
    }
  })

  const dialog = useDialog()

  interface IState {
    causes: ICauseItemForProgram[]
    causeList: IConfirmTransferoutCauseListParams[]
  }

  const state: IState = reactive({
    causes: [],
    causeList: []
  })

  async function getCauses() {
    state.causes = await chooseCauseWhenTransferoutProgram({ toolId: props.caseInfo.toolId, proceduresId: props.caseInfo.procedureId })
  }

  // 确定转出
  function onConfirmTransferout() {
    let params: IConfirmTransferoutParams = {
      toolId: props.caseInfo.toolId,
      toolGroup: props.caseInfo.toolGroup,
      proceduresId: props.caseInfo.procedureId,
      causeList: state.causeList
    }

    dialog.warning({
      title: '警告',
      content: '你确定？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        state.causes = await confirmTransferoutProgram(params)
      }
    })
  }

  onMounted(() => {
    getCauses()
  })
</script>
<template>
  <div>
    <!--  -->
    <n-tree block-line :data="state.causes" key-field="id" label-field="name" />
    <div class="float-right mt-4">
      <n-button type="primary" @click="onConfirmTransferout">确定</n-button>
    </div>
  </div>
</template>

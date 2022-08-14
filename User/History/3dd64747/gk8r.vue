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
    causeListTemp: string[]
  }

  const state: IState = reactive({
    causes: [],
    causeList: [],
    causeListTemp: []
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
  <n-checkbox-group v-model:value="state.causeListTemp" v-for="i in state.causes" :key="i.caseType" class="py-2">
    <div class="py-2 text-gray-400">{{ i.caseTypeName }} </div>
    <n-collapse class="pl-4" accordion arrow-placement="right">
      <n-collapse-item v-for="e in i.causeList" :key="e.id" :title="e.name" :name="e.id">
        <n-checkbox class="pl-4 py-1" v-for="tip in e.tipList" :key="tip.title">
          <span>{{ tip.title }}</span>
          <n-ellipsis style="max-width: 200px">
            {{ tip.content }}
          </n-ellipsis>
        </n-checkbox>
      </n-collapse-item>
    </n-collapse>
    <div class="float-right mt-4">
      <n-button type="primary" @click="onConfirmTransferout">确定</n-button>
    </div>
  </n-checkbox-group>
</template>

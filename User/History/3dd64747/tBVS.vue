<script setup lang="ts">
  import { ICauseItemForProgram } from '@/api/program/types'
  import type { ICaseConnectInfo } from '@/api/time-line/types'
  import { chooseCauseWhenTransferoutProgram, confirmTransferoutProgram, type IConfirmTransferoutParams } from '@/api/workflow/cause'
  import { useDialog } from 'naive-ui'

  const props = defineProps({
    caseInfo: {
      type: Object as PropType<ICaseConnectInfo>,
      default: () => {}
    }
  })

  const emit = defineEmits(['submitHandler'])

  const dialog = useDialog()

  interface IState {
    causes: ICauseItemForProgram[]
    causeListTemp: string[]
  }

  const state: IState = reactive({
    causes: [],
    causeListTemp: []
  })

  async function getCauses() {
    state.causes = await chooseCauseWhenTransferoutProgram({ toolId: props.caseInfo.toolId, proceduresId: props.caseInfo.procedureId })
  }

  // 确定转出
  function onConfirmTransferout() {
    const causeList = state.causeListTemp.map((i) => {
      const res = i.split('&')
      return {
        id: res[0],
        caseType: res[1]
      }
    })

    let params: IConfirmTransferoutParams = {
      toolId: props.caseInfo.toolId,
      toolGroup: props.caseInfo.toolGroup,
      proceduresId: props.caseInfo.procedureId,
      causeList: causeList
    }

    dialog.warning({
      title: '警告',
      content: '你确定？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        await confirmTransferoutProgram(params)
        emit('submitHandler')
      }
    })
  }

  function onItemHeader({ event }: { event: MouseEvent }) {
    event.stopPropagation()
  }

  onMounted(() => {
    getCauses()
  })
</script>
<template>
  <n-checkbox-group v-model:value="state.causeListTemp" v-for="i in state.causes" :key="i.caseType" class="py-2">
    <div class="py-2 text-gray-400">{{ i.caseTypeName }} </div>
    <n-collapse class="pl-4" accordion arrow-placement="right" @item-header-click="onItemHeader">
      <n-checkbox :value="`${e.id}&${e.caseType}`" v-for="e in i.causeList" :key="e.id" :disabled="e.transferOut === 1">
        <n-collapse-item :title="`${e.name}${e.transferOut === 1 ? '【已转出】' : ''}`" :name="e.id">
          <div class="pl-4 py-1" v-for="tip in e.tipList" :key="tip.title">
            <span>{{ tip.title }}</span>
            <n-ellipsis style="max-width: 200px">
              {{ tip.content }}
            </n-ellipsis>
          </div>
        </n-collapse-item>
      </n-checkbox>
    </n-collapse>
  </n-checkbox-group>
  <div class="float-right mt-4">
    <n-button type="primary" @click="onConfirmTransferout" :disabled="state.causeListTemp.length === 0">确定</n-button>
  </div>
</template>

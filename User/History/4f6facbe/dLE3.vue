<script setup lang="ts">
  import { tabOptions, dynamicComp } from './options'
  import { permanentlyDelete, queryDeletedNode, restoreEvidenceWaste, restoreIllegalActWaste, restoreNodeNameWaste, restoreWaste } from '@/api/program/program'
  import type { Ref } from 'vue'
  import type { IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'
  import { useDialog } from 'naive-ui'
  import { useCheckAll } from './composables/useCheckAll'

  interface ISate {
    whetherSelectAll: boolean
    currentType: number
  }

  const dialog = useDialog()

  const injectProgramId = inject<Ref<string>>('provideProgramId')

  const rubbish = ref<Array<IDeletedNodeItem | IDeletedIllegalAct>>()
  const state = reactive<ISate>({
    whetherSelectAll: false,
    currentType: tabOptions[0].value
  })

  const checkedChildren = ref<string[]>([])

  provide('provideRubbish', readonly(rubbish))
  provide('provideCheckedChildren', checkedChildren)

  async function getDeletedNodes() {
    const deletedNodes = await queryDeletedNode(unref(injectProgramId)!, state.currentType)
    rubbish.value = deletedNodes
    console.log('%c [ deletedNodes ]-32', 'font-size:13px; background:#0095FF; color:white;', deletedNodes)
  }

  // tab change
  async function onUpdateTab(tab: number) {
    state.currentType = tab
    rubbish.value = []
    state.whetherSelectAll = false
    checkedChildren.value.length = 0
    await getDeletedNodes()
  }

  // 恢复
  async function onRestore() {
    dialog.warning({
      title: '温馨提示',
      content: '恢复即代表节点里的内容全部恢复，并且恢复到删除前的位置，您确定要恢复吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        switch (state.currentType) {
          case 1:
            await restoreNodeNameWaste(checkedChildren.value)
            break
          case 3:
            const res = checkedChildren.value.map((item) => {
              const arr = item.split('&')
              return {
                causeId: arr[0],
                caseTypeId: arr[1]
              }
            })
            await restoreIllegalActWaste(unref(injectProgramId)!, res)
            break
          case 4:
            await restoreEvidenceWaste(checkedChildren.value)
            break
          default:
            await restoreWaste(checkedChildren.value!, state.currentType)
            break
        }
        setTimeout(() => {
          getDeletedNodes()
        }, 1000)
      }
    })
  }

  // 删除
  async function onPermanentlyDelete() {
    dialog.error({
      title: '温馨提示',
      content: '你确定永久性删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await permanentlyDelete(checkedChildren.value!, state.currentType)
        await getDeletedNodes()
      }
    })
  }

  // checkbox handler
  function handleUpdateValue(values: string[]) {
    checkedChildren.value = values
    state.whetherSelectAll = !(checkedChildren.value.length < rubbish.value!.length)
  }

  // 全选
  function onUpdateChecked(checked: boolean) {
    state.whetherSelectAll = checked
    checkedChildren.value = useCheckAll(state.whetherSelectAll, rubbish.value!)
  }

  onMounted(() => {
    getDeletedNodes()
  })
</script>
<template>
  <div class="waste">
    <n-tabs justify-content="space-evenly" type="line" @update:value="onUpdateTab">
      <n-tab-pane v-for="tab in tabOptions" :key="tab.value" :name="tab.value" :tab="tab.label">
        <n-empty v-if="!rubbish || rubbish?.length === 0" class="my-10" description="你什么也找不到" />
        <component v-else :is="dynamicComp[tab.value]" @handleUpdateValue="handleUpdateValue" />
      </n-tab-pane>
    </n-tabs>
    <div class="mt-8 mb-2">
      <n-space justify="space-between">
        <n-checkbox :checked="state.whetherSelectAll" @update:checked="onUpdateChecked" :disabled="!rubbish || rubbish?.length === 0">全选</n-checkbox>
        <n-button-group size="small">
          <n-button type="error" round @click="onPermanentlyDelete" :disabled="checkedChildren!.length===0"> 永久删除&nbsp;({{ checkedChildren!.length }}) </n-button>
          <n-button type="primary" round @click="onRestore" :disabled="checkedChildren!.length===0"> 恢复&nbsp;({{ checkedChildren!.length }}) </n-button>
        </n-button-group>
      </n-space>
    </div>
  </div>
</template>

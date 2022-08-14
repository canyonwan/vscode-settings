<script setup lang="ts">
  import { queryCauseListForProgram } from '@/api/program/program'
  import type { ICauseList, IProgramItem } from '@/api/program/types'
  import type { Ref } from 'vue'

  const injectProgramDetail: Ref<IProgramItem> = inject('programDetail')!
  const causeListData = ref<ICauseList[]>([])
  const defaultTabValue = ref<string>('')

  // 获取[罚款]的违法行为列表
  async function getCauseListForProgram() {
    const res = await queryCauseListForProgram({ proceduresId: unref(injectProgramDetail).id, caseTypeIdList: ['1000009'] })
    if (res?.length > 0) {
      causeListData.value = res[0].causeList
      defaultTabValue.value = res[0].causeList[0].id
    }
  }

  function handleTabBeforeLeave(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      dialog.warning({
        title: '警告',
        content: '当前裁量还没有保存,是否直接跳过？',
        positiveText: '直接跳过',
        negativeText: '取消',
        onPositiveClick: () => {
          currentStep.value = 1
          resolve(true)
        },
        onNegativeClick: () => {
          resolve(false)
        }
      })
    })
  }

  getCauseListForProgram()
</script>
<template>
  <n-empty style="min-height: 400px" class="justify-center" description="暂无数据" v-if="causeListData.length === 0" />
  <div v-else>
    <n-tabs type="bar" animated size="large" v-model:value="defaultTabValue" @before-leave="handleTabBeforeLeave">
      <n-tab-pane v-for="item in causeListData" :key="item.id" :name="item.id" display-directive="show:lazy">
        <template #tab>
          <n-ellipsis style="max-width: 240px"> {{ item.name }} </n-ellipsis>
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

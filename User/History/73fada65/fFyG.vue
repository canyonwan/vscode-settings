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

  getCauseListForProgram()
</script>
<template>
  <n-empty style="min-height: 400px" class="justify-center" description="暂无数据" v-if="causeListData.length === 0" />
  <div class="confiscate"> confiscate </div>
</template>

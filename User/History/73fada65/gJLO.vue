<script setup lang="ts">
  import { queryCauseListForProgram } from '@/api/program/program'

  // 获取[罚款]的违法行为列表
  async function getCauseListForProgram() {
    const res = await queryCauseListForProgram({ proceduresId: unref(injectProgramDetail).id, caseTypeIdList: [1000009] })
    if (res?.length > 0) {
      causeListData.value = res[0].causeList
      defaultTabValue.value = res[0].causeList[0].id
    }
  }
</script>
<template>
  <div class="confiscate"> confiscate </div>
</template>

<script setup lang="ts">
  import { queryCauseListForProgram } from '@/api/program/program'
  import type { Ref } from 'vue'
  import type { ICauseList } from '@/api/program/types'
  import DTabPane from './components/d-tab-pane.vue'
  import { handleNextStepKey } from './components/foo-keys'

  const fineId = '1000010' // 罚款id

  const currentStep = ref<number>(1)
  const el = ref<HTMLElement>()

  useScroll(el, {
    offset: { top: 30, left: 0 }
  })

  const injectProgramId: Ref<string> = inject('provideProgramId')!

  const provideHandleStepFn = provide(handleNextStepKey, handleNextStep)

  const causeListData = ref<ICauseList[]>()

  // 获取[罚款]的违法行为列表
  async function getCauseListForProgram() {
    const res = await queryCauseListForProgram({ proceduresId: unref(injectProgramId), caseTypeIdList: [fineId] })
    const { causeList } = res.filter((item) => item.caseType === 101).at(0)!
    causeListData.value = causeList
  }

  function handleNextStep() {
    if (currentStep.value === null) currentStep.value = 1
    else if (currentStep.value === 2) currentStep.value--
    else currentStep.value++
  }

  onMounted(() => {
    getCauseListForProgram()
  })
</script>
<template>
  <n-card class="discretion" ref="el">
    <n-tabs v-for="item in causeListData" :key="item.id" class="card-tabs" size="large" animated style="margin: 0 -4px" pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
      <n-tab-pane :name="item.id" :tab="item.name">
        <d-tab-pane :current-step="currentStep" :programCauseId="item.id" @handleNextStep="handleNextStep" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

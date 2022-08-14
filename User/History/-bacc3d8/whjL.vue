<script setup lang="ts">
  import DType from './components/d-type.vue'
  import DMenu from './components/d-menu.vue'
  import { queryCauseListForProgram } from '@/api/program/program'
  import type { Ref } from 'vue'
  import type { ICauseList } from '@/api/program/types'
  import { useMessage } from 'naive-ui'

  const fineId = '1000010' // 罚款id

  const currentStep = ref<number | null>(1)
  const el = ref<HTMLElement>()

  useScroll(el, {
    offset: { top: 30, left: 0 }
  })

  const message = useMessage()

  function handleNextStep() {
    if (currentStep.value === null) currentStep.value = 1
    else if (currentStep.value === 2) currentStep.value--
    else currentStep.value++
  }

  const injectProgramId: Ref<string> = inject('provideProgramId')!

  const causeListData = ref<ICauseList[]>()

  // 获取[罚款]的违法行为列表
  async function getCauseListForProgram() {
    const res = await queryCauseListForProgram({ proceduresId: unref(injectProgramId), caseTypeIdList: [fineId] })
    const { causeList } = res.filter((item) => item.caseType === 101).at(0)!
  }

  onMounted(() => {
    getCauseListForProgram()
  })
</script>
<template>
  <n-card class="discretion" ref="el">
    <n-tabs v-for="item in causeListData" :key="item.id" class="card-tabs" size="large" animated style="margin: 0 -4px" pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
      <n-tab-pane :name="item.id" :tab="item.name">
        <div class="bg-contentBgColor rounded-sm p-5">
          <div class="my-8">
            <n-steps size="small" :current="(currentStep as number)">
              <n-step title="裁量类型" status="process" />
              <n-step title="裁量要素" />
            </n-steps>
          </div>
          <component :is="currentStep === 1 ? DType : DMenu" @onNextStep="handleNextStep" />
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

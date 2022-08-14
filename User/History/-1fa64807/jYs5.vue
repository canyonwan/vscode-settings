<script setup lang="ts">
  import { queryCauseListForProgram } from '@/api/program/program'
  import type { Ref } from 'vue'
  import type { ICauseList, IProgramItem } from '@/api/program/types'
  import DTabPane from './components/d-tab-pane.vue'
  import { handleNextStepKey } from './components/foo-keys'
  import DDaysOfViolation from './components/d-days-of-violation.vue'
  import { useDialog } from 'naive-ui'

  const fineId = '1000010' // 罚款id

  const currentStep = ref<number>(1)
  const defaultTabValue = ref<string>('')
  const el = ref<HTMLElement>()

  useScroll(el, {
    offset: { top: 30, left: 0 }
  })

  // const injectProgramId: Ref<string> = inject('provideProgramId')!
  const injectProgramDetail: Ref<IProgramItem> = inject('programDetail')!
  const emits = defineEmits(['handleSaveDiscretion'])

  provide(handleNextStepKey, handleNextStep)

  const causeListData = ref<ICauseList[]>([])
  const isLoading = ref<boolean>(false)
  const discretionTypeId = ref<string>()

  // 获取[罚款]的违法行为列表
  async function getCauseListForProgram() {
    const res = await queryCauseListForProgram({ proceduresId: unref(injectProgramDetail).id, caseTypeIdList: [fineId] })
    const findFineDiscretions = res.filter((item) => item.caseType === 101)
    if (findFineDiscretions.length > 0) {
      causeListData.value = findFineDiscretions[0].causeList
      defaultTabValue.value = findFineDiscretions[0].causeList[0].id
    }
  }

  function handleNextStep() {
    if (currentStep.value === null) currentStep.value = 1
    else if (currentStep.value === 2) currentStep.value--
    else currentStep.value++
  }

  function handleDiscretionTypeId(id: string) {
    discretionTypeId.value = id
  }

  // emit handleSaveDiscretion
  function handleSaveDiscretion() {
    emits('handleSaveDiscretion')
  }

  const dialog = useDialog()

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

  onMounted(() => {
    getCauseListForProgram()
  })
</script>
<template>
  <n-empty style="min-height: 400px" class="justify-center" description="暂无数据" v-if="causeListData.length === 0" />

  <n-card v-else class="discretion" ref="el">
    <!-- 裁量类型是违法天数时 -->
    <d-days-of-violation v-if="discretionTypeId === '1000003'" />
    <!-- 裁量类型是罚款时 -->
    <div v-else>
      <n-tabs type="bar" animated size="large" v-model:value="defaultTabValue" @before-leave="handleTabBeforeLeave">
        <n-tab-pane v-for="item in causeListData" :key="item.id" :name="item.id" display-directive="show:lazy">
          <template #tab>
            <n-ellipsis style="max-width: 240px"> {{ item.name }} </n-ellipsis>
          </template>
          <d-tab-pane :current-step="currentStep" :programCauseId="item.id" @handle-discretion-type-id="handleDiscretionTypeId" @handle-save-discretion="handleSaveDiscretion" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </n-card>
</template>

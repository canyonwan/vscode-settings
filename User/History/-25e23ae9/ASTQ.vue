<script setup lang="ts">
  import type { IDiscretionMenuItem, IDiscretionOptions, IProgramItem } from '@/api/program/types'
  import { Add, ArrowLeft } from '@vicons/carbon'
  import { discretionOptionDataKey, handleNextStepKey, IDiscretionBaseState } from './foo-keys'
  import DMenuItem from './d-menu-item.vue'
  import { ICalcDiscretionSumFormalParameter } from '@/api/program/types'
  import { Ref } from 'vue'
  import { useModal } from '@/components/modal'
  import CustomDiscretion from './custom-discretion.vue'
  import { useCalcMoney } from '../useCalcMoney'
  import { saveCalcDiscretionSum } from '@/api/program/program'
  import { useFindRadioGroup } from '../useFindRadioGroup'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    },
    discretionBaseState: {
      type: Object as PropType<IDiscretionBaseState>,
      default: () => {}
    }
  })

  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '自定义裁量',
    displayDirective: 'if'
  })

  let discretionElements: Recordable<string[]> = {}

  const injectHandleStepFn: () => void = inject(handleNextStepKey)!
  const injectProgramId: Ref<string> = inject('provideProgramId')!
  const programDetail = inject<IProgramItem>('programDetail')
  const { discretionDetailList, discretionCustomList } = inject<IDiscretionOptions>(discretionOptionDataKey)!

  // radio选中的push到checkedDiscretionDetail里
  const calcMoneyState = reactive<ICalcDiscretionSumFormalParameter>({
    proceduresCauseId: props.programCauseId,
    causeDiscretionId: props.discretionBaseState.discretionBaseId,
    timeLineId: programDetail!.timeLineId,
    toolId: '',
    toolGroupId: '',
    proceduresId: unref(injectProgramId),
    baseValue: props.discretionBaseState.baseValue,
    checkedDiscretionDetail: []
  })

  provide('calcMoneyState', calcMoneyState)
  provide('discretionElements', discretionElements)

  function onNextStep() {
    injectHandleStepFn()
  }
  const { discretionElements } = useFindRadioGroup(discretionDetailList)

  onMounted(async () => {
    useFindRadioGroup(discretionDetailList)
    if (discretionCustomList.length > 0) {
      calcMoneyState.checkedDiscretionDetail = discretionCustomList.map((item) => {
        return {
          id: item.id,
          operatorValue: item.operatorValue
        }
      })
      await useCalcMoney(calcMoneyState)
    }
  })

  // 自定义裁量回调
  async function handleSubmitCustomDiscretion(customDiscretionRes: IDiscretionMenuItem) {
    discretionCustomList.push(customDiscretionRes)
    calcMoneyState.checkedDiscretionDetail.push({
      id: customDiscretionRes.id,
      operatorValue: customDiscretionRes.operatorValue
    })
    await useCalcMoney(calcMoneyState)
    closeModal()
  }

  function handleDeleteCustomDiscretion(id: string) {
    const index = discretionCustomList.findIndex((item) => item.id === id)
    if (index > -1) {
      discretionCustomList.splice(index, 1)
      useCalcMoney(calcMoneyState)
    }
  }

  // 完成裁量
  async function onDoneDiscretion() {
    await saveCalcDiscretionSum(calcMoneyState)
  }
</script>

<template>
  <div class="discretion-menu">
    <div v-for="item in discretionDetailList" :key="item.id">
      <!-- 是组区分 -->
      <d-menu-item :item="item" />
    </div>
    <!-- 自定义裁量 -->
    <div class="custom-discretion">
      <n-space justify="space-between" class="py-6">
        <div class="text-lg text-blue-500">自定义裁量</div>
        <n-button @click="() => openModal()">
          新增自定义裁量
          <template #icon>
            <n-icon :component="Add" />
          </template>
        </n-button>
      </n-space>
      <div v-for="customItem in discretionCustomList" :key="customItem.id">
        <d-menu-item :item="customItem" @handleDeleteCustomDiscretion="handleDeleteCustomDiscretion" />
      </div>
    </div>

    <n-space justify="end">
      <n-button ghost type="primary" size="large" @click="onNextStep">
        <template #icon>
          <n-icon :component="ArrowLeft" />
        </template>
        返回上一步
      </n-button>
      <n-button type="primary" size="large" @click="onDoneDiscretion">完成</n-button>
    </n-space>
    <!-- 自定义裁量 -->
    <basic-modal @register="modalRegister" style="width: 50%">
      <custom-discretion :programCauseId="props.programCauseId" @handleSubmitCustomDiscretion="handleSubmitCustomDiscretion" />
    </basic-modal>
  </div>
</template>

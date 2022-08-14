<script setup lang="ts">
  import type { IDiscretionMenuItem, IDiscretionOptions, IProgramItem } from '@/api/program/types'
  import { Add, ArrowLeft } from '@vicons/carbon'
  import { discretionOptionDataKey, handleNextStepKey, IDiscretionBaseState } from './foo-keys'
  import DMenuItem from './d-menu-item.vue'
  import { ICalcDiscretionSumFormalParameter } from '@/api/program/types'
  import { Ref } from 'vue'
  import { useModal } from '@/components/modal'
  import CustomDiscretion from './custom-discretion.vue'
  import { useCalcMoney } from '@/views/program/discretion/composables/useCalcMoney'
  import { saveCalcDiscretionSum } from '@/api/program/program'
  import { useFindRadioGroup } from '@/views/program/discretion/composables/useFindRadioGroup'

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
    title: '从轻、减轻、从重等自定义裁量情形',
    displayDirective: 'if'
  })

  watch(
    () => props.discretionBaseState.baseValue,
    () => {
      calcMoneyState.baseValue = props.discretionBaseState.baseValue
      calcMoneyState.causeDiscretionId = props.discretionBaseState.discretionBaseId
    }
  )

  const emits = defineEmits(['handlePrevStep', 'handleSaveDiscretion'])

  const injectHandleStepFn: () => void = inject(handleNextStepKey)!
  const injectCaseInfo = inject<Ref<any>>('dispatchCaseInfo')
  const injectProgramDetail: Ref<IProgramItem> = inject('programDetail')!
  // const { discretionDetailList, discretionCustomList } = inject<IDiscretionOptions>(discretionOptionDataKey)!
  const injectDiscretionOptions = inject<IDiscretionOptions>(discretionOptionDataKey)!

  // radio选中的push到checkedDiscretionDetail里
  const calcMoneyState = reactive<ICalcDiscretionSumFormalParameter>({
    proceduresCauseId: props.programCauseId,
    causeDiscretionId: '', // 裁量类型id
    baseValue: 0, // 裁量基准值
    timeLineId: unref(injectProgramDetail).timeLineId,
    toolId: injectCaseInfo?.value.toolId || '',
    toolGroupId: injectCaseInfo?.value.toolGroup || '',
    proceduresId: unref(injectProgramDetail).id,
    checkedDiscretionDetail: [] // 选中的裁量要素列表
  })

  const { discretionElements } = useFindRadioGroup(injectDiscretionOptions.discretionDetailList)

  provide('calcMoneyState', calcMoneyState)
  provide('discretionElements', discretionElements)

  function onPrevStep() {
    injectHandleStepFn()
    emits('handlePrevStep')
  }

  onMounted(async () => {
    if (props.discretionBaseState) {
      calcMoneyState.baseValue = props.discretionBaseState.baseValue
      calcMoneyState.causeDiscretionId = props.discretionBaseState.discretionBaseId
    }

    if (injectDiscretionOptions.discretionCustomList.length > 0) {
      const customRes = injectDiscretionOptions.discretionCustomList.map((item) => {
        return {
          id: item.id,
          operatorValue: item.operatorValue
        }
      })
      calcMoneyState.checkedDiscretionDetail.push(...customRes)
    }

    recurseFindCheckedMenuItem(injectDiscretionOptions.discretionDetailList)
    calcMoneyState.checkedDiscretionDetail.length > 0 && (await useCalcMoney(calcMoneyState))
  })

  // 寻找radio选中的回显项
  function recurseFindCheckedMenuItem(arr: IDiscretionMenuItem[]) {
    if (arr.length > 0) {
      arr.forEach((item) => {
        if (item.options.length > 0) {
          recurseFindCheckedMenuItem(item.options)
        } else {
          if (item.isChecked === 1) {
            calcMoneyState.checkedDiscretionDetail.push({ id: item.id, operatorValue: item.operatorValue })
          }
        }
      })
    }
    return arr
  }

  // 自定义裁量回调
  async function handleSubmitCustomDiscretion(customDiscretionRes: IDiscretionMenuItem) {
    injectDiscretionOptions.discretionCustomList.push(customDiscretionRes)
    calcMoneyState.checkedDiscretionDetail.push({
      id: customDiscretionRes.id,
      operatorValue: customDiscretionRes.operatorValue
    })
    await useCalcMoney(calcMoneyState)
    closeModal()
  }

  // 完成裁量
  // TODO 遍历是否有必填项没有填写
  async function onDoneDiscretion() {
    await saveCalcDiscretionSum(calcMoneyState)
    emits('handleSaveDiscretion')
  }
</script>

<template>
  <div class="discretion-menu">
    <div v-for="item in injectDiscretionOptions.discretionDetailList" :key="item.id">
      <!-- 是组区分 -->
      <d-menu-item :item="item" />
    </div>

    <!-- 自定义裁量 -->
    <div class="custom-discretion">
      <n-space justify="space-between" class="py-6">
        <div class="text-lg text-blue-500">从轻、减轻、从重等自定义裁量情形</div>
        <n-button ghost type="success" @click="() => openModal()">
          新增
          <template #icon>
            <n-icon :component="Add" />
          </template>
        </n-button>
      </n-space>
      <div v-for="customItem in injectDiscretionOptions.discretionCustomList" :key="customItem.id">
        <d-menu-item :item="customItem" />
      </div>
    </div>

    <!-- 操作 -->
    <n-space justify="end">
      <n-button ghost type="primary" size="large" @click="onPrevStep">
        <template #icon>
          <n-icon :component="ArrowLeft" />
        </template>
        返回上一步
      </n-button>
      <n-button type="primary" size="large" @click="onDoneDiscretion">完成</n-button>
    </n-space>

    <!-- 新增自定义裁量 -->
    <basic-modal @register="modalRegister" style="width: 50%">
      <custom-discretion :programCauseId="props.programCauseId" @handleSubmitCustomDiscretion="handleSubmitCustomDiscretion" @cancelModalHandler="() => closeModal()" />
    </basic-modal>
  </div>
</template>

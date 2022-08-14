<script setup lang="ts">
  import DType from './d-type.vue'
  import DMenu from './d-menu.vue'
  import { queryDiscretionOptionData } from '@/api/program/program'
  import type { ICalcDiscretionResult, IDiscretionOptions } from '@/api/program/types'
  import { discretionOptionDataKey, IDiscretionBaseState } from './foo-keys'
  import { NumberAnimationInst } from 'naive-ui'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    },
    currentStep: {
      type: Number as PropType<number>,
      default: 0,
      required: true
    }
  })

  const emits = defineEmits(['handleDiscretionTypeId', 'handleSaveDiscretion'])

  const state = reactive<IDiscretionOptions>({
    discretionList: [],
    discretionDetailList: [],
    discretionCustomList: []
  })

  const currentDiscretionResult = ref<ICalcDiscretionResult>()

  // 获取裁量选项数据
  async function getDiscretionOptionsData() {
    const { discretionList, discretionDetailList, discretionCustomList } = await queryDiscretionOptionData(props.programCauseId)
    state.discretionList = discretionList
    state.discretionDetailList = discretionDetailList
    state.discretionCustomList = discretionCustomList
    // state.discretionResult.discretionMoney = discretionResult.discretionMoney
    emits('handleDiscretionTypeId', discretionList.at(0)?.discretionTypeId)
  }

  // 用于下级组件调用该方法 获取裁量选项数据
  provide('reloadDiscretionDataForJunior', getDiscretionOptionsData)
  provide(discretionOptionDataKey, state)

  const discretionBaseState = reactive<IDiscretionBaseState>({
    discretionBaseId: '',
    baseValue: 0 // 基准值
  })

  function handleDiscretionBaseState(state: IDiscretionBaseState) {
    discretionBaseState.discretionBaseId = state.discretionBaseId
    discretionBaseState.baseValue = state.baseValue
  }

  function handleSaveDiscretion() {
    emits('handleSaveDiscretion')
  }

  function handleCurrentCheckedMoney(value: ICalcDiscretionResult) {
    currentDiscretionResult.value = value
  }

  // 监听useCalcMoney方法金额改变
  const bus = useEventBus('discretionElements')
  bus.on((money: number) => {
    // currentMoney.value = money
    currentDiscretionResult.value!.discretionMoney = money
  })
  const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)

  onMounted(() => {
    getDiscretionOptionsData()
  })

  function handleClick() {
    numberAnimationInstRef.value?.play()
  }
</script>
<template>
  <div class="discretion-tab-panel">
    <!--  -->
    <div class="bg-contentBgColor rounded-sm p-5">
      <div class="py-4 px-10 bg-darkBg rounded">
        <n-steps size="small" :current="props.currentStep" class="w-1/2 m-auto">
          <n-step title="裁量类型" status="process" />
          <n-step title="裁量要素" />
        </n-steps>
      </div>
      <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
        <div class="text-gray-500 mt-4">系统裁量过程：{{ currentDiscretionResult?.systemMathProcess || '暂无系统裁量过程' }}</div>
        <div class="text-gray-500 mt-4">系统裁量结果：{{ currentDiscretionResult?.systemMathResult || '无' }}</div>
        <div class="text-gray-500 mt-4">自定义裁量计算过程：{{ currentDiscretionResult?.customMathProcess || '暂无' }}</div>
        <div class="text-gray-500 mt-4">自定义裁量结果：{{ currentDiscretionResult?.customMathResult || 0 }}</div>
        <div class="text-gray-500 mt-4">罚款计算公式：{{ currentDiscretionResult?.mathFormula || '暂无公式描述' }}</div>
      </n-ellipsis>
      <!-- <div class="text-2xl text-blue-500"> <span class="text-sm text-gray-500">处罚金额：</span> {{ currentDiscretionResult?.discretionMoney || 0 }}<span class="text-sm">&nbsp;元</span></div> -->
      <n-statistic label="自定义裁量结果：">
        <n-number-animation ref="numberAnimationInstRef" show-separator :to="currentDiscretionResult?.discretionMoney" :precision="2" locale="ru-RU" />
      </n-statistic>
      <n-button @click="handleClick"> 播放 </n-button>
      <keep-alive>
        <component
          :is="props.currentStep === 1 ? DType : DMenu"
          :programCauseId="props.programCauseId"
          :discretionBaseState="discretionBaseState"
          @handleDiscretionBaseState="handleDiscretionBaseState"
          @handleSaveDiscretion="handleSaveDiscretion"
          @currentCheckedMoney="handleCurrentCheckedMoney"
        />
      </keep-alive>
    </div>
  </div>
</template>

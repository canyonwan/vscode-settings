<script setup lang="ts">
  import DType from './d-type.vue'
  import DMenu from './d-menu.vue'
  import { queryDiscretionOptionData } from '@/api/program/program'
  import type { IDiscretionOptions } from '@/api/program/types'
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

  const emits = defineEmits(['handleDiscretionTypeId'])

  const state = reactive<IDiscretionOptions>({
    discretionList: [],
    discretionDetailList: [],
    discretionCustomList: [],
    discretionResult: {
      discretionMoney: 0
    }
  })

  // 获取裁量选项数据
  async function getDiscretionOptionsData() {
    const { discretionList, discretionDetailList, discretionCustomList, discretionResult } = await queryDiscretionOptionData(props.programCauseId)
    state.discretionList = discretionList
    state.discretionDetailList = discretionDetailList
    state.discretionCustomList = discretionCustomList
    state.discretionResult.discretionMoney = discretionResult.discretionMoney
    emits('handleDiscretionTypeId', discretionList.at(0)?.discretionTypeId)
  }

  const discretionBaseState = reactive<IDiscretionBaseState>({
    discretionBaseId: '',
    baseValue: 0 // 基准值
  })

  provide(discretionOptionDataKey, state)

  function handleDiscretionBaseState(state: IDiscretionBaseState) {
    //
    discretionBaseState.discretionBaseId = state.discretionBaseId
    discretionBaseState.baseValue = state.baseValue
  }

  function handleTotalMoney(totalMoney: number) {
    state.discretionResult.discretionMoney = totalMoney
  }
  const bus = useEventBus('discretionElements')
  bus.on((money: number) => {
    state.discretionResult.discretionMoney = money
  })
  onMounted(() => {
    getDiscretionOptionsData()
  })
  const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
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
      <div class="text">罚款计算公式：罚款数 = 法定最大值 * 裁量要素各百分值之和&nbsp;&nbsp;（当罚款数小于法定最小值时，取法定最小值）</div>
      <div class="text-2xl text-blue-500"> <span class="text-sm">处罚金额：</span> {{ state.discretionResult.discretionMoney }}<span class="text-sm">&nbsp;元</span></div>
      <!-- <n-number-animation :from="0.0" :to="state.discretionResult.discretionMoney" :active="false" :precision="3" locale="ru-RU" show-separator /> -->
      <!-- <n-statistic label="一个小目标" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" show-separator :from="0" :to="state.discretionResult.discretionMoney" :active="false" />
      </n-statistic> -->
      <component
        :is="props.currentStep === 1 ? DType : DMenu"
        :programCauseId="props.programCauseId"
        :discretionBaseState="discretionBaseState"
        @handleDiscretionBaseState="handleDiscretionBaseState"
        @handleTotalMoney="handleTotalMoney"
      />
    </div>
  </div>
</template>

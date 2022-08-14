<script setup lang="ts">
  import DType from './d-type.vue'
  import DMenu from './d-menu.vue'
  import { queryDiscretionOptionData } from '@/api/program/program'
  import type { IDiscretionOptions } from '@/api/program/types'
  import { discretionOptionDataKey } from './foo-keys'

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

  provide(discretionOptionDataKey, state)

  onMounted(() => {
    getDiscretionOptionsData()
  })
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
      <div>处罚金额: </div>
      <component :is="props.currentStep === 1 ? DType : DMenu" :programCauseId="props.programCauseId" @handleDiscretionBaseState="handleDiscretionBaseState" />
    </div>
  </div>
</template>

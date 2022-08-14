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
  }

  provide(discretionOptionDataKey, readonly(state))

  onMounted(() => {
    getDiscretionOptionsData()
  })
</script>
<template>
  <div class="discretion-tab-panel">
    <!--  -->
    <div class="bg-contentBgColor rounded-sm p-5">
      <div class="py-2 px-10 w-3/5 bg-darkBg">
        <n-steps size="small" :current="(props.currentStep as number)">
          <n-step title="裁量类型" status="process" />
          <n-step title="裁量要素" />
        </n-steps>
      </div>
      <component :is="props.currentStep === 1 ? DType : DMenu" />
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ProgramHome'
  }
</script>
<script lang="ts" setup>
  import type { ISelectOption } from '@/components/main-header'
  import type { DefineComponent, ShallowUnwrapRef } from 'vue'
  import { compMap } from './options'
  interface IPageVariables {
    currentProgramType: number // 程序类型
    currentComp: ShallowUnwrapRef<DefineComponent>
    active: boolean // 综合台帐开关
  }

  const props = defineProps({
    value: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: '行政检查'
    }
  })

  const defaultItem = ref(1)

  const pageVariable = reactive<IPageVariables>({
    currentProgramType: 1,
    currentComp: shallowRef(compMap.get(1)),
    active: false
  })

  function clickItemHandler(item: ISelectOption) {
    pageVariable.currentComp = compMap.get(item.value)
    pageVariable.currentProgramType = item.value as number
  }

  watch(
    () => props.value,
    () => {
      defaultItem.value = Number(props.value)
      clickItemHandler({ value: defaultItem.value, label: props.label })
    },
    { immediate: true }
  )
</script>

<template>
  <div class="enforce-account-home">
    <main-header :defaultItem="defaultItem" @click-item-handler="clickItemHandler" />
    <n-card :bordered="false">
      <component :is="pageVariable.currentComp" :programType="pageVariable.currentProgramType" />
    </n-card>
  </div>
</template>

<script setup></script>
<script lang="ts" setup>
  import type { ISelectOption } from '@/components/main-header'
  import type { DefineComponent, ShallowUnwrapRef } from 'vue'
  import { compMap, typeOptions } from './options'

  interface IPageVariables {
    currentProgramType: number // 程序类型
    currentComp: ShallowUnwrapRef<DefineComponent>
    typeOptions: ISelectOption[]
    active: boolean // 综合台帐开关
  }

  const pageVariable = reactive<IPageVariables>({
    currentProgramType: 1,
    currentComp: shallowRef(compMap.get(1)),
    typeOptions: typeOptions,
    active: false
  })

  function clickItemHandler(item: ISelectOption) {
    pageVariable.currentComp = compMap.get(item.value)
    pageVariable.currentProgramType = item.value as number
  }
</script>

<template>
  <div class="enforce-account-home">
    <main-header :options="pageVariable.typeOptions" @clickItemHandler="clickItemHandler">
      <div>
        <n-space align="center">
          综合台帐
          <n-switch v-model:value="pageVariable.active" />
          <n-button>线下检查/案件上传</n-button>
        </n-space>
      </div>
    </main-header>
    <n-card :bordered="false">
      <KeepAlive> <component :is="pageVariable.currentComp" :programType="pageVariable.currentProgramType" /> </KeepAlive>K
    </n-card>
  </div>
</template>

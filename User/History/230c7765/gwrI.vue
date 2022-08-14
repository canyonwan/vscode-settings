<script setup lang="ts">
  import { stageArray } from '@/views/program/components/map-options'
  import { stageBarEventKey } from '../bus-key'

  const currentStage = ref(stageArray[0].value)

  const stageBarBus = useEventBus(stageBarEventKey)

  function onTabChange(id: number) {
    currentStage.value = currentStage.value === id ? 0 : id
    stageBarBus.emit(currentStage.value)
  }

  onMounted(() => {
    // stageBarBus.emit(currentStage.value)
  })
</script>
<template>
  <n-space class="stage-bar sticky top-0">
    <div
      class="item text-white text-base text-center py-2 px-11 ml-7 mt-5 cursor-pointer rounded-lg font-bold"
      :class="{ 'item-selected': currentStage === item.value }"
      @click="onTabChange(item.value)"
      v-for="item in stageArray"
      :key="item.value"
      >{{ item.label }}</div
    >
  </n-space>
  <n-divider class="px-3" />
</template>

<style lang="less" scoped>
  .stage-bar {
    background-color: #121c2e;
    .item {
      color: #4676a4;
      background-color: #082646;
      transition: linear 0.3s;
      &-selected {
        background-color: #1783c0;
        color: white;
      }
    }
  }
</style>

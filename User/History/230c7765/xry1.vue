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
    stageBarBus.emit(currentStage.value)
  })
</script>
<template>
  <div class="stage-bar px-1">
    <n-space>
      <div
        class="item text-white text-base py-2 px-6 m-3 cursor-pointer rounded-lg font-bold"
        :class="{ 'item-selected': currentStage === item.value }"
        @click="onTabChange(item.value)"
        v-for="item in stageArray"
        :key="item.value"
        >{{ item.label }}</div
      >
    </n-space>
  </div>
</template>

<style lang="less" scoped>
  .stage-bar {
    background-color: #131b2e;
    border-radius: 2px;
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

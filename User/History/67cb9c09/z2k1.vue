<script setup lang="ts">
  import type { IProgramItem } from '@/api/program/types'
  import { programTypeMap } from '@/views/program/components/map-options'
  const props = defineProps({
    timelineId: {
      type: String,
      default: '',
      required: true
    },
    data: {
      type: Array as PropType<Array<IProgramItem>>,
      default: () => []
    }
  })

  const currentTimelineId = ref('')

  const emit = defineEmits(['dispatchRelatedProgram'])

  function onTabChange(item: IProgramItem) {
    currentTimelineId.value !== item.timeLineId && emit('dispatchRelatedProgram', item.timeLineId, item.procedureType)
    currentTimelineId.value = item.timeLineId
  }

  watch(
    () => props.timelineId,
    (newValue) => {
      currentTimelineId.value = newValue
    },
    {
      immediate: true
    }
  )
</script>
<template>
  <div class="related-program-bar h-full rounded-lg flex flex-col flex-1 justify-center">
    <div
      class="item text-white font-medium align-middle text-center text-sm cursor-pointer rounded-lg h-full"
      :class="{ 'item-selected': currentTimelineId === item.timeLineId }"
      @click="onTabChange(item)"
      v-for="item in props.data"
      :key="item.id"
      >{{ programTypeMap[item.procedureType] }}</div
    >
  </div>
</template>

<style lang="less" scoped>
  .related-program-bar {
    background-color: #083b65;
    width: 54px;
    .item {
      color: #4676a4;
      padding: 0 20px;
      transition: linear 0.3s;
      line-height: 25px;
      margin: 0 auto;
      // width: 20px;
      // writing-mode: vertical-lr;
      // letter-spacing: 8px;
      &-selected {
        font-weight: bold;
        background-color: #138ec2;
        color: white;
      }
    }
  }
</style>

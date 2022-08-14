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
  <div class="related-program-bar p-1 h-full rounded-lg flex flex-col justify-center">
    <div
      class="item text-white font-medium text-center px-3 text-sm cursor-pointer rounded-lg h-full flex flex-col justify-center"
      :class="{ 'item-selected': currentTimelineId === item.timeLineId }"
      @click="onTabChange(item)"
      v-for="item in props.data"
      :key="item.id"
    >
      <div v-for="text in programTypeMap[item.procedureType]" :key="text" class="">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .related-program-bar {
    background-color: #083b65;
    .item {
      color: #4676a4;
      transition: linear 0.3s;
      line-height: 25px;
      &-selected {
        font-weight: bold;
        background-color: #138ec2;
        color: white;
      }
    }
  }
</style>

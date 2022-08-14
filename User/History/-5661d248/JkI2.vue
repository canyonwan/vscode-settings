<script setup lang="ts">
  import { queryTimeLine } from '@/api/program/program'
  import type { ITimeLineTreeLeaf } from '@/api/program/types'
  import { stageBarEventKey, wasteDispatchEventKey } from '../../bus-key'
  import TimelineNode from './timeline-node.vue'

  const props = defineProps({
    timelineId: {
      type: String,
      default: '',
      required: true
    }
  })

  const emits = defineEmits(['nodeClick', 'dataSet'])

  const timelineNodes = ref<ITimeLineTreeLeaf[]>([])

  const stageBarBus = useEventBus(stageBarEventKey)

  stageBarBus.on((stage: number) => {
    stage ? filterTimelineNodes(stage) : getTimelineList()
  })

  // 当回收站恢复成功时 刷新时间轴树
  const refreshTimelineBus = useEventBus(wasteDispatchEventKey)
  refreshTimelineBus.on(async () => {
    await getTimelineList()
  })

  // get timeline tree
  async function getTimelineList() {
    const res = await queryTimeLine(props.timelineId)
    if (res) {
      timelineNodes.value = res.timeLineTree.childrenList
      emits('dataSet', res.dataSet)
    }
  }

  async function filterTimelineNodes(stage: number) {
    const res = await queryTimeLine(props.timelineId)
    const data = res.timeLineTree.childrenList.filter((item) => {
      return item.stage === stage
    })
    timelineNodes.value = data
  }

  // new add or delete node can be callback here
  function handleRefreshTimeTree() {
    getTimelineList()
  }

  function handleNodeClick(node) {
    emits('nodeClick', node)
  }

  // watchEffect(() => {
  //   props.timelineId && getTimelineList()
  // })

  watch(
    () => props.timelineId,
    () => {
      if (props.timelineId) {
        getTimelineList()
      }
    }
  )

  defineExpose({
    getTimelineList,
    filterTimelineNodes
  })
</script>
<template>
  <n-empty v-if="timelineNodes?.length === 0" class="text-center align-middle leading-8" description="什么也找不到️" />
  <div class="timeline-box" v-for="node in timelineNodes" :key="node.id">
    <timeline-node :item-node="node" @handleRefreshTimeTree="handleRefreshTimeTree" @node-click="handleNodeClick" />
  </div>
</template>

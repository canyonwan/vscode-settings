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
    console.log('%c [ stage ]-22', 'font-size:13px; background:#0095FF; color:white;', stage)
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
  //   console.log('%c [ props.timelineId ]-59', 'font-size:13px; background:#0095FF; color:white;', props.timelineId)
  //   props.timelineId && getTimelineList()
  // })

  watch(
    () => props.timelineId,
    () => {
      console.log('%c [ props.timelineId ]-86', 'font-size:13px; background:#0095FF; color:white;', props.timelineId)
      if (props.timelineId) {
        getTimelineList()
      }
    },
    {
      immediate: true
    }
  )

  defineExpose({
    getTimelineList,
    filterTimelineNodes
  })
</script>
<template>
  <div class="timeline-box" v-for="node in timelineNodes" :key="node.id">
    <timeline-node :item-node="node" @handleRefreshTimeTree="handleRefreshTimeTree" @node-click="handleNodeClick" />
  </div>
</template>

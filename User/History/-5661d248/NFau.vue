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

  const emit = defineEmits(['nodeClick', 'dataSet', 'refreshProgramDetailHandler'])

  const timelineNodes = ref<ITimeLineTreeLeaf[]>([])
  const loading = ref(false)

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
    loading.value = true
    const res = await queryTimeLine(props.timelineId)
    if (res) {
      loading.value = false
      timelineNodes.value = res.timeLineTree.childrenList
      emit('dataSet', res.dataSet)
    }
  }

  async function filterTimelineNodes(stage: number) {
    loading.value = true
    const res = await queryTimeLine(props.timelineId)
    loading.value = false
    timelineNodes.value = res.timeLineTree.childrenList.filter((item) => {
      return item.stage === stage
    })
  }

  // new add or delete node can be callback here
  function handleRefreshTimeTree() {
    getTimelineList()
    // 据WIKI BUG [ID1001202]描述当时间轴里没有行政处罚或其他关联程序时,左侧关联程序bar也应刷新
    emit('refreshProgramDetailHandler')
  }

  function handleNodeClick(node) {
    emit('nodeClick', node)
  }

  watch(
    () => props.timelineId,
    () => {
      if (props.timelineId) getTimelineList()
    }
  )

  defineExpose({
    getTimelineList,
    filterTimelineNodes
  })
</script>
<template>
  <n-spin :show="loading">
    <n-empty style="min-height: 200px" class="my-52 justify-center" v-if="timelineNodes?.length === 0" description="什么也找不到️" />
    <div class="timeline-box" v-for="node in timelineNodes" :key="node.id">
      <timeline-node :item-node="node" @handleRefreshTimeTree="handleRefreshTimeTree" @node-click="handleNodeClick" />
    </div>
  </n-spin>
</template>

<script setup lang="ts">
  import { queryTimeLine } from '@/api/program/program'
  import type { IItemNodeProps, ITimeLineTreeLeaf } from '@/api/program/types'
  import { stageBarEventKey, wasteDispatchEventKey } from '../bus-key'
  import ItemNode from './item-node.vue'

  const props = defineProps({
    timelineId: {
      type: String,
      default: '',
      required: true
    }
  })

  const emits = defineEmits(['nodeClick', 'dataSet'])

  const timelineNodes = ref<ITimeLineTreeLeaf[]>([])
  const widthArray = ref<IItemNodeProps[]>([])
  const containerEl = ref<HTMLElement>()
  const nodeEl = ref<any>()
  let eligibleIds = ref<string[]>([])

  const stageBarBus = useEventBus(stageBarEventKey)

  stageBarBus.on((stage: number) => {
    // stage ? filterTimelineNodes(stage) : getTimelineList()
  })

  // 当回收站恢复成功时 刷新时间轴树
  const refreshTimelineBus = useEventBus(wasteDispatchEventKey)
  refreshTimelineBus.on(async () => {
    await getTimelineList()
  })

  // get parent container size
  const { width: containerWidth } = useElementSize(containerEl)

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

  // get every item node width
  function handleItemInfo(itemInfo: IItemNodeProps) {
    widthArray.value.push(itemInfo)
    calcWidth()
  }

  // REVIEW
  function calcWidth() {
    eligibleIds.value.length = 0
    if (timelineNodes?.value?.length) {
      eligibleIds.value.push(timelineNodes.value![0].id)
    }
    let w = 0
    for (const item of widthArray.value) {
      w += item.width
      if (w > containerWidth.value) {
        w = item.width + item.leftDividerWidth!
        eligibleIds.value.push(item.id)
      }
    }
  }

  watchEffect(() => {
    // props.timelineId && getTimelineList()
  })

  watch(
    () => containerWidth.value,
    () => {
      calcWidth()
    }
  )

  // new add or delete node can be callback here
  function handleRefreshTimeTree() {
    getTimelineList()
  }

  function handleNodeClick(node) {
    emits('nodeClick', node)
  }

  defineExpose({
    getTimelineList
    // filterTimelineNodes
  })
</script>

<template>
  <n-card class="timeline" :bordered="false">
    <div ref="containerEl" class="container flex flex-wrap h-full">
      <item-node
        ref="nodeEl"
        v-for="node in timelineNodes"
        :key="node.id"
        :item-node="node"
        :ids="eligibleIds"
        @emitWidth="handleItemInfo"
        @handleRefreshTimeTree="handleRefreshTimeTree"
        @node-click="handleNodeClick"
        class="itemNodeId"
        :attribute="node.id"
        :data-flag="node.id"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { queryTimeLine } from '@/api/program/program'
  import type { IItemNodeProps, ITimeLineTreeLeaf } from '@/api/program/types'
  import ItemNode from './item-node.vue'

  const props = defineProps({
    timelineId: {
      type: String,
      default: '',
      required: true
    }
  })

  const timelineNodes = ref<ITimeLineTreeLeaf[]>()

  // 容器el
  const containerEl = ref<HTMLElement | null>(null)
  const nodeEl = ref<any>()
  let eligibleIds = ref<string[]>([])

  // get parent container size
  const { width: containerWidth } = useElementSize(containerEl)

  // get timeline tree
  async function getTimeLineList() {
    const { timeLineTree } = await queryTimeLine(props.timelineId)
    timelineNodes.value = timeLineTree.childrenList
  }

  const widthArray = ref<IItemNodeProps[]>([])

  // get every item node width
  function handleItemInfo(itemInfo: IItemNodeProps) {
    widthArray.value.push(itemInfo)
    calcWidth()
  }

  function calcWidth() {
    eligibleIds.value.length = 0
    if (timelineNodes?.value?.length) {
      eligibleIds.value.push(timelineNodes.value!.at(0)!.id)
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

  watchEffect(async () => {
    if (props.timelineId) {
      await getTimeLineList()
    }
  })

  // new add or delete node can be callback here
  function handleRefreshTimeTree() {
    getTimeLineList()
  }

  watch(
    () => containerWidth.value,
    () => {
      calcWidth()
    }
  )
</script>

<template>
  <!-- timeline -->
  <div ref="containerEl" class="container flex flex-wrap">
    <!-- list -->
    <item-node
      ref="nodeEl"
      :item-node="node"
      :ids="eligibleIds"
      @emitWidth="handleItemInfo"
      @handleRefreshTimeTree="handleRefreshTimeTree"
      class="itemNodeId"
      v-for="node in timelineNodes"
      :key="node.id"
      :attribute="node.id"
      :data-flag="node.id"
    />
  </div>
</template>

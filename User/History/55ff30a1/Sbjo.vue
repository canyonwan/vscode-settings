<script setup lang="ts">
  import { queryTimeLine } from '@/api/program/program'
  import type { IItemNodeProps, ITimeLineTreeLeaf } from '@/api/program/types'
  import ItemNode from './item-node.vue'

  const timelineNodes = ref<ITimeLineTreeLeaf[]>()

  const props = defineProps({
    timelineId: {
      type: String,
      default: '',
      required: true
    }
  })

  // 容器el
  const containerEl = ref<HTMLElement | null>(null)
  // let eligibleIds: string[] = []
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
    // console.log('handleItemInfo', widthArray.value)
    calcWidth()
  }

  function calcWidth() {
    eligibleIds.value.length = 0
    timelineNodes.value?.length > 0 && eligibleIds.value.push(timelineNodes.value!.at(0)!.id)
    let w = 0
    for (const item of widthArray.value) {
      w += item.width
      if (w > containerWidth.value) {
        w = item.width
        eligibleIds.value.push(item.id)
      }
    }
    console.log(eligibleIds.value)
  }

  watchEffect(async () => {
    if (props.timelineId) {
      await getTimeLineList()
      // eligibleIds.value.push(timelineNodes.value!.at(0)!.id)
    }
  })

  watch(
    () => containerWidth.value,
    () => {
      console.log('容器大小变化', containerWidth.value)

      calcWidth()
    }
  )
</script>

<template>
  <!-- timeline -->
  <div ref="containerEl" class="container flex flex-wrap">
    <!-- list -->
    <item-node :item-node="node" :ids="eligibleIds" @emitWidth="handleItemInfo" class="itemNodeId" v-for="node in timelineNodes" :key="node.id" :attribute="node.id" :data-flag="node.id" />
  </div>
</template>

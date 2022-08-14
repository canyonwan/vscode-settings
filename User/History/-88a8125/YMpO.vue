<script setup lang="ts">
  import { deleteTimelineNode } from '@/api/program/program'
  import { ITimeLineTreeLeaf } from '@/api/program/types'

  const props = defineProps({
    children: {
      type: Array as PropType<Array<ITimeLineTreeLeaf>>,
      default: () => []
    }
  })

  async function onDelete(id: string) {
    await deleteTimelineNode({
      deleteType: 0,
      timeLineIdList: [id]
    })
  }
</script>
<template>
  <n-list>
    <n-list-item v-for="item in props.children" :key="item.id">
      {{ item.title }}
      <template #suffix>
        <!-- <n-button type="error" ghost @click="onDelete(item.id)">删除</n-button> -->
        <n-popconfirm @positive-click="handlePositiveClick" @negative-click="handleNegativeClick">
          <template #trigger>
            <n-button>引用</n-button>
          </template>
          一切都将一去杳然，任何人都无法将其捕获。
        </n-popconfirm>
      </template>
    </n-list-item>
  </n-list>
</template>

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
        <n-popconfirm @negative-click="onDelete(item.id)">
          <template #trigger>
            <n-button>删除</n-button>
          </template>
          您确定要删除该项吗
        </n-popconfirm>
      </template>
    </n-list-item>
  </n-list>
</template>

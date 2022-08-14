<script setup lang="ts">
  import { ITimeLineTreeLeaf } from '@/api/program/types'

  const props = defineProps({
    children: {
      type: Array as PropType<Array<ITimeLineTreeLeaf>>,
      default: () => []
    }
  })
</script>
<template>
  <n-list>
    <n-list-item v-for="item in props.children" :key="item.id">
      {{ item.title }}
      <template #suffix>
        <n-button type="error" ghost>删除</n-button>
      </template>
    </n-list-item>
  </n-list>
</template>

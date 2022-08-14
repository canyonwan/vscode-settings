<script setup lang="ts">
  import { CheckmarkCircle } from '@vicons/ionicons5'
  import { nodeStatus } from './map-options'
  import type { ITimeLineTreeLeaf } from '@/api/program/types'

  const props = defineProps({
    nodeChildren: {
      type: Array as PropType<ITimeLineTreeLeaf[]>,
      default: () => []
    }
  })
</script>
<template>
  <n-space vertical v-for="(node, index) in props.nodeChildren" :key="node.id" class="ml-4">
    <n-space align="center">
      <div class="leading-10 px-4 text-center align-middle text-white cursor-pointer bg-e-button-bg bg-no-repeat bg-full">{{ node.title }}</div>
      <img v-if="!(index === props.nodeChildren.length - 1)" src="@/assets/icons/right-arrow-icon.svg" />
    </n-space>
    <!-- 节点状态 -->
    <div class="text-base">
      <n-icon :component="CheckmarkCircle" />
      {{ nodeStatus.get(node.nodeStatus) }}
    </div>
    <!-- 描述 -->
    <!-- <div>{{ node.description }}</div> -->
    <div class="text-gray-500 text-sm">我是一段描述</div>
    <!-- 文件 -->
    <div v-for="file in node?.fileList" :key="file.fileId" class="ml-5 w-16 py-2">
      <!-- img -->
      <div v-if="file.fileType === 1" class="bg-dark-50">
        <img v-if="file.fileType === 1" :src="file.fileUrl" alt="placeholder" />
      </div>
      <!-- video -->
      <div v-else-if="file.fileType === 5" class="bg-dark-50">
        <video :src="file.fileUrl"></video>
      </div>
    </div>
    <div v-if="node.childrenList?.length > 0">
      <case-node :node-children="node.childrenList" />
    </div>
  </n-space>
</template>

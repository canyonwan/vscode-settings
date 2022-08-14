<script setup lang="ts">
  import { CheckmarkCircle } from '@vicons/ionicons5'
  import { nodeStatus } from './map-options'
  import type { ITimeLineTreeLeaf } from '@/api/program/types'
  import { useDialog, useMessage } from 'naive-ui'
  const message = useMessage()
  const dialog = useDialog()

  const props = defineProps({
    nodeChildren: {
      type: Array as PropType<ITimeLineTreeLeaf[]>,
      default: () => []
    }
  })
  const dropdownMenuOptions = [
    {
      label: '添加同级节点',
      key: 'add-same'
    },
    {
      label: '添加子级节点',
      key: 'add-child'
    },
    {
      label: '删除节点',
      key: 'delete'
    }
  ]

  // 节点操作
  function handleSelect(key: string) {
    message.info(key)
  }

  // 节点删除
  function handleConfirm() {
    dialog.warning({
      title: '警告',
      content: '你确定？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
        message.success('确定')
      },
      onNegativeClick: () => {
        message.error('不确定')
      }
    })
  }
</script>
<template>
  <n-space vertical v-for="(node, index) in props.nodeChildren" :key="node.id" class="ml-4">
    <n-space align="center">
      <!-- 按钮 -->
      <n-dropdown trigger="click" :options="dropdownMenuOptions" :show-arrow="true" @select="handleSelect">
        <div class="leading-10 px-4 text-center align-middle text-white cursor-pointer bg-e-button-bg bg-no-repeat bg-full">{{ node.title }}</div>
      </n-dropdown>
      <img v-if="!(index === props.nodeChildren.length - 1)" src="@/assets/icons/right-arrow-icon.svg" />
    </n-space>
    <!-- 节点状态 -->
    <div class="text-base">
      <n-icon :component="CheckmarkCircle" />
      {{ nodeStatus.get(node.nodeStatus) }}
    </div>
    <!-- 描述 -->
    <!-- <div>{{ node.description }}</div> -->
    <div class="ml-5 text-gray-500 text-sm">我是一段描述</div>
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

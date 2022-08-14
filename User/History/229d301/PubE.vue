<script setup lang="ts">
  import type { IDeletedNodeItem } from '@/api/program/types'
  import { Ref } from 'vue'
  import { format } from 'date-fns'
  interface IState {
    nodes: number[]
  }
  const injectNodeRubbish = inject<Ref<IDeletedNodeItem[]>>('provideRubbish')
  const state = reactive<IState>({
    nodes: []
  })

  const emits = defineEmits(['handleUpdateValue'])

  function onUpdateValue(values: number[]) {
    console.log('node', values)
    emits('handleUpdateValue', values)
  }
</script>
<template>
  <div>
    <n-checkbox-group @update:value="onUpdateValue">
      <n-space vertical>
        <n-checkbox v-for="node in injectNodeRubbish" :key="node.nodeId" :value="node.nodeId">
          <n-card>
            <div class="font-medium text-base">{{ node.nodeName }}</div>
            <!-- media -->
            <div class="py-3">
              <media-preview :values="node.nodeFile" />
            </div>
            <n-space justify="space-around" class="text-gray-500 text-xs">
              <div>删除时间：{{ format(node?.deleteTime, 'yyyy-MM-dd') }}</div>
              <div>操作人：{{ node.operationName }}</div>
            </n-space>
          </n-card>
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
  </div>
</template>

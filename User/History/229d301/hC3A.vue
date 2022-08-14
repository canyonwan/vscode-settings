<script setup lang="ts">
  import type { IDeletedNodeItem } from '@/api/program/types'
  import type { Ref } from 'vue'
  import { format } from 'date-fns'

  const injectNodeRubbish = inject<Ref<IDeletedNodeItem[]>>('provideRubbish')
  const injectCheckedChildren = inject<Ref<number[]>>('provideCheckedChildren')
  console.log('%c [ injectCheckedChildren ]-8', 'font-size:13px; background:pink; color:#bf2c9f;', injectCheckedChildren)

  const emits = defineEmits(['handleUpdateValue'])

  function onUpdateValue(values: number[]) {
    injectCheckedChildren!.value = values
    emits('handleUpdateValue', values)
  }
</script>
<template>
  <div>
    <n-checkbox-group :value="injectCheckedChildren" @update:value="onUpdateValue">
      <n-space vertical v-if="injectNodeRubbish">
        <n-checkbox v-for="node in injectNodeRubbish" :key="node.recyclingId" :value="node.recyclingId">
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

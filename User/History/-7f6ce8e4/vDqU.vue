<script setup lang="ts">
  import type { IDeletedEvidence } from '@/api/program/types'
  import { Ref } from 'vue'
  import { format } from 'date-fns'

  const injectNodeRubbish = inject<Ref<IDeletedEvidence[]>>('provideRubbish')
  const injectCheckedChildren = inject<Ref<number[]>>('provideCheckedChildren')

  const emits = defineEmits(['handleUpdateValue'])

  function onUpdateValue(values: number[]) {
    injectCheckedChildren!.value = values
    emits('handleUpdateValue', values)
  }
</script>
<template>
  <n-checkbox-group @update:value="onUpdateValue" :value="injectCheckedChildren">
    <n-space vertical>
      <n-checkbox v-for="node in injectNodeRubbish" :key="node.recyclingId" :value="node.recyclingId">
        <n-card>
          <div class="font-medium text-base mb-2">{{ node.evidenceName }}</div>
          <!-- media -->
          <div class="py-3">
            <media-preview :values="node.evidenceFiles" />
          </div>
          <n-space justify="space-between" class="text-gray-500 text-xs">
            <div>删除时间：{{ format(node?.deleteTime, 'yyyy-MM-dd') }}</div>
            <div>操作人：{{ node.operationName }}</div>
          </n-space>
        </n-card>
      </n-checkbox>
    </n-space>
  </n-checkbox-group>
</template>

<script setup lang="ts">
  import { format } from 'date-fns'
  import type { IDeletedIllegalAct } from '@/api/program/types'
  import type { Ref } from 'vue'

  const injectNodeRubbish = inject<Ref<IDeletedIllegalAct[]>>('provideRubbish')
  const injectCheckedChildren = inject<Ref<string[]>>('provideCheckedChildren')

  const emits = defineEmits(['handleUpdateValue'])

  function onUpdateValue(idStr: string[]) {
    injectCheckedChildren!.value = idStr
    emits('handleUpdateValue', idStr)
  }
</script>
<template>
  <n-checkbox-group :value="injectCheckedChildren" @update:value="onUpdateValue">
    <n-space vertical>
      <n-checkbox v-for="node in injectNodeRubbish" :key="`${node.causeId}&${node.caseTypeId}&${node.recyclingId}`" :value="`${node.causeId}&${node.caseTypeId}&${node.recyclingId}`">
        <!-- <n-checkbox v-for="node in injectNodeRubbish" :key="node.causeId" :value="node.causeId"> -->
        <n-card>
          <div class="font-medium text-base mb-2">{{ node.causeName }}（{{ node.caseType }}）</div>
          <n-space justify="space-between" class="text-gray-500 text-xs">
            <div>删除时间：{{ format(node?.deleteTime, 'yyyy-MM-dd') }}</div>
            <div>操作人：{{ node.operationName }}</div>
          </n-space>
        </n-card>
      </n-checkbox>
    </n-space>
  </n-checkbox-group>
</template>

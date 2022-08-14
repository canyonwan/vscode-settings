<script setup lang="ts">
  import { format } from 'date-fns'
  import type { IDeletedIllegalAct } from '@/api/program/types'
  import type { Ref } from 'vue'

  const injectNodeRubbish = inject<Ref<IDeletedIllegalAct[]>>('provideRubbish')
  const injectCheckedChildren = inject<Ref<string[]>>('provideCheckedChildren')

  const emits = defineEmits(['handleUpdateValue'])

  function onUpdateValue(causeIds: string[]) {
    injectCheckedChildren!.value = causeIds
    const causeContainer: { causeId: string; caseTypeId: string }[] = []
    for (const ele of injectNodeRubbish!.value) {
      let res = causeIds.find((id) => id === ele.causeId)
      if (res) {
        causeContainer.push({
          causeId: res,
          caseTypeId: ele.punishId
        })
      }
    }
    emits('handleUpdateValue', causeIds, causeContainer)
  }
</script>
<template>
  <n-checkbox-group :value="injectCheckedChildren" @update:value="onUpdateValue">
    <n-space vertical>
      <n-checkbox v-for="node in injectNodeRubbish" :key="node.causeId" :value="node.causeId">
        <n-card>
          <div class="font-medium text-base">{{ node.causeName }}</div>
          <n-space justify="space-around" class="text-gray-500 text-xs">
            <div>删除时间：{{ format(node?.deleteTime, 'yyyy-MM-dd') }}</div>
            <div>操作人：{{ node.operationName }}</div>
          </n-space>
        </n-card>
      </n-checkbox>
    </n-space>
  </n-checkbox-group>
</template>

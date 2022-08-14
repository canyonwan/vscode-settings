<script setup lang="ts">
  import type { IDeletedIllegalAct } from '@/api/program/types'
  import { Ref } from 'vue'
  import { format } from 'date-fns'

  // { causeId: string; caseTypeId: string }

  const injectNodeRubbish = inject<Ref<IDeletedIllegalAct[]>>('provideRubbish')
  const injectCheckedChildren = inject<Ref<string[]>>('provideCheckedChildren')

  const emits = defineEmits(['handleUpdateValue'])

  function onUpdateValue(causeIds: string[]) {
    injectCheckedChildren!.value = causeIds
    // let punishIds = injectNodeRubbish?.value.map((item) => {
    //   for (const causeId of causeIds) {
    //     if (causeId === item.causeId) {
    //       return {
    //         causeId: item.causeId,
    //         caseTypeId: item.punishId
    //       }
    //     }
    //     // else console.log('else');
    //   }
    // })
    const container =  { causeId: string; caseTypeId: string }[]
    for (const ele of injectNodeRubbish!.value) {
      let res = causeIds.filter((id) => id === ele.causeId)
      console.log('res', res)
      if (res.length > 0) {

      }
    }
    // console.log('update value causeIds', causeIds)
    // console.log('update value causeIds', punishIds)

    emits('handleUpdateValue', causeIds, punishIds)
  }

  onMounted(() => {
    console.log('illegal act', injectNodeRubbish?.value)
  })

  // 从injectNodeRubbish遍历拿到和选中的punishId一样的causeId
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

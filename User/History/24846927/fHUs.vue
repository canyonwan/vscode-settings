<script setup lang="ts">
  import { queryCauseListForProgram, deleteCause } from '@/api/program/program'
  import type { ICauseItemForProgram } from '@/api/program/types'
  import { useDialog } from 'naive-ui'

  const props = defineProps<{ programId: string }>()
  const dialog = useDialog()

  const list = ref<ICauseItemForProgram[]>([])

  async function getCauseListForTimeline() {
    list.value = await queryCauseListForProgram({ proceduresId: props.programId })
  }

  function deleteCurrentCause(caseTypeId: number, causeId: string, e: MouseEvent) {
    e.stopPropagation()
    const params = {
      causeList: [{ caseTypeId, causeId }],
      proceduresId: props.programId
    }
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteCause(params)
      }
    })
  }

  getCauseListForTimeline()
</script>
<template>
  <n-card v-for="i in list" :key="i.caseType" class="py-2">
    <div class="py-2 text-gray-400">{{ i.caseTypeName }} </div>
    <n-collapse class="pl-4" default-expanded-names="1" accordion arrow-placement="right">
      <n-collapse-item v-for="e in i.causeList" :key="e.id" :title="e.name" :name="e.id">
        <div class="pl-4 py-1" v-for="tip in e.tipList" :key="tip.title">
          <span>{{ tip.title }}</span>
          <n-ellipsis style="max-width: 200px">
            {{ tip.content }}
          </n-ellipsis>
        </div>
        <template #header-extra>
          <n-button type="error" @click="(evt: MouseEvent) => deleteCurrentCause(i.caseType, e.id, evt)" text>删除</n-button>
        </template>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup lang="ts">
  import { queryCauseListForProgram } from '@/api/program/program'
  import type { ICauseItemForProgram } from '@/api/program/types'

  const props = defineProps<{ programId: string }>()

  const list = ref<ICauseItemForProgram[]>([])

  async function getCauseListForTimeline() {
    const res = await queryCauseListForProgram({ proceduresId: props.programId })
    list.value = res
  }

  getCauseListForTimeline()
</script>
<template>
  <div v-for="i in list" :key="i.caseType" class="py-2">
    <div class="py-2">{{ i.caseTypeName }} </div>
    <n-collapse class="pl-4" default-expanded-names="1" accordion arrow-placement="right">
      <n-collapse-item v-for="e in i.causeList" :key="e.id" :title="e.name" :name="e.id">
        <div class="pl-4" v-for="tip in e.tipList" :key="tip.title">
          <span>{{ tip.title }}</span>
          <span>{{ tip.content }}</span>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
  import { queryTaskBaseInfo, queryTaskTimeline } from '@/api/workflow/cause'
  import type { ITaskBaseInfo, ITaskTimeline } from '@/api/workflow/types'
  import { taskStatusOptions } from '@/views/tool-group/components/relate-task-options'

  const taskBaseInfo = ref<ITaskBaseInfo>()
  const taskTimelineList = ref<ITaskTimeline[]>([])

  const props = defineProps<{ dataId: string }>()

  async function getTaskBaseInfo() {
    const res = await queryTaskBaseInfo(props.dataId)
    taskBaseInfo.value = res
  }

  async function getTaskTimeline() {
    const res = await queryTaskTimeline(props.dataId)
    taskTimelineList.value = res.workResultOutputList
  }

  onMounted(() => {
    getTaskBaseInfo()
    getTaskTimeline()
  })
</script>
<template>
  <div class="task-detail">
    <n-card>
      <div class="flex">
        <div class="text-lg font-bold">{{ taskBaseInfo?.title ?? '' }}</div>
        <n-tag type="success" size="small">{{ taskBaseInfo && taskBaseInfo.phase ?? taskStatusOptions[taskBaseInfo!.phase - 1]['label'] }}</n-tag>
      </div>
      <div>{{ taskBaseInfo?.content ?? '无' }}</div>
      <!-- 文件 -->
      <media-preview class="ml-4" v-show="taskBaseInfo?.fileList?.length > 0" :values="taskBaseInfo?.fileList" />
      <div>办理期限: {{ `${taskBaseInfo?.startTime}-${taskBaseInfo?.deadline}` }}</div>
    </n-card>

    <n-card class="mt-4">
      <!-- <div v-for="item in taskTimelineList" :key="item.id">{{ item.title }}</div> -->
      <n-timeline>
        <n-timeline-item line-type="dashed" :type="item.status === 1 ? 'success' : 'primary'" v-for="item in taskTimelineList" :key="item.id">
          <template #header>
            <div class="flex">
              <div>{{ item.title ?? '123' }}</div>
              <div>{{ item.createTime }}</div>
            </div>
          </template>
          <template #footer>
            <div class="flex">
              <div class="mr-4" v-for="o in item.operationList" :key="o.operationId"> {{ o.operationTypeName }} : {{ o.operator }}</div>
            </div>
          </template>
        </n-timeline-item>
      </n-timeline>
    </n-card>
  </div>
</template>

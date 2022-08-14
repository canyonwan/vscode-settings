<script setup lang="ts">
  import { queryTaskBaseInfo, queryTaskTimeline } from '@/api/workflow/cause'
  import type { ITaskBaseInfo, ITaskTimeline } from '@/api/workflow/types'
  import { format } from 'date-fns'
  import { taskStatusOptions } from '@/views/tool-group/components/relate-task-options'

  const taskBaseInfo = ref<ITaskBaseInfo>()
  const taskTimelineList = ref<ITaskTimeline[]>([])

  const props = defineProps<{ dataId: string }>()

  async function getTaskBaseInfo() {
    taskBaseInfo.value = await queryTaskBaseInfo(props.dataId)
    // taskBaseInfo.value = res
  }

  async function getTaskTimeline() {
    const res = await queryTaskTimeline(props.dataId)
    taskTimelineList.value = res.workResultOutputList
  }

  onBeforeMount(() => {
    getTaskBaseInfo()
    getTaskTimeline()
  })
</script>
<template>
  <div class="task-detail">
    <n-card>
      <div class="flex items-center">
        <div class="text-lg font-bold mr-2">{{ taskBaseInfo?.title ?? '' }}</div>
        <n-tag type="success" size="small">{{ taskBaseInfo && taskBaseInfo.phase ? taskStatusOptions[taskBaseInfo!.phase - 1]['label'] : '' }}</n-tag>
      </div>
      <div class="my-4">{{ taskBaseInfo?.content ?? '无' }}</div>
      <!-- 文件 -->
      <media-preview class="ml-4" v-if="taskBaseInfo?.fileList?.length > 0" :values="taskBaseInfo?.fileList" />
      <div>办理期限：{{ `${format(taskBaseInfo?.startTime, 'yyyy-MM-dd')}-${format(taskBaseInfo?.deadline, 'yyyy-MM-dd')}` }}</div>
    </n-card>

    <n-card class="mt-4">
      <!-- <div v-for="item in taskTimelineList" :key="item.id">{{ item.title }}</div> -->
      <n-timeline>
        <n-timeline-item line-type="dashed" v-for="item in taskTimelineList" :key="item.id" :type="item.status === 1 ? 'success' : 'error'">
          <template #header>
            <div class="flex">
              <div>{{ item.title ?? '123' }}</div>
              <div class="pl-4">{{ format(item.createTime, 'yyyy-MM-dd') }}</div>
            </div
          </template>
          <template #footer>
            <div class="flex">
              <div class="mr-4" v-for="o in item.operationList" :key="o.operationId"> {{ o.operationTypeName }}：{{ o.operator }}</div>
            </div>
          </template>
        </n-timeline-item>
      </n-timeline>
    </n-card>
  </div>
</template>

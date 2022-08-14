<script setup lang="ts">
  import { relateProgramOrTask, queryTaskList, IRelateProgramOrTask } from '@/api/workflow/cause'
  import { options, sponsorOptions, createColumns, type ITaskSources } from './relate-task-options'
  import type { ITaskItem } from '@/api/workflow/types'
  import type { ICaseConnectInfo } from '@/api/time-line/types'
  import { queryEnums } from '@/api/workflow/model-manage'
  import { handleEnumsKeys } from '@/hooks/enums-keys'
  const props = defineProps({
    caseInfo: {
      type: Object as PropType<ICaseConnectInfo>,
      default: () => {}
    }
  })

  const emit = defineEmits(['submit-handler'])

  interface ISearch {
    taskStage: number
    sponsor: number
  }

  interface ISources {
    taskSources: ITaskSources[] // 任务来源
    taskStageEnums: SelectOption[] // 任务阶段
    sponsorEnums: SelectOption[] // 是否我发起的
  }

  const sources: ISources = reactive({
    taskSources: [],
    taskStageEnums: [],
    sponsorEnums: []
  })

  const tableRef = ref()
  const chooseTask = ref<Partial<ITaskItem>>({})

  const searchParams: ISearch = reactive({
    taskStage: 1,
    sponsor: 1
  })

  const reloadTable = (param = {}) => {
    tableRef.value.reload(param)
  }

  async function getTaskList(page: any) {
    return await queryTaskList({ ...page, phaseTypeCode: searchParams.taskStage, asInitiator: searchParams.sponsor === 1, associatedTask: true })
  }

  function updateCheckRowKeys(_: string[], rows: ITaskItem[]) {
    chooseTask.value = rows[0]
  }

  async function getTaskStageEnums() {
    // taskStage.value = await handleEnumsKeys(['TaskStatus'])
  }

  async function getEnums() {
    const res = await queryEnums({ columnNameList: ['TaskType', 'TaskStatus'] })
    for (const item of res) {
      if (item.pojoEntityName === 'TaskStatus') {
        // taskStage.push(item)
      } else {
        taskStage.push(item)
      }
    }
  }

  getEnums()
  getTaskStageEnums()

  async function onRelateTask() {
    let params: IRelateProgramOrTask = {
      dataId: props.caseInfo.dataId,
      dataType: props.caseInfo.dataType,
      targetType: chooseTask.value!.taskTypeId!,
      targetId: chooseTask.value!.id!,
      timeLineId: props.caseInfo.timeLineId,
      toolId: props.caseInfo.toolId,
      toolGroup: props.caseInfo.toolGroup
    }
    await relateProgramOrTask(params)
    emit('submit-handler')
  }
</script>
<template>
  <div class="relate-task">
    <n-space>
      <n-select style="width: 180px" v-model:value="searchParams.taskStage" :options="taskStage" />
      <n-select style="width: 180px" v-model:value="searchParams.sponsor" :options="sponsorOptions" />
      <n-button type="primary" size="medium" @click="reloadTable">搜索</n-button>
    </n-space>

    <BasicTable
      :request="getTaskList"
      ref="tableRef"
      :row-key="(row: ITaskItem) => row.id"
      :columns="createColumns({ taskSources })"
      :action-column="null"
      @update:checked-row-keys="updateCheckRowKeys"
    />

    <n-button type="primary" size="medium" @click="onRelateTask" class="float-right mt-4" :disabled="Object.keys(chooseTask).length === 0">确定</n-button>
  </div>
</template>

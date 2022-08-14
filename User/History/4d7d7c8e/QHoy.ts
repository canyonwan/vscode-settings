import { ITaskItem } from '@/api/workflow/types'
import { format } from 'date-fns'
import { DataTableColumns } from 'naive-ui'
import { RowData } from 'naive-ui/lib/data-table/src/interface'

export interface ITaskSources {
  serviceName: string
  enumClassName: string
  pojoEntityName: string
  enumCode: number
  enumDescription: string
  enumChineseDescription: string
}

export const createColumns = ({ taskSources }: { taskSources: ITaskSources[] }): DataTableColumns<RowData> => {
  return [
    {
      type: 'selection',
      multiple: false
    },
    {
      title: 'ID',
      key: 'id',
      width: 70
    },
    {
      title: '标题',
      key: 'title',
      width: 150
    },
    {
      title: '任务来源',
      key: 'taskType',
      width: 150,
      render: (rowData: ITaskItem) => {
        console.log('%c [ taskSources ]-16', 'font-size:13px; background:#0095FF; color:white;', taskSources)
        // return taskSources.filter((t) => rowData.taskType === t.enumDescription)[0].enumChineseDescription
      }
    },
    {
      title: '日期',
      key: 'timeByPhase',
      width: 120,
      render: (rowData: ITaskItem) => {
        return rowData.timeByPhase ? format(rowData.timeByPhase, 'yyyy-MM-dd') : '无'
      }
    }
  ]
}

export const options = [
  {
    label: '已发布',
    value: 1
  },
  {
    label: '已接收',
    value: 2
  },
  {
    label: '办理中',
    value: 3
  },
  {
    label: '已反馈',
    value: 4
  }
]

// 发起
export const sponsorOptions = [
  {
    label: '我发起的',
    value: 1
  }
  // {
  //   label: '交给我的',
  //   value: 0
  // }
]

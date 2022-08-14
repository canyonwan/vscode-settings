import { ITaskItem } from '@/api/workflow/types'
import { format } from 'date-fns'

export const columns = [
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
    title: '内容',
    key: 'content',
    width: 120
  },
  {
    title: '日期',
    key: 'timeByPhase',
    width: 120,
    render: (rowData: ITaskItem) => {
      return rowData.timeByPhase ? format(rowData.timeByPhase, 'yyyy-MM-dd') : '无'
    }
  },
  {
    title: '我发起的',
    key: 'asInitiator',
    width: 120,
    render(row: ITaskItem) {
      return row.asInitiator ? '是' : '否'
    }
  }
]

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

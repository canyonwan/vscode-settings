import type { IMessageItem } from '@/api/infrom/types'
import { format } from 'date-fns'
import { DataTableColumn } from 'naive-ui'

export const messageColumn = [
  {
    title: 'ID',
    key: 'newsId',
    width: 60
  },
  {
    title: '标题',
    key: 'title',
    width: 120
  },
  {
    title: '内容',
    key: 'content',
    width: 180
  },
  {
    title: '发送人',
    key: 'sendUserName',
    width: 180
  },
  {
    title: '关联类型名',
    key: 'relationTypeName',
    width: 180
  },
  {
    title: '是否已读',
    key: 'whetherRead',
    width: 180,
    render: (row: IMessageItem) => {
      return !row.whetherRead || row.whetherRead === 0 ? '未读' : '已读'
    }
  },
  {
    title: '发送时间',
    key: 'createTime',
    width: 180,
    render: (rowData: IMessageItem) => {
      return rowData.createTime ? format(rowData.createTime, 'yyyy-MM-dd') : ''
    }
  }
] as DataTableColumn[]

import type { IMessageItem } from '@/api/infrom/types'
import { format } from 'date-fns'
import { DataTableColumn } from 'naive-ui'

export const announcementColumn = [
  {
    type: 'selection',
    width: 20
  },
  {
    title: 'ID',
    key: 'id',
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
    render: (row: IMessageItem) => {
      return row.createTime ? format(row.createTime, 'yyyy-MM-dd') : ''
    }
  }
] as DataTableColumn[]

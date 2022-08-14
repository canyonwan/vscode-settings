import { DataTableColumn } from 'naive-ui'

export const column: DataTableColumn[] = [
  {
    title: '消息ID',
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
    width: 180
  },
  {
    title: '发送时间',
    key: 'createTime',
    width: 180,
    render: (rowData: IMessageItem) => {
      return rowData.createTime ? format(rowData.createTime, 'yyyy-MM-dd') : ''
    }
  }
]

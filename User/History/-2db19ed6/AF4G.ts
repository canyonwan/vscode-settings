// 发件箱 & 收件箱
import dayjs from 'dayjs'
// 发件箱
const outBoxColumns = [
  {
    title: '消息主题',
    dataIndex: 'subject'
  },
  {
    title: '发布单位',
    dataIndex: 'orgName',
    width: 150
  },
  {
    title: '发布日期',
    dataIndex: 'sentTime',
    width: 120,
    customCell: (record: any): any => {
      return {
        innerHTML: record.sentTime ? dayjs(record.sentTime).format('YYYY-MM-DD') : ''
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 90,
    fixed: 'right'
  }
]

// 草稿箱
const draftBoxColumns = [
  {
    title: '消息主题',
    dataIndex: 'subject'
  },
  {
    title: '暂存日期',
    dataIndex: 'modifyTime',
    width: 120,
    customCell: (record: any): any => {
      return {
        innerHTML: record.modifyTime ? dayjs(record.modifyTime).format('YYYY-MM-DD') : ''
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 90,
    fixed: 'right'
  }
]

const tabList = [
  {
    name: '发件箱',
    key: '1'
  },
  {
    name: '收件箱',
    key: '2'
  },
  {
    name: '草稿箱',
    key: '3'
  }
]
export { outBoxColumns, draftBoxColumns, tabList }

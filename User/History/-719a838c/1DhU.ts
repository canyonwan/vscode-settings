import { format } from 'date-fns'
import { DataTableColumn } from 'naive-ui'

// 检查
export const goodsColumns = [
  {
    title: '序号',
    key: 'id',
    width: 60
  },
  {
    title: '检查时间',
    key: 'createTime',
    width: 140,
    render: (rowData: any) => {
      return rowData.createTime ? format(rowData.createTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '检查地址',
    key: 'address',
    width: 100
  },
  {
    title: '检查对象',
    key: 'targetName',
    width: 100
  },
  {
    title: '对象类型',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '任务来源',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '执法人员',
    key: 'userNameList',
    width: 100
  },
  {
    title: '执法证号',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '检查事项',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '是否产生案件',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '记录方式',
    key: 'whetherGroupType',
    width: 100
  }
] as DataTableColumn[]

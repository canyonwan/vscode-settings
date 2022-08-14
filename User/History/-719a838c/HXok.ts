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
    title: '名称',
    key: 'name',
    width: 140,
    render: (rowData: any) => {
      return rowData.createTime ? format(rowData.createTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '简介',
    key: 'summary',
    width: 100
  },
  {
    title: '物流',
    key: 'transport',
    width: 100
  },
  {
    title: '库存',
    key: 'meteringValue',
    width: 100
  },
  {
    title: '原价格',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '当前价格',
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

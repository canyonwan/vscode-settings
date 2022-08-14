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
    width: 140
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
    key: '',
    width: 100
  },
  {
    title: '当前价格',
    key: 'unitPrice',
    width: 100
  },
  {
    title: '售前电话',
    key: 'beforePhone',
    width: 100
  },
  {
    title: '售后电话',
    key: 'afterPhone',
    width: 100
  }
] as DataTableColumn[]

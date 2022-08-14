import { DataTableColumn } from 'naive-ui'

export const tableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '裁量类型',
    key: 'discretionTypeName',
    width: 120
  },
  {
    title: '裁量计算方式',
    key: 'discretionCalculationName',
    width: 120
  },
  {
    title: '证据类型',
    key: 'relaEvidenceTypeName',
    width: 120
  },
  {
    title: '基准名称',
    key: 'baseKey',
    width: 120
  },
  {
    title: '基准值',
    key: 'baseValue',
    width: 80
  },
  {
    title: '最小值',
    key: 'minValue',
    width: 80
  },
  {
    title: '最大值',
    key: 'maxValue',
    width: 80
  },
  {
    title: '金额比例或金额倍数时使用的最小值',
    key: 'limitMin',
    width: 120
  },
  {
    title: '金额比例或金额倍数时使用的最大值',
    key: 'limitMax',
    width: 120
  },
  {
    title: '提示语',
    key: 'tips',
    width: 120
  },
  {
    title: '备注',
    key: 'remarks',
    width: 120
  }
] as DataTableColumn[]

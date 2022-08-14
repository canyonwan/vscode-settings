// 字典维护列表Options

import { format } from 'date-fns'

export const tableColumns = [
  {
    title: 'id',
    key: 'id',
    width: 100
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    editComponent: 'NSwitch',
    editValueMap: (value) => {
      return value ? '启用' : '删除'
    }
  },
  {
    title: '类型',
    key: 'type',
    width: 160,
    editComponent: 'NInput',
    componentProps: {
      placeholder: '请输入类型值',
      showButton: false,
      onInput: (e: any) => {
        return e
      }
    }
  },
  {
    title: '备注',
    key: 'remarks',
    width: 160,
    editComponent: 'NInput'
  },
  {
    title: '显示值',
    key: 'displayValue',
    width: 100,
    editComponent: 'NInput'
  },
  {
    title: '隐藏值',
    key: 'hiddenValue',
    width: 100,
    editComponent: 'NInput',
    editComponentProps: {
      placeholder: '请输入',
      showButton: false
    }
  },
  {
    title: '创建日期',
    key: 'createTime',
    width: 240,
    ellipsis: false,
    render: (rowData) => {
      return format(rowData.createTime, 'yyyy-MM-dd hh:mm:ss')
    }
  }
]

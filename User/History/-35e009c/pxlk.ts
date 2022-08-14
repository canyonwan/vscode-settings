import { format } from 'date-fns'
import { FormSchema } from '@/components/form'
import { DataTableColumn } from 'naive-ui'

export const tableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 100
  },
  {
    title: '法名称',
    key: 'lawName',
    width: 100
  },
  {
    title: '法类型',
    key: 'lawTypeName',
    width: 100
  },
  {
    title: '绑定地区',
    key: 'regionBindingName',
    width: 100
  },
  {
    title: '发布时间',
    key: 'releaseTime',
    width: 120,
    render: (rowData) => {
      return rowData.releaseTime ? format(rowData.releaseTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '发布机构',
    key: 'releaseDepartment',
    width: 100
  },
  {
    title: '生效日期',
    key: 'becomesEffectiveTime',
    width: 100,
    render: (rowData) => {
      return rowData.becomesEffectiveTime ? format(rowData.becomesEffectiveTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '执行日期',
    key: 'executeTime',
    width: 100,
    render: (rowData) => {
      return rowData.executeTime ? format(rowData.executeTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '不予处罚提示',
    key: 'noPunishmentTips',
    width: 140
  }
] as DataTableColumn[]

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'lawName',
    component: 'NInput',
    label: '法名',
    componentProps: {
      placeholder: '请输入法名'
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'lawTypeId',
    label: '法类型',
    slot: 'lawTypeIdSlot'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'lawTagList',
    label: '法标签',
    slot: 'lawTagSlot'
  }
]

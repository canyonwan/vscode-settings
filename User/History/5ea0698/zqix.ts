import { IEvidenceMenuType, IGroupItemType } from '@/api/cause-manage/types'
import { FormSchema } from '@/components/form'
import { DataTableColumn, NButton, NTag } from 'naive-ui'

export const tableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 100
  },
  {
    title: '名称',
    key: 'name',
    width: 200
  },
  {
    title: '备注',
    key: 'remarks',
    width: 200
  }
] as DataTableColumn[]

//  编辑证据
export const saveEvidenceSchemas: FormSchema[] = [
  {
    defaultValue: null,
    field: 'name',
    component: 'NInput',
    label: '证据名称',
    giProps: {},
    componentProps: {},
    rules: [{ required: true, message: '请输入证据名称', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    field: 'provMatters',
    component: 'NInput',
    label: '证明事项',
    giProps: {},
    rules: [{ required: true, message: '请输入证明事项', trigger: ['blur'] }],
    componentProps: {}
  },
  {
    field: 'relaEvidenceType',
    label: '证据类型',
    giProps: {},
    defaultValue: null,
    slot: 'evidenceTypeSlots',
    componentProps: {}
  },
  {
    field: 'whetherRequire',
    component: 'NSelect',
    label: '是否必填',
    giProps: {},
    defaultValue: 0,
    componentProps: {
      placeholder: '请输入是否必填',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    field: 'whetherGroup',
    component: 'NSelect',
    label: '是否分组',
    giProps: {},
    defaultValue: 0,
    componentProps: {
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    field: 'groupMiniRequire',
    component: 'NInputNumber',
    label: '分组时必传数',
    giProps: {},
    defaultValue: 0,
    componentProps: {}
  },
  {
    field: 'tips',
    component: 'NInput',
    label: '提示语',
    giProps: { span: 1 },
    defaultValue: null,
    componentProps: {
      type: 'textarea'
    }
  },
  {
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    giProps: { span: 1 },
    defaultValue: null,
    componentProps: {
      type: 'textarea'
    }
  }
]

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    field: 'lawName',
    component: 'NInput',
    label: '法名',
    giProps: {},
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

export const boundMenuTableColumns = ({ deleteMenu }) => {
  return [
    {
      title: 'ID',
      key: 'id',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      width: 60
    },
    {
      title: '名称',
      key: 'name',
      ellipsis: {
        tooltip: true
      },
      width: 120
    },
    {
      title: '是否必填',
      key: 'whetherRequire',
      ellipsis: {
        tooltip: true
      },
      width: 80
    },
    {
      title: '分组时必传数量',
      key: 'groupMiniRequire',
      ellipsis: {
        tooltip: true
      },
      width: 100
    },
    {
      title: '组',
      key: 'whetherGroup',
      width: 80,
      ellipsis: {
        tooltip: true
      },
      render(row: any) {
        return row.whetherGroup === '1' ? '分组' : '不分组'
      }
    },
    {
      title: '提示语',
      key: 'tips',
      ellipsis: {
        tooltip: true
      },
      width: 120
    },
    {
      title: '备注',
      key: 'remarks',
      ellipsis: {
        tooltip: true
      },
      width: 120
    },
    {
      title: '证据类型',
      key: 'evidenceTypeList',
      width: 200,
      ellipsis: {
        tooltip: true
      },
      render(row: IEvidenceMenuType) {
        return row.evidenceTypeList?.map((item: IGroupItemType) => {
          return h(
            NTag,
            {
              style: { marginRight: '4px' },
              type: 'primary'
            },
            {
              default: () => item.name
            }
          )
        })
      }
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      render(row: IEvidenceMenuType) {
        return h(
          NButton,
          {
            size: 'small',
            type: 'error',
            onClick: () => deleteMenu(row)
          },
          { default: () => '删除' }
        )
      }
    }
  ] as DataTableColumn[]
}

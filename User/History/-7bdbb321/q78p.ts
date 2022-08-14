import { FormSchema } from '@/components/form'

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {
      span: 2
    },
    field: 'lawTypeId',
    label: '法类型',
    slot: 'lawTypeId',
    rules: [
      {
        required: true,
        trigger: ['change', 'blur'],
        type: 'string',
        validator(_rule: unknown, value: string) {
          console.log('value', value)
          if (!value.length) return new Error('请选择法类型')
          return true
        }
      }
    ]
  },
  {
    defaultValue: null,
    giProps: {
      span: 2
    },
    field: 'regionBinding',
    component: 'SelectRegion',
    label: '地区绑定'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'lawName',
    component: 'NInput',
    label: '法名称',
    componentProps: {
      placeholder: '请输入法名称'
    },
    rules: [{ required: true, message: '请输入法名称', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'releaseTime',
    component: 'NDatePicker',
    label: '发布日期',
    componentProps: {
      placeholder: '请输入发布日期',
      clearable: true
    },
    rules: [{ required: false, type: 'number', message: '请输入发布日期', trigger: ['blur', 'change'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'releaseDepartment',
    component: 'NInput',
    label: '发布机构',
    componentProps: {
      placeholder: '请输入发布机构'
    },
    rules: [{ required: true, message: '请输入发布机构', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'becomesEffectiveTime',
    component: 'NDatePicker',
    label: '生效日期',
    componentProps: {
      placeholder: '请输入生效日期'
    },
    rules: [{ required: false, type: 'number', message: '请输入生效日期', trigger: ['blur', 'change'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'executeTime',
    component: 'NDatePicker',
    label: '执行日期',
    componentProps: {
      placeholder: '请输入执行日期'
    },
    rules: [{ required: false, type: 'number', message: '请输入执行日期', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'noPunishmentTips',
    component: 'NInput',
    label: '未发布提示',
    componentProps: {
      placeholder: '请输入未发布提示'
    },
    rules: [{ required: false, message: '请输入未发布提示', trigger: ['blur'] }]
  }
]

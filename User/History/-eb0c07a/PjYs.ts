import { FormSchema } from '@/components/form'

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'name',
    component: 'NInput',
    label: '名称',
    componentProps: {
      placeholder: '请填写名称'
    },
    rules: [{ required: true, type: 'string', message: '请填写名称', trigger: ['change'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请填写备注'
    },
    rules: [{ required: true, type: 'string', message: '请填写备注', trigger: ['change'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'programTypeId',
    componentDataSourceType: 'ProgramType',
    component: 'NSelect',
    label: '程序类型',
    componentProps: {
      placeholder: '请填写程序类型',
      options: []
    }
    // rules: [{ required: true, type: 'string', message: '请填写程序类型', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'whetherParentUseType',
    component: 'NRadioGroup',
    label: '是否依附父类',
    componentProps: {
      placeholder: '请选择',
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
    },
    rules: [{ required: true, type: 'number', message: '请选择', trigger: ['change'] }]
  }
]

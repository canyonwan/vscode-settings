import { FormSchema } from '@/components/form'

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'evidenceName',
    component: 'NInput',
    label: '证据项名称',
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注'
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'relaEvidenceType',
    componentDataSourceType: 'RelaEvidenceType',
    component: 'NSelect',
    label: '证据类型',
    componentProps: {
      placeholder: '请选择证据类型'
    }
  }
]

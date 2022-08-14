import { FormSchema } from '@/components/form'

export const messageSchemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'name',
    component: 'NInput',
    label: '名称',
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'name',
    component: 'NInput',
    label: '名称',
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  }
]

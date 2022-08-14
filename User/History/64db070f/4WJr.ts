import { FormSchema } from '@/components/form'
export const schemas = [
  {
    field: 'name',
    component: 'NInput',
    label: '裁量分组名称',
    componentProps: {
      placeholder: '请输入裁量分组名称'
    },
    rules: [{ required: true, type: 'string', message: '裁量分组名称必填', trigger: 'change' }]
  },
  {
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注'
    }
  }
] as FormSchema[]

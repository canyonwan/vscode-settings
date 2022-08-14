import { FormSchema } from '@/components/form'
export const customSchemas = [
  {
    field: 'name',
    component: 'NInput',
    label: '裁量分组名称',
    componentProps: {
      placeholder: '请输入裁量分组名称'
    }
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

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
const calcWay = [
  {
    label: '加',
    value: 1
  },
  {
    label: '减',
    value: 2
  },
  {
    label: '乘',
    value: 3
  },
  {
    label: '除',
    value: 4
  }
]
const unitOptions = [
  {
    label: '元',
    value: 1
  },
  {
    label: '百分比',
    value: 2
  },
  {
    label: '分',
    value: 3
  }
]

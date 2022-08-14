import { FormSchema } from '@/components/form'
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
export const customSchemas = [
  {
    field: 'name',
    component: 'NInput',
    label: '自定义裁量项',
    componentProps: {
      placeholder: '请输入自定义裁量项'
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
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
    },
    required: [{ required: true, type: 'string', message: '请输入自定义裁量项', trigger: 'change' }]
  },
  {
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注'
    }
  },
  {
    field: 'operatorType',
    component: 'NSelect',
    label: '运算方式',
    componentProps: {
      placeholder: '请选择运算方式',
      options: calcWay
    },
    giProps: {
      span: 2
    },
    required: [{ required: true, type: 'number', message: '请选择运算方式', trigger: 'change' }]
  },
  {
    field: 'operatorValue',
    component: 'NInput',
    label: '运算值',
    componentProps: {
      placeholder: '请输入运算值'
    },
    giProps: {
      span: 2
    },
    required: [{ required: true, type: 'number', message: '请输入运算值', trigger: 'change' }]
  },
  {
    field: 'unit',
    component: 'NSelect',
    label: '单位',
    componentProps: {
      placeholder: '请选择单位',
      options: unitOptions
    },
    required: [{ required: true, type: 'number', message: '请选择单位', trigger: 'change' }]
  }
] as FormSchema[]

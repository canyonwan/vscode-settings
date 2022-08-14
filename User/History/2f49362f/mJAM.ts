import { IDiscretionTypeItem } from '@/api/program/types'
import { FormSchema } from '@/components/form'
import type { Ref } from 'vue'
const injectCu = inject<Ref<IDiscretionTypeItem>>('currentSelectDiscretionItem')
const calcWay = [
  {
    label: '加',
    value: 1
  },
  {
    label: '减',
    value: 2
  }
  // {
  //   label: '乘',
  //   value: 3
  // },
  // {
  //   label: '除',
  //   value: 4
  // }
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
    label: '裁量项',
    componentProps: {
      placeholder: '请输入裁量项'
    },
    rules: [{ required: true, type: 'string', message: '请输入裁量项', trigger: ['blur', 'change'] }]
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
    rules: [{ required: true, type: 'number', message: '请选择运算方式', trigger: ['blur', 'change'] }]
  },
  {
    field: 'operatorValue',
    component: 'NInputNumber',
    label: '运算值',
    componentProps: {
      placeholder: '请输入运算值'
    },
    rules: [{ required: true, type: 'number', message: '请输入运算值', trigger: ['blur', 'change'] }]
  },
  {
    field: 'unit',
    component: 'NSelect',
    label: '单位',
    componentProps: {
      placeholder: '请选择单位',
      options: injectCu!.value.discretionCalculationId === '1000000' ? unitOptions.filter((item) => item.value !== 3) : unitOptions
    },
    rules: [{ required: true, type: 'number', message: '请输入运算值', trigger: ['blur', 'change'] }]
  }
] as FormSchema[]

import type { FormSchema } from '@/components/Form/src/types/form'

export const goodsSchemas = <FormSchema[]>[
  {
    field: 'name',
    component: 'NInput',
    label: '商品名称',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入商品名称'
    }
  },
  {
    field: 'uniPrice',
    component: 'NInput',
    label: '当前价格',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  }
]

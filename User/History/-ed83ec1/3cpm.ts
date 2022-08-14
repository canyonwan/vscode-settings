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
export const goodsDetailSchemas = <FormSchema[]>[
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
    field: 'unitPrice',
    component: 'NInput',
    label: '当前价格',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  },
  {
    field: 'meteringType',
    component: 'NInput',
    label: '计量单位',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  },
  {
    field: 'meteringValue',
    component: 'NInput',
    label: '计量值',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  },
  {
    field: 'meteringNickname',
    component: 'NInput',
    label: '计量别称',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  },
  {
    field: 'meteringOther',
    component: 'NInput',
    label: '计量描述',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  }
]

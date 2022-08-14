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
    },
    required: {}
  },
  {
    field: 'goodsTypeId',
    component: 'NTreeSelect',
    label: '商品类型',
    defaultValue: null,
    giProps: {},
    slot: 'goodsTypeSlot'
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
    field: 'goodsTypeId',
    component: 'NTreeSelect',
    label: '商品类型',
    defaultValue: null,
    giProps: {},
    slot: 'goodsTypeSlot'
  },
  {
    field: 'summary',
    component: 'NInput',
    label: '概述',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入商品概述'
    }
  },
  {
    field: 'unitPrice',
    component: 'NInputNumber',
    label: '当前价格',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    }
  },
  {
    field: 'meteringType',
    component: 'NInputNumber',
    label: '计量单位',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入计量单位'
    }
  },
  {
    field: 'meteringValue',
    component: 'NInputNumber',
    label: '计量值',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入计量值'
    }
  },
  {
    field: 'meteringNickname',
    component: 'NInput',
    label: '计量别称',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入计量别称'
    }
  },
  {
    field: 'meteringOther',
    component: 'NInput',
    label: '计量描述',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入计量描述'
    }
  },
  {
    field: 'transport',
    component: 'NInput',
    label: '运输方式',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入运输方式'
    }
  },
  {
    field: 'beforePhone',
    component: 'NInput',
    label: '售前电话',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入售前电话'
    }
  },
  {
    field: 'afterPhone',
    component: 'NInput',
    label: '售后电话',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入售后电话'
    }
  },
  {
    field: 'fileId',
    label: '商品图片',
    defaultValue: null,
    giProps: {},
    slot: 'uploadImageSlot'
  }
]

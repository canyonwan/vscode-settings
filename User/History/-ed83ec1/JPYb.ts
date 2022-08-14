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
    field: 'goodsTypeId',
    component: 'Slot',
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
    },
    rules: [{ required: true, message: '请输入商品名称', trigger: ['blur'] }]
  },
  {
    field: 'goodsTypeId',
    component: 'Slot',
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
    },
    rules: [{ type: 'string', required: true, message: '请输入商品概述', trigger: ['blur'] }]
  },
  {
    field: 'unitPrice',
    component: 'NInputNumber',
    label: '当前价格',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入当前价格'
    },
    rules: [{ type: 'number', required: true, message: '请输入当前价格', trigger: ['blur'] }]
  },
  {
    field: 'meteringType',
    component: 'NInputNumber',
    label: '计量单位',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入计量单位'
    },
    rules: [{ type: 'number', required: true, message: '请输入计量单位', trigger: ['blur'] }]
  },
  {
    field: 'meteringValue',
    component: 'NInputNumber',
    label: '计量值',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入计量值'
    },
    rules: [{ type: 'number', required: true, message: '请输入计量值', trigger: ['blur'] }]
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
    },
    rules: [{ required: true, message: '请输入运输方式', trigger: ['blur'] }]
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
    giProps: {
      span: 24
    },
    slot: 'uploadImageSlot'
  }
]

import { FormSchema } from '@/components/form'

export const bannerSchemas = <FormSchema[]>[
  {
    field: 'name',
    component: 'NInput',
    label: '名称',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  },
  {
    field: 'platformTypeName',
    component: 'NInput',
    label: '平台类型名称',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入平台类型名称'
    },
    rules: [{ required: true, message: '请输入平台类型名称', trigger: ['blur'] }]
  },
  {
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入轮播图概述'
    },
    rules: [{ type: 'string', required: true, message: '请输入轮播图概述', trigger: ['blur'] }]
  },
  {
    field: 'fileIds',
    label: '轮播图',
    defaultValue: null,
    giProps: {
      span: 24
    },
    slot: 'uploadImageSlot'
  }
]
export const bannerSearchSchemas = <FormSchema[]>[
  {
    field: 'name',
    component: 'NInput',
    label: '名称',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  }
]

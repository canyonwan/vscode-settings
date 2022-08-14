import { FormSchema } from '@/components/form'

export const messageSchemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'title',
    component: 'NInput',
    label: '名称',
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'content',
    component: 'NInput',
    label: '内容',
    componentProps: {
      placeholder: '请输入内容'
    },
    rules: [{ required: true, message: '请输入内容', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'receivingGroupTypeIds',
    label: '目标群体',
    componentProps: {
      placeholder: '请选择目标群体'
    },
    slot: 'receiveTargetSlot'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'whetherPush',
    component: 'NRadioGroup',
    label: '是否发送站外消息'
  }
]

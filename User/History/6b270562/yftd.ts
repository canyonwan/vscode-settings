import { FormSchema } from '@/components/form'
import _ from 'lodash'

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'displayValue',
    component: 'NInput',
    label: '显示值',
    componentProps: {
      placeholder: '请输入显示值'
    },
    rules: [{ required: true, message: '请输入显示值', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'type',
    component: 'NInput',
    label: '类型',
    componentProps: {
      placeholder: '请输入类型'
    },
    rules: [{ required: true, message: '请输入类型', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},

    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注'
    },
    rules: [{ required: true, message: '请输入备注', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    field: 'hiddenValue',
    component: 'NInputNumber',
    label: '隐藏值',
    giProps: {},
    componentProps: {
      placeholder: '请输入隐藏值',
      showButton: false,
      validator: (v) => v !== null && v !== undefined && v !== '',
      onInput: (e: any) => {
        return _.parseInt(e.data as string)
      }
    }
  },
  {
    defaultValue: true,
    giProps: {},
    field: 'status',
    component: 'NSwitch',
    label: '是否启用'
    // rules: [{ required: true, message: '请输入显示值', trigger: ['blur'] }]
  }
]

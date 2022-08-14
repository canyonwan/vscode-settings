import { FormSchema } from '@/components/form'
import _ from 'lodash'

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'versionCode',
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
    field: 'appType',
    component: 'NSelect',
    label: '类型',
    componentProps: {
      placeholder: '请选择类型'
    },
    rules: [{ required: true, message: '请输入类型', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'description',
    component: 'NInput',
    label: '描述',
    componentProps: {
      placeholder: '请输入描述'
    },
    rules: [{ required: true, message: '请输入描述', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    field: 'appSize',
    component: 'NInputNumber',
    label: '文件大小',
    giProps: {},
    componentProps: {
      placeholder: '请输入文件大小',
      showButton: false
      // validator: (v) => v !== null && v !== undefined && v !== '',
      // onInput: (e: any) => {
      //   return _.parseInt(e.data as string)
      // }
    }
  },
  {
    defaultValue: '1',
    giProps: {},
    field: 'versionStatus',
    component: 'NSelect',
    label: '版本状态',
    componentProps: {
      placeholder: '请选择版本状态',
      options: [
        {
          label: '最新版本',
          value: '1'
        },
        {
          label: '选择更新',
          value: '2'
        },
        {
          label: '必须更新',
          value: '3'
        }
      ]
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'fileId',
    component: 'NUpload',
    label: '上传',
    componentProps: {}
  }
]

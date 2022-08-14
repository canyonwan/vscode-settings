import { FormSchema } from '@/components/form'
import _ from 'lodash'

export const schemas: FormSchema[] = [
  {
    defaultValue: null,
    giProps: {},
    field: 'versionCode',
    component: 'NInputNumber',
    label: '版本号',
    componentProps: {
      placeholder: '请输入版本号'
    },
    rules: [{ required: true, message: '请输入版本号', trigger: ['blur'], type: 'number' }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'versionName',
    component: 'NInput',
    label: '版本',
    componentProps: {
      placeholder: '请输入版本'
    },
    rules: [{ required: true, message: '请输入版本', trigger: ['blur'] }]
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'appType',
    component: 'NSelect',
    label: 'app类型',
    componentProps: {
      placeholder: '请选择app类型',
      options: [
        {
          label: '综合执法类型',
          value: 1
        }
      ]
    },
    rules: [{ required: true, message: '请选择App类型', trigger: ['blur'], type: 'number' }]
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'versionStatus',
    component: 'NSelect',
    label: '版本状态',
    componentProps: {
      placeholder: '请选择版本状态',
      options: [
        {
          label: '最新版本',
          value: 1
        },
        {
          label: '选择更新',
          value: 2
        },
        {
          label: '必须更新',
          value: 3
        }
      ]
    }
  },
  {
    defaultValue: null,
    giProps: { span: 2 },
    field: 'description',
    component: 'NInput',
    label: '描述',
    componentProps: {
      placeholder: '请输入描述',
      type: 'textarea'
    },
    rules: [{ required: true, message: '请输入描述', trigger: ['blur'] }]
  },
  // {
  //   defaultValue: null,
  //   giProps: {},
  //   field: 'fileId',
  //   label: '',
  //   slot: 'uploadSlot'
  // }
  {
    defaultValue: null,
    giProps: {},
    field: 'fileId',
    component: 'NUpload',
    label: '安装包上传',
    componentProps: {
      accept: '.apk'
    },
    rules: [
      {
        trigger: 'blur',
        validator: (rule, value) => {
          if (!value) return new Error('请上传安装包')
          return true
        }
      }
    ]
    // rules: [{ required: false, message: '请上传App安装包', trigger: ['blur'], type: 'array' }]
  }
]

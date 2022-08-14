import { FormSchema } from '@/components/form'
import { NSelect } from 'naive-ui'
import { orgPropertiesOptionsA } from '../options'

export const createSchemas = (values: any) => {
  return [
    {
      field: 'name',
      defaultValue: null,
      giProps: {},
      component: 'NInput',
      label: '案由名称',
      componentProps: {
        placeholder: '请输入案由名称',
        type: 'textarea'
      },
      rules: [{ required: true, message: '请输入案由名称', trigger: ['change'] }]
    },
    {
      field: 'causeTagIdList',
      defaultValue: null,
      label: '案由标签',
      giProps: {
        span: 1
      },
      component: 'Slot',
      slot: 'tag',
      rules: [{ required: true, type: 'array', trigger: ['change', 'blur', 'input', 'focus'], message: '' }]
    },
    {
      field: 'identifier',
      defaultValue: null,
      component: 'NInput',
      label: '案由编号',
      giProps: {
        span: 1
      },
      componentProps: {
        disabled: true,
        placeholder: '请选择案由标签，生成案由编号'
      }
    },
    {
      field: 'illegalSubject',
      defaultValue: null,
      giProps: {},
      component: 'NSelect',
      label: '违法主体描述',
      componentProps: {
        placeholder: '输入违法主体描述，按回车确认',
        multiple: true,
        filterable: true,
        tag: true,
        show: false
      }
    },
    {
      field: 'orgProperties',
      defaultValue: null,
      giProps: {},
      component: 'NSelect',
      label: '机关类型',
      componentProps: {
        options: orgPropertiesOptionsA,
        multiple: true
      },
      rules: [{ required: true, message: '请选择机关类型', type: 'array', trigger: ['blur', 'change'] }]
    },
    {
      field: 'penaltyObjectType',
      defaultValue: null,
      giProps: {},
      componentSource: shallowRef(NSelect),
      label: '检查对象',
      componentProps: {
        multiple: true,
        options: []
      },
      componentDataSourceType: 'CheckedTargetType',
      rules: [{ required: true, message: '请选择检查对象', type: 'array', trigger: ['blur', 'change'] }]
    },
    {
      field: 'lawIdList',
      label: '案由法',
      defaultValue: null,
      giProps: {},
      slot: 'causeLaw'
    },
    {
      field: 'deptList',
      defaultValue: null,
      giProps: {},
      label: '部门类型',
      slot: 'dept'
    },

    {
      field: 'tips',
      component: 'NInput',
      defaultValue: null,
      giProps: {},
      label: '提示',
      componentProps: {
        placeholder: '请输入提示',
        type: 'textarea'
      }
    }
  ]
}

export const schemas: FormSchema[] = [
  {
    field: 'name',
    defaultValue: null,
    giProps: {},
    component: 'NInput',
    label: '案由名称',
    componentProps: {
      placeholder: '请输入案由名称',
      type: 'textarea'
    },
    rules: [{ required: true, message: '请输入案由名称', trigger: ['change'] }]
  },
  {
    field: 'causeTagIdList',
    defaultValue: null,
    label: '案由标签',
    giProps: {
      span: 1
    },
    component: 'Slot',
    slot: 'tag',
    rules: [{ required: true, type: 'array', trigger: ['change', 'blur', 'input', 'focus'], message: '' }]
  },
  {
    field: 'identifier',
    defaultValue: null,
    component: 'NInput',
    label: '案由编号',
    giProps: {
      span: 1
    },
    componentProps: {
      disabled: true,
      placeholder: '请选择案由标签，生成案由编号'
    }
  },
  {
    field: 'illegalSubject',
    defaultValue: null,
    giProps: {},
    component: 'NSelect',
    label: '违法主体描述',
    componentProps: {
      placeholder: '输入违法主体描述，按回车确认',
      multiple: true,
      filterable: true,
      tag: true,
      show: false
    }
  },
  {
    field: 'orgProperties',
    defaultValue: null,
    giProps: {},
    component: 'NSelect',
    label: '机关类型',
    componentProps: {
      options: orgPropertiesOptionsA,
      multiple: true
    },
    rules: [{ required: true, message: '请选择机关类型', type: 'array', trigger: ['blur', 'change'] }]
  },
  {
    field: 'penaltyObjectType',
    defaultValue: null,
    giProps: {},
    componentSource: shallowRef(NSelect),
    label: '检查对象',
    componentProps: {
      multiple: true,
      options: []
    },
    componentDataSourceType: 'CheckedTargetType',
    rules: [{ required: true, message: '请选择检查对象', type: 'array', trigger: ['blur', 'change'] }]
  },
  {
    field: 'lawIdList',
    label: '案由法',
    defaultValue: null,
    giProps: {},
    slot: 'causeLaw'
  },
  {
    field: 'deptList',
    defaultValue: null,
    giProps: {},
    label: '部门类型',
    slot: 'dept'
  },

  {
    field: 'tips',
    component: 'NInput',
    defaultValue: null,
    giProps: {},
    label: '提示',
    componentProps: {
      placeholder: '请输入提示',
      type: 'textarea'
    }
  }
]

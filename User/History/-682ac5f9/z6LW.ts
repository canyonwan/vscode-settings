import { FormSchema } from '@/components/form'
import { NSelect } from 'naive-ui'
const operatorType = [
  {
    label: '加',
    value: 1
  },
  {
    label: '减',
    value: 2
  },
  {
    label: '乘',
    value: 3
  },
  {
    label: '除',
    value: 4
  }
]
const isOrNot = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
]
export const unitOptions = [
  {
    label: '元',
    value: 1
  },
  {
    label: '百分比',
    value: 2
  },
  {
    label: '分',
    value: 3
  }
]
export const schemas = [
  {
    field: 'name',
    component: 'NInput',
    label: '清单名称',
    componentProps: {
      placeholder: '请输入清单名称'
    },
    rules: [{ required: true, message: '请输入清单名称', type: 'string', trigger: ['change'] }]
  },
  {
    field: 'whetherGroupType',
    component: 'NSelect',
    label: '是不是组区分',
    componentProps: {
      placeholder: '请选择是不是组区分',
      options: isOrNot
    }
  },
  {
    field: 'whetherSelect',
    component: 'NSelect',
    label: '是不是必选',
    componentProps: {
      placeholder: '请选择是不是必选',
      options: isOrNot
    }
  },
  {
    field: 'selectType',
    component: 'NSelect',
    label: '选择类型',
    componentProps: {
      placeholder: '请选择类型',
      options: [
        {
          label: '单选',
          value: 1
        },
        {
          label: '多选',
          value: 2
        }
      ]
    },
    rules: [{ required: true, message: '选择类型必选', type: 'number', trigger: ['change'] }]
  },
  {
    field: 'valueType',
    component: 'NSelect',
    label: '值类型',
    componentProps: {
      placeholder: '请选择值类型',
      options: [
        {
          label: '一个值',
          value: 1
        },
        {
          label: '多个值',
          value: 2
        }
      ]
    },
    rules: [{ required: true, message: '值类型必选', type: 'number', trigger: ['change'] }]
  },
  {
    field: 'operatorType',
    component: 'NSelect',
    label: '标准运算方式',
    componentProps: {
      placeholder: '请选择标准运算方式',
      options: operatorType
    },
    rules: [{ required: true, message: '标准运算方式必选', type: 'number', trigger: ['change'] }]
  },
  {
    field: 'operatorValue',
    component: 'NInputNumber',
    label: '标准运算值',
    componentProps: {
      placeholder: '请输入标准运算值'
    }
  },
  {
    field: 'relaEvidenceType',
    componentSource: shallowRef(NSelect),
    label: '证据类型',
    componentProps: {
      placeholder: '请选择证据类型',
      multiple: true,
      options: []
    },
    componentDataSourceType: 'RelaEvidenceType'
  },
  {
    field: 'minValue',
    component: 'NInputNumber',
    label: '最小值',
    componentProps: {
      placeholder: '请输入最小值',
      showButton: false
    }
  },
  {
    field: 'maxValue',
    component: 'NInputNumber',
    label: '最大值',
    componentProps: {
      placeholder: '请输入最大值',
      showButton: false
    }
  },
  {
    field: 'tips',
    component: 'NInput',
    label: '提示语',
    componentProps: {
      placeholder: '请输入提示语'
    }
  },
  {
    field: 'unit',
    component: 'NSelect',
    label: '单位',
    componentProps: {
      placeholder: '请选择单位',
      options: unitOptions
    },
    // TODO 不是组区分 必填
    rules: [{ required: true, type: 'number', message: '请选择单位', trigger: ['change'] }]
  },
  {
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注'
    },
    giProps: { span: 2 }
  },
  {
    field: 'discretionScoreConf',
    label: '要点选择得分',
    slot: 'keyPointScoreSlot',
    giProps: { span: 2 }
  }
] as FormSchema[]

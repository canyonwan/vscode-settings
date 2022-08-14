import { FormSchema } from '@/components/form'
import { NSelect } from 'naive-ui'

export const schemas = [
  {
    field: 'discretionCalculationId',
    component: 'NSelect',
    componentSource: shallowRef(NSelect),
    label: '裁量计算方式',
    componentProps: {
      placeholder: '请选择裁量计算方式',
      options: []
    },
    componentDataSourceType: 'DiscretionCalculateType',
    rules: [{ required: true, type: 'string', message: '裁量计算方式必选', trigger: ['blur', 'change'] }]
  },
  {
    field: 'discretionTypeId',
    component: 'NSelect',
    componentSource: shallowRef(NSelect),
    label: '裁量类型',
    componentProps: {
      placeholder: '请选择裁量类型',
      options: []
    },
    componentDataSourceType: 'DiscretionType',
    rules: [{ required: true, type: 'string', message: '裁量类型必选', trigger: ['blur', 'change'] }]
  },
  {
    field: 'illegalSubject',
    component: 'NSelect',
    componentSource: shallowRef(NSelect),
    label: '违法主体',
    componentProps: {
      placeholder: '请选择违法主体'
    },
    componentDataSourceType: 'CheckedTargetType'
  },
  {
    field: 'baseValue',
    component: 'NInput',
    label: '基准值',
    componentProps: {
      placeholder: '请输入基准值'
    }
  },
  {
    field: 'baseKey',
    component: 'NInput',
    label: '基准名称',
    componentProps: {
      placeholder: '请输入基准名称'
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
    field: 'limitMin',
    component: 'NInputNumber',
    labelMessage: '金额比例或金额倍数时使用的最小值',
    label: '金额下限',
    collapsed: true,
    componentProps: {
      placeholder: '请输入金额比例或金额倍数时使用的最小值'
    },
    rules: [{ required: false, type: 'number', trigger: 'change', message: '金额下限必填' }]
  },
  {
    field: 'limitMax',
    component: 'NInputNumber',
    labelMessage: '金额比例或金额倍数时使用的最大值',
    label: '金额上限',
    componentProps: {
      placeholder: '请输入金额比例或金额倍数时使用的最大值'
    },
    rules: [{ required: false, type: 'number', trigger: 'change', message: '金额上限必填' }]
  },
  {
    field: 'minValue',
    component: 'NInputNumber',
    label: '最小值',
    componentProps: {
      placeholder: '请输入最小值'
    }
  },
  {
    field: 'maxValue',
    component: 'NInputNumber',
    label: '最大值',
    componentProps: {
      placeholder: '请输入最大值'
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
    field: 'remarks',
    component: 'NInput',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注'
    }
  }
] as FormSchema[]

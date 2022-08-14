import { FormSchema } from '@/components/form'
import { NTreeSelect } from 'naive-ui'
import { validatePhone } from '@/utils/validate'
export const schemas = [
  {
    field: 'username',
    component: 'NInput',
    label: '用户名称',
    componentProps: {},
    rules: [{ required: true, message: '请输入用户名称', trigger: ['blur'] }]
  },
  {
    field: 'phone',
    component: 'NInput',
    label: '手机号码',
    componentProps: {},
    rules: [
      {
        required: true,
        trigger: ['blur', 'change'],
        validator: (_rule, value) => {
          if (value && !validatePhone(value)) {
            return new Error('请输入正确的手机号')
          }
        }
      }
    ]
  },
  {
    field: 'realName',
    component: 'NInput',
    label: '真实姓名',
    componentProps: {},
    rules: [{ required: true, message: '请输入真实姓名', trigger: ['blur'] }]
  },
  {
    field: 'sex',
    component: 'NRadioGroup',
    label: '性别',
    componentProps: {},
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'sex'
  },
  {
    field: 'position',
    component: 'NTreeSelect',
    componentSource: shallowRef(NTreeSelect),
    label: '职位',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Position'
  },
  {
    field: 'level',
    component: 'NInput',
    label: '职级',
    componentProps: {}
  },
  {
    field: 'nation',
    component: 'NSelect',
    label: '民族',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'nation'
  },
  {
    field: 'idcard',
    component: 'NInput',
    label: '身份证',
    componentProps: {}
  },
  {
    field: 'major',
    component: 'NInput',
    label: '学历专业',
    componentProps: {},
    rules: [{ required: true, message: '请输入学历', trigger: ['change'] }]
  },
  {
    field: 'birthday',
    component: 'NDatePicker',
    label: '出生年月',
    componentProps: {
      type: 'date'
    },
    rules: [{ required: true, message: '请选择出生年月', type: 'date', trigger: ['blur', 'change'] }]
  },
  {
    field: 'topDegree',
    component: 'NSelect',
    label: '最高学历',
    componentProps: {},
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'topDegree'
  },
  {
    field: 'email',
    component: 'NInput',
    label: '邮箱',
    componentProps: {}
  },
  {
    field: 'checkCode',
    component: 'NInput',
    label: '检查证号',
    componentProps: {}
  },
  {
    field: 'superviserCode',
    component: 'NInput',
    label: '监督证号',
    componentProps: {}
  },
  {
    field: 'enforceCode',
    component: 'NInput',
    label: '执法证号',
    componentProps: {}
  },
  {
    field: 'isMajorLaw',
    component: 'NRadioGroup',
    label: '是否法律专业',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'is',
    rules: [
      {
        trigger: ['blur', 'change'],
        required: true,
        validator: (_rule, value) => {
          if (value === null) {
            return new Error('请选择是否法律专业')
          }
        }
      }
    ]
  },
  {
    field: 'isHaveLawQualification',
    component: 'NRadioGroup',
    label: '是否有法律资格',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'is',
    rules: [
      {
        trigger: ['blur', 'change'],
        required: true,
        validator: (_rule, value) => {
          if (value === null) {
            return new Error('请选择是否有法律资格')
          }
        }
      }
    ]
  },
  {
    field: 'regularNature',
    component: 'NSelect',
    label: '编制性质',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'regularNature',
    rules: [
      {
        trigger: ['blur', 'change'],
        required: true,
        validator: (_rule, value) => {
          if (!value) {
            return new Error('请选择编制性质')
          }
        }
      }
    ]
  },
  {
    field: 'positionNature',
    component: 'NSelect',
    label: '岗位性质',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'positionNature',
    rules: [
      {
        trigger: ['blur', 'change'],
        required: true,
        validator: (_rule, value) => {
          if (!value) {
            return new Error('请选择岗位性质')
          }
        }
      }
    ]
  },
  {
    field: 'isLegalReview',
    component: 'NRadioGroup',
    label: '是否法制审核员',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'is'
  },
  {
    field: 'political',
    component: 'NSelect',
    label: '政治面貌',
    componentProps: {
      options: []
    },
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'political',
    rules: [
      {
        trigger: ['blur', 'change'],
        required: true,
        validator: (_rule, value) => {
          if (!value) {
            return new Error('请选择政治面貌')
          }
        }
      }
    ]
  },
  {
    field: 'role',
    label: '平台角色',
    defaultValue: [],
    component: 'Slot',
    giProps: { span: 2 },
    //插槽
    slot: 'PersonnelRole',
    rules: [{ required: true }]
  },
  {
    field: 'customForm',
    component: 'Slot',
    // label: '自定义表单',
    giProps: {
      span: 2
    },
    //插槽
    slot: 'customForm'
  }
] as FormSchema[]

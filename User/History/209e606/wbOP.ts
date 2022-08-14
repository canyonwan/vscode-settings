import { FormSchema } from '@/components/form'
import { useUserStore } from '@/store/modules/user'
const user = useUserStore()

export const schemas: FormSchema[] = [
  {
    field: 'name',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '机关名称',
    componentProps: {
      placeholder: '请输入机关名称'
    },
    rules: [{ required: true, message: '请输入机关名称', trigger: ['blur'] }]
  },
  {
    field: 'region',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '地区名称',
    componentProps: {}
  },
  {
    field: 'orgProperties',
    giProps: {},
    defaultValue: null,
    component: 'NSelect',
    label: '机关范围',
    componentProps: {
      multiple: true,
      options: [
        {
          label: '县及以上',
          value: '1'
        },
        {
          label: '城市',
          value: '2'
        },
        {
          label: '设区市',
          value: '3'
        },
        {
          label: '省及以上',
          value: '4'
        },
        {
          label: '国家',
          value: '5'
        }
      ]
    },
    rules: [{ required: true, type: 'array', message: '请选择机关范围', trigger: ['change'] }]
  },
  {
    field: 'districtId',
    giProps: {},
    defaultValue: null,
    component: 'SelectRegion',
    label: '所在地区',
    defaultValue: null,
    giProps: {
      span: 2
    },
    rules: [
      {
        required: true,
        trigger: ['change'],
        validator(_rule: unknown, value: any) {
          if (!value) return new Error('请选择所在地区')
          return true
        }
      }
    ],
    // rules: [{ required: true, message: '请选择所在地区', trigger: ['change'] }],
    componentProps: {}
  },
  {
    // 部门选择器
    field: 'deptId',
    giProps: {},
    defaultValue: null,
    component: 'NSelect',
    label: '部门类型',
    componentProps: {
      disabled: user.getIsUser,
      options: []
    },
    rules: [{ required: true, message: '请选择部门类型', trigger: ['change'] }],
    componentDataSourceType: 'Department'
  },
  {
    field: 'attachedType',
    giProps: {},
    defaultValue: null,
    component: 'NRadioGroup',
    label: '附属类型',
    componentProps: {
      options: []
    },
    rules: [{ required: true, message: '请选择附属类型', type: 'number', trigger: 'change' }],
    componentDataSourceType: 'Dictionaries',
    componentDataSourceName: 'attachedType'
  },
  {
    field: 'representative',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '法定代表人',
    componentProps: {
      placeholder: '请输入法定代表人'
    }
  },
  {
    field: 'address',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '单位地址',
    componentProps: {
      placeholder: '请输入单位地址'
    }
  },
  {
    field: 'officePhone',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '办公室电话',
    componentProps: {
      placeholder: '请输入办公室电话'
    }
  },
  {
    field: 'code',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '组织机构代码',
    componentProps: {
      placeholder: '请输入组织机构代码'
    }
  },
  {
    field: 'fax',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '传真',
    componentProps: {
      placeholder: '请输入传真'
    }
  },
  {
    field: 'legalChargePerson',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '法制机构负责人',
    componentProps: {
      placeholder: '请输入法制机构负责人'
    }
  },
  {
    field: 'legalChargePersonPhone',
    giProps: {},
    defaultValue: null,
    component: 'NInput',
    label: '法制机构负责人联系电话',
    // labelWidth: 180,
    componentProps: {
      placeholder: '请输入法制机构负责人联系电话'
    }
  },
  // {
  //   field: 'confiscationPermitId',
  //   component: 'NInputNumber',
  //   label: '罚没许可证id',
  //   defaultValue: null,
  //   componentProps: {
  //     placeholder: '请输入罚没许可证id'
  //   }
  // },
  // {
  //   field: 'whetherseal',
  //   component: 'NRadioGroup',
  //   label: '文书是否生成盖章',
  //   componentProps: {
  //     options: []
  //   }
  // },
  {
    field: 'signature',
    component: 'NInput',
    label: '文书落款',
    componentProps: {
      placeholder: '请输入文书落款'
    }
  },
  {
    field: 'codeprefix',
    component: 'NInput',
    label: '文书前缀',
    componentProps: {
      placeholder: '请输入文书前缀'
    }
  },
  {
    field: 'zipcode',
    component: 'NInput',
    label: '机关邮编',
    componentProps: {
      placeholder: '请输入机关邮编'
    }
  },
  {
    field: 'bankname',
    component: 'NInput',
    label: '银行名称',
    componentProps: {
      placeholder: '请输入银行名称'
    }
  },
  {
    field: 'bankaccount',
    component: 'NInput',
    label: '银行账户',
    componentProps: {
      placeholder: '请输入银行账户'
    }
  },
  {
    field: 'bankaccountcode',
    component: 'NInput',
    label: '银行账号',
    componentProps: {
      placeholder: '请输入银行账号'
    }
  },
  {
    field: 'government',
    component: 'NInput',
    label: '同级政府',
    componentProps: {
      placeholder: '请输入同级政府'
    }
  },
  {
    field: 'court',
    component: 'NInput',
    label: '人民法院',
    componentProps: {
      placeholder: '请输入人民法院'
    }
  },
  {
    field: 'superorgname',
    component: 'NInput',
    label: '上级机关',
    componentProps: {
      placeholder: '请输入上级机关'
    }
  }
  // {
  //   field: 'organsystem',
  //   component: 'NInput',
  //   label: '裁量标准',
  //   componentProps: {
  //     placeholder: '请输入裁量标准'
  //   }
  // }
]

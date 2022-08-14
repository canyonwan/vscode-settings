import { FormSchema } from '@/components/form/src/types/form-type'

const inspectSchemas = <FormSchema[]>[
  {
    field: 'targetId',
    component: 'NSelect',
    label: '检查对象',
    defaultValue: null,
    giProps: {},
    slot: 'targetSlot'
  },
  {
    field: 'createTime',
    component: 'NDatePicker',
    label: '检查时间',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请选择检查时间'
    }
  },
  {
    field: 'userId',
    component: 'NSelect',
    label: '执法人员',
    defaultValue: '',
    giProps: {},
    slot: 'enforceMemberSlot'
  },
  {
    field: '',
    component: 'NSelect',
    label: '是否产生案件',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    field: 'type',
    component: 'NSelect',
    label: '记录方式',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请选择记录方式',
      options: [
        {
          label: '线上制作',
          value: 1
        },
        {
          label: '线下上传',
          value: 2
        }
      ]
    }
  }
]

const punishSchemas = <FormSchema[]>[
  {
    defaultValue: null,
    giProps: {},
    field: 'createTime',
    component: 'NDatePicker',
    label: '检查日期',
    componentProps: {
      placeholder: '请选择检查日期',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NInput',
    label: '违法行为人',
    componentProps: {
      placeholder: '请输入违法行为人',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NSelect',
    label: '适用程序',
    componentProps: {
      placeholder: '请输入适用程序',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'userId',
    component: 'NSelect',
    label: '办案人员',
    componentProps: {
      placeholder: '请输入办案人员',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'orgId',
    component: 'NSelect',
    label: '办案机构',
    componentProps: {
      placeholder: '请输入办案机构',
      clearable: true
    }
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'orgId',
    component: 'NRadioGroup',
    label: '是否法制审核',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'orgId',
    component: 'NRadioGroup',
    label: '是否复议',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'orgId',
    component: 'NRadioGroup',
    label: '是否诉讼',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    field: 'type',
    component: 'NSelect',
    label: '记录方式',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请选择记录方式',
      options: [
        {
          label: '线上制作',
          value: 1
        },
        {
          label: '线下上传',
          value: 2
        }
      ]
    }
  }
]

const forceSchemas = <FormSchema[]>[
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NSelect',
    label: '强制类型',
    componentProps: {
      placeholder: '请选择强制类型',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NSelect',
    label: '强制措施种类',
    componentProps: {
      placeholder: '请选择强制措施种类',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NSelect',
    label: '强制执行种类',
    componentProps: {
      placeholder: '请选择强制执行种类',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'userId',
    component: 'NSelect',
    label: '办案人员',
    componentProps: {
      placeholder: '请选择办案人员',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'orgId',
    component: 'NSelect',
    label: '办案机构',
    componentProps: {
      placeholder: '请选择办案机构',
      clearable: true
    }
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'orgId',
    component: 'NRadioGroup',
    label: '是否复议',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'orgId',
    component: 'NRadioGroup',
    label: '是否诉讼',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    field: 'type',
    component: 'NSelect',
    label: '记录方式',
    defaultValue: null,
    giProps: {},
    componentProps: {
      placeholder: '请选择记录方式',
      options: [
        {
          label: '线上制作',
          value: 1
        },
        {
          label: '线下上传',
          value: 2
        }
      ]
    }
  }
]

const handOverSchemas = <FormSchema[]>[
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NSelect',
    label: '移送机关',
    componentProps: {
      placeholder: '请选择移送机关',
      clearable: true
    }
  },
  {
    defaultValue: 1,
    giProps: {},
    field: '',
    component: 'NRadioGroup',
    label: '司法机关是否受理',
    componentProps: {
      placeholder: '请选择',
      labelWidth: 120,
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'userId',
    component: 'NSelect',
    label: '办案人员',
    componentProps: {
      placeholder: '请选择办案人员',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'orgId',
    component: 'NSelect',
    label: '办案机构',
    componentProps: {
      placeholder: '请选择办案机构',
      clearable: true
    }
  }
]

const saveNodeSchemas = <FormSchema[]>[
  {
    defaultValue: null,
    giProps: {},
    field: 'nodeName',
    component: 'NInput',
    label: '节点名称',
    componentProps: {
      placeholder: '请输入节点名称',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'description',
    component: 'NInput',
    label: '节点描述',
    componentProps: {
      placeholder: '请输入节点描述',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'fileId',
    component: 'NUpload',
    label: '上传资料',
    componentProps: {
      placeholder: '请选择移送机关',
      clearable: true
    }
  }
]

export { inspectSchemas, punishSchemas, handOverSchemas, forceSchemas, saveNodeSchemas }

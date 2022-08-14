import { FormSchema } from '@/components/form/src/types/form-type'
import { punishProgramType, StageTypeEnum, reconsiderationEnum, litigationEnum } from '@/views/cause-browse/components/options'
import { NSelect } from 'naive-ui'

const inspectSchemas = <FormSchema[]>[
  {
    field: 'targetId',
    component: 'NSelect',
    label: '检查对象',
    defaultValue: null,
    giProps: {},
    slot: 'targetSlot'
  },
  // {
  //   field: 'createTime',
  //   component: 'NDatePicker',
  //   label: '检查时间',
  //   defaultValue: null,
  //   giProps: {},
  //   componentProps: {
  //     placeholder: '请选择检查时间'
  //   }
  // },
  {
    field: 'userId',
    component: 'NSelect',
    label: '执法人员',
    defaultValue: '',
    giProps: {},
    slot: 'enforceMemberSlot'
  },
  // {
  //   field: '',
  //   component: 'NSelect',
  //   label: '是否产生案件',
  //   defaultValue: null,
  //   giProps: {},
  //   componentProps: {
  //     placeholder: '请选择',
  //     options: [
  //       {
  //         label: '是',
  //         value: 1
  //       },
  //       {
  //         label: '否',
  //         value: 0
  //       }
  //     ]
  //   }
  // },
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
    field: 'causeTypeId',
    componentSource: shallowRef(NSelect),
    label: '违法行为类型',
    componentDataSourceType: 'CauseTypeEnum',
    componentProps: {
      options: [],
      placeholder: '请选择违法行为类型',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'fileCaseStartTime',
    component: 'NDatePicker',
    label: '立案开始时间',
    componentProps: {
      type: 'datetime',
      format: 'yyyy/MM/dd - HH:mm',
      placeholder: '请选择立案开始时间',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'fileCaseEndTime',
    component: 'NDatePicker',
    label: '立案结束时间',
    componentProps: {
      type: 'datetime',
      format: 'yyyy/MM/dd - HH:mm',
      placeholder: '请选择立案结束时间',
      clearable: true
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'orgId',
    label: '办案单位',
    slot: 'orgSlot'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'programTypeId',
    component: 'NSelect',
    label: '适用程序',
    componentProps: {
      placeholder: '请选择适用程序',
      clearable: true,
      options: punishProgramType
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'docCode',
    component: 'NInput',
    label: '文书号',
    componentProps: {
      placeholder: '请输入文书号',
      clearable: true
    }
  },
  {
    field: 'userId',
    label: '执法人员',
    defaultValue: null,
    giProps: {},
    slot: 'enforceMemberSlot'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'stage',
    component: 'NSelect',
    label: '当前阶段',
    componentProps: {
      placeholder: '请选择当前阶段',
      clearable: true,
      options: StageTypeEnum
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: '',
    component: 'NSelect',
    label: '处罚方式',
    componentProps: {
      placeholder: '请选择处罚方式',
      clearable: true,
      options: StageTypeEnum
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'major',
    component: 'NRadioGroup',
    label: '是否重大案件',
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
    defaultValue: null,
    giProps: {},
    field: 'isReconsideration',
    component: 'NRadioGroup',
    label: '是否复议',
    componentProps: {
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ]
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'reconsideration',
    component: 'NSelect',
    label: '复议结果',
    showDisplayControl: 'isReconsideration',
    componentProps: {
      placeholder: '请选择复议结果',
      clearable: true,
      options: reconsiderationEnum
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'isLitigation',
    component: 'NRadioGroup',
    label: '是否诉讼',
    componentProps: {
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ]
    }
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'litigation',
    component: 'NSelect',
    label: '诉讼结果',
    showDisplayControl: 'isLitigation',
    componentProps: {
      placeholder: '请选择诉讼结果',
      clearable: true,
      options: litigationEnum
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
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'approval',
    component: 'NSelect',
    label: '待我审批',
    componentProps: {
      options: [
        {
          label: '待我审批',
          value: '1'
        },
        {
          label: '查询所有',
          value: '0'
        }
      ]
    }
  }
]

const forceSchemas = <FormSchema[]>[
  // {
  //   defaultValue: null,
  //   giProps: {},
  //   field: '',
  //   component: 'NSelect',
  //   label: '强制类型',
  //   componentProps: {
  //     placeholder: '请选择强制类型',
  //     clearable: true
  //   }
  // },
  // {
  //   defaultValue: null,
  //   giProps: {},
  //   field: '',
  //   component: 'NSelect',
  //   label: '强制措施种类',
  //   componentProps: {
  //     placeholder: '请选择强制措施种类',
  //     clearable: true
  //   }
  // },
  // {
  //   defaultValue: null,
  //   giProps: {},
  //   field: '',
  //   component: 'NSelect',
  //   label: '强制执行种类',
  //   componentProps: {
  //     placeholder: '请选择强制执行种类',
  //     clearable: true
  //   }
  // },
  {
    field: 'userId',
    component: 'NSelect',
    label: '办案人员',
    defaultValue: '',
    giProps: {},
    slot: 'enforceMemberSlot'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'orgId',
    component: 'NSelect',
    label: '办案机构',
    slot: 'orgSlot'
  },
  // {
  //   defaultValue: 1,
  //   giProps: {},
  //   field: 'orgId',
  //   component: 'NRadioGroup',
  //   label: '是否复议',
  //   componentProps: {
  //     placeholder: '请选择',
  //     options: [
  //       {
  //         label: '是',
  //         value: 1
  //       },
  //       {
  //         label: '否',
  //         value: 0
  //       }
  //     ]
  //   }
  // },
  // {
  //   defaultValue: 1,
  //   giProps: {},
  //   field: 'orgId',
  //   component: 'NRadioGroup',
  //   label: '是否诉讼',
  //   componentProps: {
  //     placeholder: '请选择',
  //     options: [
  //       {
  //         label: '是',
  //         value: 1
  //       },
  //       {
  //         label: '否',
  //         value: 0
  //       }
  //     ]
  //   }
  // },
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
  // {
  //   defaultValue: null,
  //   giProps: {},
  //   field: '',
  //   component: 'NSelect',
  //   label: '移送机关',
  //   componentProps: {
  //     placeholder: '请选择移送机关',
  //     clearable: true
  //   }
  // },
  // {
  //   defaultValue: 1,
  //   giProps: {},
  //   field: '',
  //   component: 'NRadioGroup',
  //   label: '是否受理',
  //   componentProps: {
  //     placeholder: '请选择',
  //     labelWidth: 120,
  //     options: [
  //       {
  //         label: '是',
  //         value: 1
  //       },
  //       {
  //         label: '否',
  //         value: 0
  //       }
  //     ]
  //   }
  // },
  {
    field: 'userId',
    component: 'NSelect',
    label: '办案人员',
    defaultValue: '',
    giProps: {},
    slot: 'enforceMemberSlot'
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'orgId',
    component: 'NSelect',
    label: '办案机构',
    slot: 'orgSlot'
  }
]

export { inspectSchemas, punishSchemas, handOverSchemas, forceSchemas }

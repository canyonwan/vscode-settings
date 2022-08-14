export const goodsSchemas = <FormSchema[]>[
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

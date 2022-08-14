import { FormSchema } from '@/components/form'
// import { NTreeSelect } from 'naive-ui'
//

export const schemas = [
  {
    field: 'chineseName',
    component: 'NInput',
    label: '名称',
    componentProps: {},
    rules: [{ required: true, message: '请输入中文名称', trigger: ['blur', 'input'] }]
  },
  {
    field: 'description',
    component: 'NInput',
    label: '字段提示语',
    labelMessage: '文书模板需要提示标题的时候需要配置',
    componentProps: {}
  },
  {
    field: 'englishName',
    component: 'NInput',
    label: '字段key',
    componentProps: {},
    rules: [{ required: true, message: '请输入英文名称', trigger: ['blur', 'input'] }]
  },
  {
    field: 'wordModelKey',
    component: 'NInput',
    label: '模板key',
    componentProps: {},
    rules: [{ required: true, message: '请输入模板key', trigger: ['blur', 'input'] }]
  },
  {
    field: 'documentModelDataTypeId',
    component: 'NSelect',
    label: '文书数据类型',
    componentProps: {
      options: [],
      filterable: true
    },
    componentDataSourceType: 'documentModelDataType'
    // rules: [{ required: true, message: '请选择文书数据类型', trigger: ['blur', 'change'] }]
  },
  {
    field: 'baseCauseAttId',
    component: 'NSelect',
    label: '违法行为属性类型',
    componentProps: {
      options: [],
      filterable: true
    },
    componentDataSourceType: 'CaseAttrType'
    // rules: [{ required: true, message: '请选择文书数据类型', trigger: ['blur', 'change'] }]
  },
  {
    field: 'defaultValue',
    component: 'NInput',
    label: '默认值',
    componentProps: {
      type: 'textarea'
    },
    giProps: { span: 2 }
  },
  {
    field: 'groupWordModelKey',
    component: 'NInput',
    label: '分组定位key',
    labelMessage: '字段为分组定位时候需要指明分组key数据(配置多个‘，’号分割，并顺序排序)',
    giProps: { span: 2 },
    componentProps: {
      type: 'textarea'
    }
  },
  {
    field: 'updateSourceDataSql',
    component: 'NInput',
    label: '更新源数据sql',
    giProps: { span: 2 },
    componentProps: {
      type: 'textarea'
    }
  }
] as FormSchema[]

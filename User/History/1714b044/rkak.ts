/**
 * 全部form 组件
 */
export type ComponentType =
  | 'NInput' // n-input
  | 'NInputNumber' // n-input-number
  | 'NInputGroup'
  // | 'NInputPassword'
  // | 'NInputSearch'
  // | 'NInputTextArea'
  // | 'NInputCountDown'
  | 'NAutoComplete' // n-auto-complete
  | 'NDynamicInput' // n-dynamic-input
  | 'NDynamicTags' // n-dynamic-tags
  | 'NMention' // n-mention
  | 'NRadioGroup' // n-radio-group
  | 'NCheckboxGroup' // n-checkbox-group
  | 'NCheckbox' // n-chekcbox
  | 'NColorPicker' // n-color-picker
  | 'NSelect' // n-select
  | 'NTreeSelect' // n-tree-select
  // | 'NRadioButtonGroup'
  | 'NCascader'
  | 'NDatePicker' // n-date-picker
  | 'NTimePicker' // n-time-picker
  | 'NRate' // n-rate
  // | 'NMonthPicker'
  // | 'NRangePicker'
  // | 'NWeekPicker'
  | 'NSwitch' // n-switch
  | 'NStrengthMeter'
  | 'NUpload' // n-upload
  // | 'NIconPicker'
  // | 'NRender'
  | 'NSlider' // n-slider
  | 'NAlert' // n-alert
  | 'Slot'
  | 'SelectRegion' // 选择地区
  | 'PersonnelRole' // 人员角色
  | 'SelectLocation' // 选择经纬度
  | 'SelectLawEnforce' // 选择执法人员

/**
 * 组件数据源获取类型
 * Dictionaries 字典中获取
 * Position 获取职位
 * Department 部门类型
 * Industry 行业类型
 * ProgramType 程序类型
 * documentModelDataType 文书数据类型
 * documentModelType 文书类型
 * documentModelUseWord 文书使用"字"
 * RelaEvidenceType 证据类型
 * DiscretionType 裁量类型
 * DiscretionCalculateType 裁量计算类型
 * RoleType 角色类型
 * ModelType 模型类型
 * EnumsType 枚举类型
 * TipType 提示信息类型
 * CheckedTargetType 检查对象
 */

export type ComponentDataSourceType =
  | 'Dictionaries'
  | 'Position'
  | 'Department'
  | 'Industry'
  | 'ProgramType'
  | 'documentModelDataType'
  | 'documentModelType'
  | 'documentModelUseWord'
  | 'RelaEvidenceType'
  | 'DiscretionType'
  | 'DiscretionCalculateType'
  | 'ApprovalType'
  | 'RoleType'
  | 'ModelType'
  | 'EnumsType'
  | 'TipType'
  | 'CaseAttrType'
  | 'CheckedTargetType'
  | 'CauseTypeEnum'

/**
 * 自定义表单维护地方使用 上面添加 ComponentDataSourceType 和  ComponentDataSourceTypeData 保持一致
 */
export const ComponentDataSourceTypeData = [
  {
    label: '字典',
    value: 'Dictionaries'
  },
  {
    label: '职位',
    value: 'Position'
  },
  {
    label: '部门类型',
    value: 'Department'
  },
  {
    label: '行业类型',
    value: 'Industry'
  },
  {
    label: '程序类型',
    value: 'ProgramType'
  },
  {
    label: '文书数据类型',
    value: 'documentModelDataType'
  },
  {
    label: '文书类型',
    value: 'documentModelType'
  },
  {
    label: '文书使用"字"',
    value: 'documentModelUseWord'
  },
  {
    label: '证据类型',
    value: 'RelaEvidenceType'
  },
  {
    label: '裁量类型',
    value: 'DiscretionType'
  },
  {
    label: '裁量计算类型',
    value: 'DiscretionCalculateType'
  },
  {
    label: '文书审批类型',
    value: 'ApprovalType'
  },
  {
    label: '角色类型',
    value: 'RoleType'
  },
  {
    label: '模型类型',
    value: 'ModelType'
  },
  {
    label: '枚举类型',
    value: 'EnumsType'
  },
  {
    label: '提示信息类型',
    value: 'TipType'
  },
  {
    label: '违法行为属性类型',
    value: 'CaseAttrType'
  },
  {
    label: '违法行为类型',
    value: 'CauseTypeEnum'
  }
]
/**
 * 字段的值的类型
 */
export type FieldValueType = 'string' | 'number' | 'arrayString' | 'arrayNumber'

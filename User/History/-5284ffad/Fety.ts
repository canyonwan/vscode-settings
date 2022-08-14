import { ComponentType, ComponentDataSourceType, FieldValueType } from './index'
import type { CSSProperties } from 'vue'
import type { GridProps, GridItemProps } from 'naive-ui/lib/grid'
import type { ButtonProps } from 'naive-ui/lib/button'
import type { Justify } from 'naive-ui/lib/space/src/Space'
import type { FormItemRule } from 'naive-ui'

export interface FormSchema {
  field: string // 组件字段id
  label: string // 组件 标题名称
  labelMessage?: string // 组件标题提示信息
  labelMessageStyle?: object | string // 组件标题信息的样式
  defaultValue: any // 默认值
  fieldValueType?: FieldValueType // 字段值的类型
  component?: ComponentType // 组件名称
  componentSource?: any // 组件源
  defaultComponentSource?: any // 默认组件源
  componentProps?: any // 组件props
  componentDataSourceType?: ComponentDataSourceType // 组件本身需要的数据源
  componentDataSourceName?: string // 当组件数据源为字典时， 需要查询的字典名称
  slot?: string // 插槽
  rules?: FormItemRule | FormItemRule[] // 验证规则
  giProps: GridItemProps
  isFull?: boolean
  suffix?: string
  type?: string
  useCheckboxForSelect?: boolean
  labelWidth?: number | string
}

export interface FormProps {
  model?: Recordable
  labelWidth?: number | string
  schemas?: FormSchema[]
  inline: boolean
  layout?: string // 按钮的布局
  size: string
  labelPlacement: string // 显示的位置'left' | 'top'
  isFull: boolean // 填满宽度
  buttonPosition?: Justify

  disabled: boolean // 表单禁用
  showLabel: boolean // 是否显示label
  showRequireMark: boolean // 是否显示必填
  requireMarkPlacement: string // * 位置 'left' | 'right'

  showActionButtonGroup?: boolean
  showResetButton?: boolean
  resetButtonOptions?: Partial<ButtonProps>
  showSubmitButton?: boolean
  showAdvancedButton?: boolean
  submitButtonOptions?: Partial<ButtonProps>
  submitButtonText?: string
  resetButtonText?: string
  gridProps: GridProps
  giProps?: GridItemProps
  resetFunc?: () => Promise<void>
  submitFunc?: () => Promise<void>
  submitOnReset?: boolean
  baseGridStyle?: CSSProperties
  showCancelButton?: boolean
  cancelButtonText?: string
}

export interface FormActionType {
  submit: () => Promise<any>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  setFieldsValue: <T>(values: T) => void
  // setFieldsValueByKey: <T>(values: T) => void
  clearValidate: (name?: string | string[]) => Promise<void>
  getFieldsValue: () => Recordable
  resetFields: () => Promise<void>
  validate: (nameList?: any[]) => Promise<any>
}

export type RegisterFn = (formInstance: FormActionType) => void

export type UseFormReturnType = [RegisterFn, FormActionType]

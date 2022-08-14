/**字典接口 */
export interface IDictionaryType {
  displayValue?: string
  createTime?: string
  updateTime?: string
  id?: number
  hiddenValue?: number | string
  type?: string
  remarks?: string
  status?: number | boolean
}

/**
 * 自定义表单接口
 */
export interface ICustomForm {
  id?: string
  fieldDescribe: string | object
  formName: string
  entityTypeId: number
  deptId?: string
  orgId?: string
}
/**
 * 自定义表单绑定数据接口
 */
export interface ICustomFormBind {
  sourceId?: string
  id?: string
  targetList: string | string[]
  type?: string | number
  orgId?: string
  targetId?: string
}
/**
 * 基本类型 (部门类型)
 */
export interface IBaseType {
  id: string
  name: string
  remarks?: string
  whetherCanUpdate?: number
  causeAttrDescribe?: number
  binding?: number
}

export interface ICaseType {
  list?: any
  programTypeId?: number
  dataType?: number
  name: string
  id?: string | null
  whetherParentUseType: number | null
  parentId?: string
  remarks: string
}

/**
 * 地区接口
 */
export interface IRegionType {
  code: string
  name: string
  id: string
  regionLevel: number
  parentId: string
  isLeaf?: boolean
  children?: Array<IRegionType>
}

/**
 * @description 基本数据类型维护
 */
export enum BaseTypesEnum {
  department,
  program,
  evidenceRule
}

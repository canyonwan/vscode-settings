/**
 * @Title 案由维护
 * @desc 7.搜索类型
 */

import { ILawItemType } from '../law/types'
import type { IBaseType, ICaseType } from '../setting/types'

export interface ICauseManageSearchType {
  page: number
  size: number
  total?: number
  name?: string
  lawIdList?: string[]
  causeTagIdList?: string[]
}

/**
 * @Title 案由维护
 * @desc 7.主案由列表
 */
export interface IPrimaryCauseItemType {
  causeSubList?: Array<ICauseSubListItemType>
  name?: string
  id?: string
  causeId?: string
}

export interface ICauseSubListItemType {
  causeId: string
  programTypeId: string
  causeName: any | string
  identifier: string // 案由编号
  illegalSubject: string // 案由主体标签
  orgProperties: string // 机关层级
  penaltyObjectType: string // 检查对象类型
  penaltyObjectTypeList: ICheckedTarget[] // 检查对象类型
  tips: string // 适用提示
  lawList: Array<ILawItemType>
  // deptList: Array<IBaseType> | string[] // 部门集合
  deptList: Array<IBaseType | string> // 部门集合
  name: string
  id: string
  programTypeName: string
  type: number
  caseType?: Array<string>
}

export interface ISaveCause {
  name: string
  lawIdList: string[]
  identifier: string
  illegalSubject: string
  orgProperties: string
  penaltyObjectType: string
  tips: string
  deptList: string[]
  causeTagIdList: string[]
}

// 检查对象
export interface ICheckedTarget {
  id: string
  name: string
}

// 处置方式列表类型
export interface IHandlingWayType {
  id?: string
  causeId: string
  causeSubId: string
  programType: string
  caseTypeList: Array<ICaseType>
  groupList: Array<IGroupType>
  minValue?: number
  maxValue?: number
}
export interface IGroupItemType {
  id?: string
  name: string
  type?: number
}

export interface IGroupType {
  groupName: string
  outputList: IGroupItemType[]
}

// 新增处置方式入参type
export interface ISaveHandlingWayGroupType {
  causeId: string
  causeSubId: string
  evidenceTypeId?: any
  evidenceRuleTypeId?: any
  name: string
  lawId: string
  id?: string
  lawCatalogueId?: string
  type: string // 分组类型( 1通用2部门3机关)
  typeId: string[]
}

// 证据清单分组
export interface IEvidenceGroupType {
  id?: string
  name: string
  evidenceRuleTypeId: string
  evidenceRuleTypeName?: string
  remarks?: string
  caseTypeList?: Array<ICaseType>
  baseEvidenceOutputList?: Array<IEvidenceMenuType>
}

// 子案由基本属性
export interface ISubCauseBaseAttrType {
  id: string
  name: string
  whetherCanUpdate: number
  causeAttrDescribe?: any
  remarks: string
  causeAttrData: ICauseAttrItemType[]
}
export interface ICauseAttrItemType {
  id?: string
  groupDifferentiation: number // 分组名称
  sortId?: string
  causeBasicAttrId: string
  lawId?: string
  dataGroup: string // 是否整组返回
  caseSubLawBindingId: string
  content: string
}

// 证据
// 证据清单
export interface IEvidenceMenuType {
  id?: string
  parentId?: string
  name: string
  whetherRequire: number
  whetherGroup: number
  groupMiniRequire: number
  tips: string
  provMatters: string
  orderId?: number
  relaEvidenceType: string
  evidenceTypeList?: Array<IGroupItemType>
  remarks: string
  addSecondaryMenu?: boolean // 自定义字段 是否是新增子清单
  children?: Array<IEvidenceMenuType>
}
// 裁量类型
export interface IDiscretionType {
  id?: string
  discretionCalculationId: string
  discretionCalculationName: string
  discretionTypeId: string
  discretionTypeName: string
  baseValue: number
  baseKey: string
  minValue: number
  maxValue: number
  tips: string
  relaEvidenceType?: any
  relaEvidenceTypeName: string
  limitMin?: any
  limitMax?: any
  remarks?: any
}
// 裁量分组
export interface IDiscretionGroupType {
  id?: string
  name: string
  remarks: string
}

// 裁量清单

export interface IDiscretionScoreConfType {
  criteriaList: Array<number>
  discretionLevel: number
  remarks?: string
}

export interface IDiscretionMenuType {
  id?: string
  parentId?: string
  name: string
  sortId: number
  whetherGroupType: number
  whetherSelect: number
  selectType: number
  valueType: number
  operatorType: number
  operatorValue: number
  tips: string
  // relaEvidenceType: string
  relaEvidenceType: any
  relaEvidenceTypeList?: Array<IGroupItemType>
  minValue: number
  maxValue: number
  unit: number
  remarks: string
  discretionScoreConf?: Array<IDiscretionScoreConfType>
  children?: Array<IDiscretionMenuType>
  addSubItem?: boolean
}
// 通用绑定入参type
export interface ICommonBindParameterType {
  sourceId: string
  targetList: string[]
}

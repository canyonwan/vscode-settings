import { HttpResponse, FileType } from '@/@types'
import { deleteNoParam } from '@/utils'
import VAxios from './../axios'

/**
 * 模糊查询机关机构信息
 */
export interface OrgFindUnitName {
  organizationId?: string | number // 机关机构id
  organizationType?: number // 1，单位，2事业单位/机关，3机构
  isJustice?: boolean //是否为司法局
  isBusinessUnit?: boolean // 是否为事业单位
  organizationParentId?: string | number // 机关的父id
  orgId4BelongToJusticeId?: string | number // 查询当前单位的上级司法局信息
  filter?: number
}
/**
 * 机关机构 树item
 */
export interface TreeItem {
  key?: string
  id: string
  organizationName: string
  districtType?: number
  isBusinessUnit?: boolean
  organizationType?: 1
  childrenOrganizationInfoOutputs?: TreeItem[]
  isJustice?: boolean
  belongJusticeOrgId?: any
}
/**
 * 地区的modal
 */
export interface District {
  key?: string
  id: string
  name: string
  children: any
}

/**
 * 单位实体
 */
export interface Unit {
  id?: string // 单位id
  districtId: string // 地区id
  districtType: number // 地区类型 1省 2市 3县
  unitOrganizationName: string // 单位名称
  unitOrganizationCode: string // 单位信用编码
  representative: string // 法定代表人姓名
  address: string // 单位地址
  officePhone: string // 办公室电话
  fax: string // 传真
  legalChargePerson: string // 法制部门负责人姓名
  legalChargePersonPhone: string // 法制部门负责人电话
  isJustice: boolean // 是否为司法机关
  account: string // 账号名称
  accountId?: string
  password?: number // 账号密码
  repeatPassword?: number // 确认密码
  threeLimitedPlanFileInputList: FileType[]
  defaultThreeLimitedPlanFileInputList: any
}

/**
 * 组织实体 ， 机关和事业单位
 */
export interface Org {
  id?: string // id
  isBusinessUnit: boolean | null //  是否事业单位
  businessUnitName: string // 组织名称
  parentOrganizationId: string // 父级id
}

/**
 *机构实体
 */
export interface Organization {
  id?: string // id
  password: string // 密码
  repeatPassword: string // 确认密码
  parentOrganizationId: string // 上级组织id
  agencyOrganizationName: string // 机构名称
  leaderName: string // 分管领导
  leaderPosition: string // 分管领导职务
  leaderPhone: string //分管领导电话
  superintendentName: string // 负责人姓名
  superintendentPosition: string // 负责人职务
  superintendentPhone: string // 负责人手机号
  isHaveEnforcementFunctions: boolean | null // 是否有执法智能
  phoneFax: string // 机构电话
  account: string // 账号
  accountId?: string // 账号id
  agencyFunctions: functions[]
  isAccountDelete: boolean
}
/**
 * 机构职能
 */
export interface functions {
  name: string // 职能名称
  enforcementCategoryEnumIds: string[]
}
/**
 * 获取指定行政区划
 * @param id 地区id
 * @returns
 */
export function getDistrictData(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findChildrenDistrictById', { id: id })
}

// 单位类型
export interface UnitType {
  organizationType: number
  isJustice: boolean
  organizationAddress: any
  organizationName: string
  childrenOrganizationInfoOutputs: any
  belongJusticeOrgId: any
  organizationCode: any
  districtType: number
  isBusinessUnit: boolean
  id: string
}

/**
 * 根据地区id 获取 地区的所有单位
 * @param id 地区id
 * @returns
 */
export function getUnitDataByDistrictId(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findOrganizationInfoByDistrictId', { id: id })
}
/**
 * 根据单位id 获取下面所有的 机关机构
 * @param id 地区id
 * @returns
 */
export function getOrgDataByUnitId(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findOrganizationChildrenListByOrganizationId', { id: id })
}
/**
 * 模糊查询机关机构信息
 */
// export function getOrgData(params: OrgFindUnitName): Promise<HttpResponse> {
//   return VAxios.fetchGet('infrastructure/organization/findOrganizationInfoSelective', deleteNoParam(params))
// }

/**
 * 模糊查询机关机构信息
 */
export function getOrgData(params: OrgFindUnitName): Promise<HttpResponse> {
  return VAxios.fetchGet('open/dataFilter/orgFilter', deleteNoParam(params))
}

/**
 * 获取单位详情
 * @param id
 * @returns
 */
export function getUnitDeatil(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findUnitOrganizationDetailById', { id: id })
}
/**
 * 新增修改单位信息
 * @param params
 * @returns
 */
export function editUnit(params: Unit): Promise<HttpResponse> {
  return VAxios.fetchPost('infrastructure/organization/addAndChangeUnitOrganization', { ...params, noQS: 1 })
}

/**
 * 获取单位详情
 * @param id
 * @returns
 */
export function getOrgDeatil(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findBusinessUnitOrganizationDetailById', { id: id })
}
/**
 * 新增修改机关和事业单位信息
 * @param params
 * @returns
 */
export function editOrg(params: Org): Promise<HttpResponse> {
  return VAxios.fetchPost('infrastructure/organization/addAndChangeBusinessUnitOrganization', { ...params, noQS: 1 })
}

/**
 * 获取机构详情
 * @param id
 * @returns
 */
export function getOrganizationDeatil(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findAgencyOrganizationDetailById', { id: id })
}
/**
 * 新增编辑机构
 * @param params
 * @returns
 */
export function editOrganization(params: Organization): Promise<HttpResponse> {
  return VAxios.fetchPost('infrastructure/organization/addAndChangeAgencyOrganization', { ...params, noQS: 1 })
}
/**
 *  获取当前执法种类
 * @returns
 */
export function findEnforcementCategory(): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findEnforcementCategory', {})
}

// /**
//  * 修改机关机构密码
//  */
// export function changeOrganizationPassword(params: any): Promise<HttpResponse> {
//   return VAxios.fetchPost('infrastructure/organization/changeOrganizationPassword', { ...params, noQS: 1 })
// }
/**
 * 删除机构账号
 * @param id
 * @returns
 */
export function removeAgencyOrganizationAccountById(id: string): Promise<HttpResponse> {
  return VAxios.fetchPost('infrastructure/organization/removeAgencyOrganizationAccountById', { id: id })
}
/**
 * 删除单位 机关机构
 * @param id
 * @returns
 */
export function removeUnitOrOrganization(id: string): Promise<HttpResponse> {
  return VAxios.fetchPost('infrastructure/organization/removeOrganizationById', { id: id })
}
export interface OrganizationSearch {
  id: string
  isEnforcementAgency: boolean // 是否执法机构
  pageIndex: number
  pageSize: number
}
/**
 * 根据单位 机构获取 机构详情数据 列表
 * @returns
 * @param param
 */
export function getOrganizationList(param: OrganizationSearch): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findChildrenAgencyOrganizationInfoListById', param)
}

/**
 * 依据指定条件获取对应单位信息集合
 * 根据层级
 * @param param
 */
export function getUnitListWithLevel(param: any): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/organization/findOrgInfoListSelective', param)
}

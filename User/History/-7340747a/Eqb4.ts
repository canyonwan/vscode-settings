import type { IBaseType, IDeptBindCause, IDeptBindLaw } from '@/api/setting/types'
import type { IResult } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'

const ServerName = RequestServerEnum.EnforceBase

/**
 * @Title 部门类型
 * 新增/更新部门类型
 * @param params
 */
export function saveBaseType(params: IBaseType): Promise<Recordable<IBaseType>> {
  return http.request(
    {
      url: `${ServerName}departmentType/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * 删除部门类型
 * @param id
 */
export function deleteDepartmentType(id: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}departmentType/info/`,
      method: RequestEnum.DELETE,
      params: id
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 根据部门类型id查询绑定的法标签
 * @param departmentTypeId
 */
export function getBoundLawTag(departmentTypeId: string) {
  return http.request({
    url: `${ServerName}departmentBound/findLawTag`,
    method: RequestEnum.GET,
    params: { departmentTypeId: departmentTypeId }
  })
}

/**
 * 部门绑定法标签
 * @param params
 */
export function boundLawTag(params: IDeptBindLaw) {
  return http.request(
    {
      url: `${ServerName}departmentBound/boundLawTag`,
      method: RequestEnum.POST,
      params: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 根据部门类型id查询绑定的违法行为标签
 * @param departmentTypeId
 */
export function getBoundCauseTag(departmentTypeId: string) {
  return http.request({
    url: `${ServerName}departmentBound/findCauseTag`,
    method: RequestEnum.GET,
    params: { departmentTypeId: departmentTypeId }
  })
}

/**
 * 部门绑定违法行为标签
 * @param params
 */
export function boundCauseTag(params: IDeptBindCause) {
  return http.request(
    {
      url: `${ServerName}departmentBound/boundCauseTag`,
      method: RequestEnum.POST,
      params: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 查询部门类型列表
 */
export function queryDepartmentTypes(): Promise<IBaseType[]> {
  return http.request({
    url: `${ServerName}departmentType/list`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 程序类型
 * 查询程序类型
 */
export function queryProgramTypes(): Promise<Recordable<IBaseType[]>> {
  return http.request({
    url: `${ServerName}programType/list`,
    method: RequestEnum.GET
  })
}

/**
 * 删除程序类型
 * @param id
 */
export function deleteProgramType(id: number): Promise<IResult> {
  return http.request(
    {
      url: `${ServerName}programType/info/`,
      method: RequestEnum.DELETE,
      params: id
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 新增/更新程序类型
 * @param params
 */
export function saveProgramType(params: IBaseType): Promise<Recordable<IBaseType>> {
  return http.request(
    {
      url: `${ServerName}programType/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/** 证据规则类型
 *  查询证据规则类型
 */
export function queryEvidenceRuleTypes(): Promise<IBaseType[]> {
  return http.request({
    url: `${ServerName}evidenceRuleType/list`,
    method: RequestEnum.GET
  })
}
/** 证据规则类型
 *  查询证据规则类型
 */
export function deleteEvidenceRuleTypes(id: number): Promise<void> {
  return http.request({
    url: `${ServerName}evidenceRuleType/info/${id}`,
    method: RequestEnum.DELETE
  })
}
/** 证据规则类型
 *  查询证据规则类型
 */
export function saveEvidenceRuleType(params: IBaseType): Promise<Recordable<IBaseType>> {
  return http.request(
    {
      url: `${ServerName}evidenceRuleType/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/** 违法行为基本属性
 *  删除违法行为基本属性
 */
export function deleteCauseBaseAttrs(id: number): Promise<void> {
  return http.request({
    url: `${ServerName}causeBasicAttrContent/info/${id}`,
    method: RequestEnum.DELETE
  })
}

/** 违法行为基本属性
 *  查询违法行为基本属性列表
 */
export function queryCauseBaseAttrs(): Promise<IBaseType[]> {
  return http.request({
    url: `${ServerName}causeBasicAttrContent/list`,
    method: RequestEnum.GET
  })
}
/** 违法行为基本属性
 *  操作违法行为基本属性
 */
export function saveCauseBaseAttrs(params: IBaseType): Promise<Recordable<IBaseType>> {
  return http.request(
    {
      url: `${ServerName}causeBasicAttrContent/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

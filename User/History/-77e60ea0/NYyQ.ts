import type { IResult } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import { ICaseType } from '@/api/setting/types'

const ServerName = RequestServerEnum.EnforceBase

/**
 * @Title 案件类型
 * @desc 新增/更新案件类型
 * @param params
 */
export function saveCaseType(params: ICaseType): Promise<Recordable<ICaseType>> {
  return http.request(
    {
      url: `${ServerName}caseType/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 案件类型
 * @desc  删除
 * @param id
 */
export function deleteCaseType(id: string): Promise<Recordable<void>> {
  return http.request(
    {
      url: `${ServerName}caseType/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 案件类型
 * @desc  查询[子案件类型]集合数据
 * @param id
 */
export function queryChildCaseTypes(id: number): Promise<IResult<ICaseType[]>> {
  return http.request({
    url: `${ServerName}caseType/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 案件类型
 * @desc  查询[案件类型]下的全部数据 树形结构
 */
export function queryCaseTypesTree(): Promise<ICaseType[]> {
  return http.request({
    url: `${ServerName}caseType/list/subList`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 案件类型
 * @desc  为案件类型绑定违法行为基本属性
 */
export function bindCauseAttrsForCaseType(params: any): Promise<ICaseType[]> {
  return http.request(
    {
      url: `${ServerName}caseTypeCauseAttBinding/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * @Title 案件类型
 * @desc  查询案件类型下的违法行为基本属性
 */
export function queryCauseAttrsWithCaseType(id: string): Promise<ICaseType[]> {
  return http.request({
    url: `${ServerName}caseTypeCauseAttBinding/causeAtt/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 案件类型
 * @desc  为案件类型绑定证据规则
 */
export function bindEvidenceRuleForCaseType(params: any): Promise<ICaseType[]> {
  return http.request(
    {
      url: `${ServerName}evidenceRuleTypeCaseTypeBinding/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 案件类型
 * @desc  查询该案件类型下的证据规则
 */
export function queryEvidenceRuleWithCaseType(caseTypeId: string): Promise<ICaseType[]> {
  return http.request({
    url: `${ServerName}evidenceRuleTypeCaseTypeBinding/evidenceRuleType/list/${caseTypeId}`,
    method: RequestEnum.GET
  })
}

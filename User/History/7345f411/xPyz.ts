// 案件类型(处置方式)
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICaseType } from '../setting/types'
import type { IHandlingWayType, ISaveHandlingWayGroupType, ISubCauseBaseAttrType } from './types'
// 违法行为维护
const ServerName = RequestServerEnum.CauseManage
const BaseServerName = RequestServerEnum.BASE
/**
 * @Title 违法行为维护
 * @desc 法 -> 查询处置方式列表
 * @params id
 */
export function queryHandlingWayList(id: string): Promise<IHandlingWayType[]> {
  return http.request({
    url: `${ServerName}causeSubLaw/info/getCaseType/${id}`,
    method: RequestEnum.GET
  })
}
/**
 * @Title 违法行为维护
 * @desc 法 -> 新增处置方式
 * @params params
 */
export function saveHandlingWay(params: any): Promise<ICaseType[]> {
  return http.request(
    {
      url: `${ServerName}causeSubLaw/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 新增分组
 * @params params
 */
export function saveHandlingWayGroup(params: ISaveHandlingWayGroupType): Promise<ICaseType[]> {
  return http.request(
    {
      url: `${BaseServerName}caseTypeEvidenceTypeBinding/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分组详情
 */
export function queryGroupDetail(id: string): Promise<ISaveHandlingWayGroupType> {
  return http.request({
    url: `${BaseServerName}caseTypeEvidenceTypeBinding/info/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分组详情 -> 删除处置方式
 */
export function deleteHandingWayItem(id: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeSubLaw/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分组详情 -> 删除分组
 */
export function deleteGroupItem(id: string): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}caseTypeEvidenceTypeBinding/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分组详情 -> 基本属性 -> 获取违法行为基本属性
 */
export function queryCauseBaseAtrForSelect(ids: string[]): Promise<ISubCauseBaseAttrType[]> {
  return http.request({
    url: `${BaseServerName}caseTypeCauseAttBinding/causeAttByCaseType/list`,
    method: RequestEnum.POST,
    data: ids
  })
}

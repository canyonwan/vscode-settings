// 案件类型(证据)
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IEvidenceGroupType, IEvidenceMenuType, IGroupItemType } from './types'
import type { ICaseType } from '../setting/types'
import { IResultPage } from '@/utils/axios/types'

// 证据
const ServerName = RequestServerEnum.BASE
const EnforceBaseServerName = RequestServerEnum.EnforceBase
/**
 * @Title 违法行为维护
 * @desc 法 -> 查询已绑定的证据清单分组列表
 * @params id
 */
export function queryBoundEvidenceGroups(id: string): Promise<IEvidenceGroupType[]> {
  return http.request({
    url: `${ServerName}eviRuleGroupBingDing/eviGroup/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 查询全部的证据清单
 * @params id
 */
export function queryEvidenceMenuSources(id: string): Promise<IEvidenceMenuType[]> {
  return http.request({
    url: `${EnforceBaseServerName}eviGroupBingDing/group/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 根据证据分组查询所有证据清单
 * @params id
 */
export function queryBoundMenusWithEvidenceGroup(evidenceGroupId: string): Promise<IEvidenceMenuType[]> {
  return http.request({
    url: `${ServerName}eviGroupBingDing/group/list/${evidenceGroupId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 给子案由下的分组绑定选择的证据分组
 * @params id
 */
export function bindEvidenceGroup(params: any): Promise<void> {
  return http.request(
    {
      url: `${ServerName}eviRuleGroupBingDing/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 获取所有证据类型
 * @params id
 */
export function queryAllEvidenceType(): Promise<IGroupItemType[]> {
  return http.request({
    url: `${ServerName}evidenceType/list`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 给子案由下的分组绑定选择的证据分组
 * @params id
 */
export function queryEvidenceMenuForPage(params: any): Promise<IResultPage<IEvidenceMenuType[]>> {
  return http.request({
    url: `${ServerName}evidence/list`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 为证据分组绑定证据清单
 * @params id
 */
export function bindEvidenceMenuForEvidenceGroup(params: any): Promise<IResultPage<IEvidenceMenuType[]>> {
  return http.request({
    url: `${ServerName}eviGroupBingDing/info`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 保存证据清单
 * @params id
 */
export function saveEvidenceMenu(params: IEvidenceMenuType): Promise<void> {
  return http.request(
    {
      url: `${EnforceBaseServerName}evidence/info`,
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
 * @desc 法 -> 删除某个删除清单
 * @params id
 */
export function deleteEvidenceMenu(id: string): Promise<void> {
  return http.request(
    {
      url: `${EnforceBaseServerName}evidence/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 查询证据规则类型
 * @params 证据规则类型id
 */
export function queryEvidenceRuleTypeList(evidenceRuleTypeId: string): Promise<ICaseType[]> {
  return http.request({
    url: `${EnforceBaseServerName}evidenceRuleTypeCaseTypeBinding/caseType/list/${evidenceRuleTypeId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分页查询证据分组表
 */
export function queryEvidenceGroupTable(params: any): Promise<IResultPage<IEvidenceGroupType[]>> {
  return http.request({
    url: `${ServerName}evidenceDetailedListGroup/page`,
    method: RequestEnum.POST,
    data: params
  })
}
/**
 * @Title 违法行为维护
 * @desc 法 -> 获取全部的证据分组
 */
export function queryAllEvidenceGroupList(): Promise<IEvidenceGroupType[]> {
  return http.request({
    url: `${ServerName}evidenceDetailedListGroup/list`,
    method: RequestEnum.GET
  })
}
/**
 * @Title 违法行为维护
 * @desc 新增证据分组
 */
export function saveEvidenceGroup(params: any): Promise<void> {
  return http.request(
    {
      url: `${ServerName}evidenceDetailedListGroup/info`,
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
 * @desc 新增证据分组
 */
export function deleteEvidenceGroup(id: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}evidenceDetailedListGroup/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICommonBindParameterType, IDiscretionGroupType, IDiscretionMenuType, IDiscretionType, IEvidenceGroupType, IGroupItemType } from './types'
import type { IResultPage } from '@/utils/axios/types'

const BaseServerName = RequestServerEnum.BASE

/**
 * @Title 违法行为维护
 * @desc 法 -> 获取裁量类型基础表
 * @params id
 */
export function queryDiscretionTypeList(params: any): Promise<IResultPage<IDiscretionType[]>> {
  return http.request({
    url: `${BaseServerName}discretion/list`,
    method: RequestEnum.GET,
    params: params
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 获取裁量类型基础表
 * @params id
 */
export function deleteDiscretionType(id: string): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretion/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 保存裁量类型基础表
 * @params id
 */
export function saveDiscretionType(params: IDiscretionType): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretion/info`,
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
 * @desc 法 -> 获取所有裁量类型
 * @params id
 */
export function queryAllDiscretionType(): Promise<IGroupItemType[]> {
  return http.request({
    url: `${BaseServerName}discretionType/list`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 获取所有裁量计算类型(方式)
 * @params id
 */
export function queryAllDiscretionCalculateType(): Promise<IGroupItemType[]> {
  return http.request({
    url: `${BaseServerName}discretionCalculationType/list`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分页获取裁量清单
 * @params
 */
export function queryAllDiscretionMenu(params: any): Promise<IResultPage<IDiscretionMenuType[]>> {
  return http.request({
    url: `${BaseServerName}discretionDetailList/list`,
    method: RequestEnum.GET,
    params: params
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 删除裁量清单
 * @params
 */
export function deleteDiscretionMenu(id: string): Promise<void> {
  return http.request({
    url: `${BaseServerName}discretionDetailList/info/${id}`,
    method: RequestEnum.DELETE
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 新增/编辑裁量清单
 * @params
 */
export function saveDiscretionMenu(params: IDiscretionMenuType): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretionDetailList/info`,
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
 * @desc 法 -> 根据案件类型下的分组id查询已绑定的裁量分组(30-2)
 * @params
 */
export function queryBoundDiscretionGroups(groupId: string): Promise<IDiscretionGroupType[]> {
  return http.request({
    url: `${BaseServerName}discretionGroupRuleGroupBinding/eviGroup/list/${groupId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 为处置方式(案件类型)分组绑定裁量分组(30-1)
 * @params
 */
export function bindDiscretionGroupForHandlingWayGroup(params: ICommonBindParameterType): Promise<IDiscretionGroupType[]> {
  return http.request({
    url: `${BaseServerName}discretionGroupRuleGroupBinding/info`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 分页查询全部的裁量分组(29-5)
 * @params
 */
export function queryDiscretionGroupsForPage(params: any): Promise<IResultPage<IDiscretionGroupType[]>> {
  return http.request({
    url: `${BaseServerName}discretionGroup/list`,
    method: RequestEnum.GET,
    params: params
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 根据裁量分组查询裁量类型基础(32-2)
 * @params
 */
export function queryDiscretionTypesWithDiscretionGroup(id: string): Promise<IDiscretionType[]> {
  return http.request({
    url: `${BaseServerName}discretionRuleGroupBinding/group/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 给裁量分组绑定裁量类型(32-1)
 * @params
 */
export function bindDiscretionTypeForDiscretionGroup(params: ICommonBindParameterType): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretionRuleGroupBinding/info`,
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
 * @desc 法 -> 根据裁量分组查询裁量清单(34-2)
 * @params
 */
export function queryDiscretionMenuWithDiscretionGroup(id: string): Promise<IDiscretionMenuType[]> {
  return http.request({
    // url: `${BaseServerName}discretionGroupDetailBinding/group/list/${id}`,
    url: `${BaseServerName}discretionGroupDetailBinding/group/tree/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 法 -> 给裁量分组绑定裁量清单(34-1)
 * @params
 */
export function bindDiscretionMenuForDiscretionGroup(params: ICommonBindParameterType): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretionGroupDetailBinding/info`,
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
 * @desc 法 -> 新增/编辑裁量分组(29-3)
 * @params
 */
export function saveDiscretionGroup(params: IDiscretionGroupType): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretionGroup/info`,
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
 * @desc 法 -> 删除裁量分组(29-2)
 * @params
 */
export function deleteDiscretionGroup(id: string): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}discretionGroup/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 根据裁量类型查询证据分组集合
 * @params
 */
export function queryEvidenceGroupListWithDiscretionType(discretionTypeId: string): Promise<IEvidenceGroupType[]> {
  return http.request({
    url: `${BaseServerName}baseDiscretionTypeBdEviGroup/getEviGroupByDiscretionType/${discretionTypeId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 裁量类型表绑定证据分组
 * @params
 */
export function saveEvidenceGroupForDiscretionType(params: any): Promise<void> {
  return http.request(
    {
      url: `${BaseServerName}baseDiscretionTypeBdEviGroup/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

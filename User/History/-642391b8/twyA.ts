import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IUnlawfulActTagLeaf, ISearchUnlawfulActTree } from './types'

const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 案由浏览
 * @desc 案由tree 违法行为选择标签列表--新接口
 * @desc 接口ID：26802150
 *
 */
export function queryUnlawfulActTagTree(params: ISearchUnlawfulActTree): Promise<IUnlawfulActTagLeaf[]> {
  return http.request({
    url: `${ServerName}causeTag/list/filterCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * @Title 案由浏览
 * @desc 案由tree 违法行为选择标签列表--新接口
 * @desc 接口ID：26802150
 *
 */
export function queryUnlawfulActList(params: any): Promise<IUnlawfulActTagLeaf[]> {
  return http.request({
    url: `${ServerName}causeSub/list/cause/byCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}

import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IUnlawfulActTagLeaf, ISearchUnlawfulActTree, IUnlawfulActItem } from './types'

const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 违法行为浏览
 * @desc 违法行为tree 违法行为选择标签列表--新接口
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
 * @Title 违法行为浏览
 * @desc 违法行为tree 违法行为查询
 * @desc 接口ID：27010153
 *
 */
export function queryUnlawfulActList(params: ISearchUnlawfulActTree): Promise<IUnlawfulActItem[]> {
  return http.request({
    url: `${ServerName}causeSub/list/cause/byCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}
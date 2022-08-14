import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import type { IEvidenceGroupType } from '../cause-manage/types'
const serverName = RequestServerEnum.EnforceBase

/**
 * 查询证据清单名称
 *@param name
 */
export function queryEvidenceName(name) {
  return http.request({
    url: `${serverName}evidence/getDistinctNameList`,
    method: RequestEnum.GET,
    params: { name: name }
  })
}

/**
 * 查询证据证明事项
 *@param params
 */
export function queryEvidenceMatter(params) {
  return http.request({
    url: `${serverName}evidence/getDistinctProvMattersList`,
    method: RequestEnum.GET,
    params: params
  })
}

/**
 * 查询证据列表->案由浏览 -> 违法行为列表->证据列表
 *@param groupId
 */
export function queryEvidenceGroupsFromUnlawfulAct(groupId: string): Promise<IEvidenceGroupType[]> {
  return http.request({
    url: `${serverName}evidence/getEvidenceByGroupId/${groupId}`,
    method: RequestEnum.GET
  })
}

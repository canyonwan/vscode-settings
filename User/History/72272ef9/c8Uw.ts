import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
const serverName = RequestServerEnum.EnforceBase

/**
 * 查询证据清单名称
 *@param {*参数} name
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
 *@param {*参数} params
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
 *@param {*参数} params
 */
export function queryEvidenceListForUnlawfulAct(groupId: string) {
  return http.request({
    url: `${serverName}evidence/getEvidenceByGroupId/${groupId}`,
    method: RequestEnum.GET
  })
}

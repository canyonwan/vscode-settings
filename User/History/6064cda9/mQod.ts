import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import { IBindEvidenceFile, IEvidenceInfo, IEvidenceParams } from './types'
const serverName = RequestServerEnum.Workflow

/**
 * 查询证据列表
 *@param {*参数} params
 */
export function queryEvidenceData(params: Partial<IEvidenceParams>) {
  return http.request({
    url: `${serverName}evidence/changeableInfo`,
    method: RequestEnum.GET,
    params: params
  })
}

/**
 * 查询证据详情
 *@param {*参数} params
 */
export function queryEvidenceDetail(id) {
  return http.request({
    url: `${serverName}evidence/info/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 保存证据
 *@param {*参数} params
 */
export function saveEvidenceDetail(params: IEvidenceInfo) {
  return http.request({
    url: `${serverName}evidence/info`,
    method: RequestEnum.POST,
    params: params
  })
}

/**
 * 删除证据
 *@param {*参数} params
 */
export function deleteEvidence(id) {
  return http.request({
    url: `${serverName}evidence/delEvidence/${id}`,
    method: RequestEnum.DELETE
  })
}

/**
 * 绑定证据文件
 *@param {*参数} params
 */
export function bindingEvidenceFile(params: IBindEvidenceFile) {
  return http.request({
    url: `${serverName}evidence/bindingEvidenceFile`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 删除绑定关系（裁量-证据文件）
 *@param {*参数} id
 */
export function cancelBoundEvidenceFile(id: string) {
  return http.request({
    url: `${serverName}evidence/delFocusRelation/${id}`,
    method: RequestEnum.DELETE
  })
}

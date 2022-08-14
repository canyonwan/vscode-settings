import { ContentTypeEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import { IResultPage } from '@/utils/axios/types'
import { IFileItem } from '../program/types'
import { IPersonnelInfo } from './types'
const serverName = RequestServerEnum.USER

/**
 * 条件查询人员
 *@param {*参数} params
 */
export function queryPersonnel(params): Promise<IResultPage<IPersonnelInfo[]>> {
  return http.request({
    url: `${serverName}user/list`,
    method: RequestEnum.POST,
    params: params
  })
}

/**
 * 查询维护人员信息列表
 *@param {*参数} params
 */
export function queryManager(params): Promise<IResultPage<IPersonnelInfo[]>> {
  return http.request({
    url: `${serverName}user/manager/list`,
    method: RequestEnum.POST,
    params: params
  })
}

/**
 * .人员信息新增修改
 *@param {*参数} params 新增POST 编辑PUT
 */
export function addEditPersonnel(params) {
  return http.request(
    {
      url: `${serverName}user/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      params: params
    },
    {
      successMessageText: '保存成功！'
    }
  )
}
/**
 * 查询人员信息
 *@param {*参数} params
 */
export function queryPersonnelInfo(id): Promise<IPersonnelInfo> {
  return http.request({
    url: `${serverName}user/info/${id}`,
    method: RequestEnum.GET,
    params: {}
  })
}
/**
 * 重置密码
 *@param {*参数} params
 */
export function resetPersonnelPassword(params) {
  return http.request(
    {
      url: `${serverName}user/resetPwd`,
      method: RequestEnum.POST,
      params: params
    },
    {
      successMessageText: '重置密码成功！'
    }
  )
}
/**
 * 删除人员
 *@param {*参数} params
 */
export function deletePersonnel(id) {
  return http.request(
    {
      url: `${serverName}user/info/${id}`,
      method: RequestEnum.DELETE,
      params: {}
    },
    {
      successMessageText: '删除成功！'
    }
  )
}
/**
 * 获取用户个人信息
 * @returns
 */
export function getUserInfo() {
  return http.request({
    // url: `${serverName}user/queryUserData`,
    url: `${serverName}user/queryUserData`,
    method: RequestEnum.GET
  })
}

/**
 * 人员导
 * @param params
 */
export function importPersonnel(params: { file: any; orgId: string }): Promise<IFileItem> {
  return http.request({
    url: `${serverName}user/import`,
    method: RequestEnum.POST,
    data: params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_DATA }
  })
}

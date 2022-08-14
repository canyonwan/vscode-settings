// {{base}}/appVersion/versionList
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IAppPackageItem, IAppVersionDetail } from './types'

const serverName = RequestServerEnum.BASE

/**
 * 获取安装包分页
 *@param {*参数} params
 */
export function queryAppPackageList(params): Promise<IResultPage<IAppPackageItem[]>> {
  return http.request({
    url: `${serverName}appVersion/versionList`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 发布最新安装包
 *@param {*参数} params
 */
export function publishLatestApp(params: IAppPackageItem): Promise<void> {
  return http.request(
    {
      url: `${serverName}appVersion/saveVersion`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 获取app版本详情
 *@param {*参数} appId
 */
export function getAppVersionDetail(appId: string): Promise<IAppVersionDetail> {
  return http.request({
    url: `${serverName}appVersion/viewDetails`,
    method: RequestEnum.GET,
    params: { appId }
  })
}

/**
 * 获取当前App绑定的部门
 *@param  appId
 */
export function queryBoundDeptForApp(appId: string): Promise<IAppVersionDetail> {
  return http.request({
    url: `${serverName}appVersion/getDeptByApp`,
    method: RequestEnum.GET,
    params: { appId }
  })
}

/**
 * 获取当前App绑定的机关
 *@param  appId
 */
export function queryBoundOrgForApp(appId: string): Promise<IAppVersionDetail> {
  return http.request({
    url: `${serverName}appVersion/getOrgByApp`,
    method: RequestEnum.GET,
    params: { appId }
  })
}

/**
 * 为App绑定部门
 *@param {*参数} params
 */
export function bindDeptForApp(params: { appId: string; idList: string[] }): Promise<void> {
  return http.request(
    {
      url: `${serverName}appVersion/bindDept`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 为app绑定机关
 *@param {*参数} params
 */
export function bindOrgForApp(params: { appId: string; idList: string[] }): Promise<void> {
  return http.request(
    {
      url: `${serverName}appVersion/bindOrg`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

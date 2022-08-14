// {{base}}/appVersion/versionList
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IAppPackageItem } from './types'

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
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 发布最新安装包
 *@param {*参数} params
 */
export function bindDeptForApp(params: {appId: string, idList: []string}): Promise<void> {
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

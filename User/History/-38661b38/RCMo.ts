// {{base}}/appVersion/versionList
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IAppPackageItem } from './types'

const serverName = RequestServerEnum.BASE

/**
 * 获取安装包分页
 *@param {*参数} params
 */
export function queryDictionaries(params): Promise<IResultPage<IAppPackageItem[]>> {
  return http.request({
    url: `${serverName}appVersion/versionList`,
    method: RequestEnum.POST,
    data: params
  })
}

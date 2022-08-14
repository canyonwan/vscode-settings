// {{base}}/appVersion/versionList
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import type { IDictionaryType } from '@/api/setting/types'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'

const serverName = RequestServerEnum.BASE

/**
 * 获取安装包分页
 *@param {*参数} params
 */
export function queryDictionaries(params): Promise<Recordable<IDictionaryType[]>> {
  return http.request({
    url: `${serverName}appVersion/versionList`,
    method: RequestEnum.GET,
    params: params
    // headers: { ignoreCancelToken: true }
  })
}

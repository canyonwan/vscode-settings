import type { IFileInfo } from '@/api/types'
import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
import { IResultPage } from '@/utils/http/axios/types'
const serverName = RequestServerEnum.BASE

/**
 * 获取商品列表
 * @returns
 */
export function queryGoodsList(params: any): Promise<IResultPage<IFileInfo[]>> {
  return http.request({
    url: `${serverName}goods/page`,
    method: RequestEnum.GET,
    params: params
  })
}

import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
import type { IResultPage } from '@/utils/http/axios/types'
import type { IBannerItem } from './types'

const serverName = RequestServerEnum.BASE

/**
 * 获取轮播图列表
 * @returns
 */
export function queryBannerList(params: any): Promise<IResultPage<IBannerItem[]>> {
  return http.request({
    url: `${serverName}goods/page`,
    method: RequestEnum.GET,
    params: params
  })
}
/**
 * 删除
 * @returns
 */
export function queryBannerList(params: any): Promise<IResultPage<IBannerItem[]>> {
  return http.request({
    url: `${serverName}rotationMap/save`,
    method: RequestEnum.GET,
    params: params
  })
}

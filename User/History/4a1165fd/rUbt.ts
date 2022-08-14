import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
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
 * 获取轮播图详情
 * @returns
 */
export function queryBannerDetail(id: string): Promise<IResultPage<IBannerItem[]>> {
  return http.request({
    url: `${serverName}rotationMap/get/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 保存
 * @returns
 */
export function changeBannerSwiper(params: IBannerItem): Promise<IResultPage<IBannerItem[]>> {
  return http.request(
    {
      url: `${serverName}rotationMap/save`,
      method: RequestEnum.POST
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

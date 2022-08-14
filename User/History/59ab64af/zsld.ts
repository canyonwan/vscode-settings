import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
import { IResultPage } from '@/utils/http/axios/types'
import { IGoodsItem } from './types'
const serverName = RequestServerEnum.GOODS

/**
 * 获取商品列表
 * @returns
 */
export function queryGoodsList(params: any): Promise<IResultPage<IGoodsItem>> {
  return http.request({
    url: `${serverName}goods/page`,
    method: RequestEnum.GET,
    params: params
  })
}

/**
 * 获取商品详情
 * @returns
 */
export function queryGoodsDetail(id: string): Promise<IGoodsItem> {
  return http.request({
    url: `${serverName}goods/get/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 获取商品详情
 * @returns
 */
export function deleteGoodsItem(id: string): Promise<void> {
  return http.request(
    {
      url: `${serverName}goods/del/{${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 操作商品
 * @returns
 */
export function saveGoods(params: IGoodsItem): Promise<void> {
  return http.request(
    {
      url: `${serverName}goods/save`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

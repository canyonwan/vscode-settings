import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
import { IResult, IResultPage } from '@/utils/http/axios/types'
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
 * 获取商品列表
 * @returns
 */
export function queryGoodsDetail(params: any): Promise<IResult<IGoodsItem>> {
  return http.request({
    url: `${serverName}goods/get/{id}`,
    method: RequestEnum.GET,
    params: params
  })
}

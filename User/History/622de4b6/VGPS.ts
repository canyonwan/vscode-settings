import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'
import type { IGoodsCateItem, IGoodsCates, IGoodsItem } from './types'

const serverName = RequestServerEnum.GOODS
/**
 * 商品列表
 *
 */
export function queryGoodsList(data: any): Promise<IGoodsItem> {
  return request?.get?.(`${serverName}goods/page`, data, { noAuth: true })
}

/**
 * 商品详情
 *
 */
export function fetchGoodsDetail(data) {
  return request?.get?.('/product/detail', data, { noAuth: true })
}

/**
 * 商品分类
 *
 */
export function queryGoodsCates(): Promise<IGoodsCateItem[]> {
  return request?.get?.(`${serverName}goodsType/tree`, {}, { noAuth: true })
}

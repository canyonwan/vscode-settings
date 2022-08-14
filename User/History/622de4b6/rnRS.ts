import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'
import type { IGoodsItem } from './types'

const serverName = RequestServerEnum.GOODS
/**
 * 精选课程
 *
 */
export function queryGoodsList(data): Promise<IGoodsItem> {
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
export function queryGoodsCates() {
  return request?.get?.(`${serverName}goodsType/tree`, {}, { noAuth: true })
}

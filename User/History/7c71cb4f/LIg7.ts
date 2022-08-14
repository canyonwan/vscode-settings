import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'

const serverName = RequestServerEnum.GOODS
/**
 * 获取商品列表
 *
 */
export function queryGoodsList(data) {
  return request?.get?.(`${serverName}goods/page`, data, { noAuth: true })
}

/**
 * 商品详情
 *
 */
export function fetchGoodsDetail(data) {
  return request?.get?.('/product/detail', data, { noAuth: true })
}

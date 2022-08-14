import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'

const serverName = RequestServerEnum.GOODS
/**
 * 精选课程
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

/**
 * 商品分类
 *
 */
export function queryGoodsCates() {
  return request?.get?.(`${serverName}goodsType/tree`, {}, { noAuth: true })
}

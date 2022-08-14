import request from '@/utils/request'
const serverName = RequestServerEnum.GOODS

/**
 * 精选课程
 *
 */
export function fetchRecommendGoodsList(data) {
  return request?.get?.('/goods/page', data, { noAuth: true })
}

/**
 * 商品详情
 *
 */
export function fetchGoodsDetail(data) {
  return request?.get?.('/product/detail', data, { noAuth: true })
}

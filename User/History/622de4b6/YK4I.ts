import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'
import { IResultPage } from '@/utils/types'
import type { IGoodsCateItem, IGoodsCates, IGoodsContent, IGoodsItem } from './types'

const serverName = RequestServerEnum.GOODS

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

/**
 * 商品分类下的商品分页列表
 * @param 商品名 data.name
 * @param 商品类型ID data.goodsTypeId
 */
export function queryGoodsPageWithCate(data: {
  goodsTypeId: string
  name?: string
}): Promise<IResultPage<IGoodsContent[]>> {
  return request?.get?.(`${serverName}goods/page`, data, { noAuth: false })
}

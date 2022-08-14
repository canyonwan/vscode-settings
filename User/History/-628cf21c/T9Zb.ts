import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'

const serverName = RequestServerEnum.GOODS
/**
 * 商品列表
 *
 */
export function queryGoodsList(data: any): Promise<IGoodsItem> {
  return request?.get?.(`${serverName}goods/page`, data, { noAuth: true })
}

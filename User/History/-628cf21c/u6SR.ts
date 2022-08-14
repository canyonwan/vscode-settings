import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'

const serverName = RequestServerEnum.BASE
/**
 * 商品列表
 *
 */
export function queryBannerList(data: any): Promise<void> {
  return request?.get?.(`${serverName}rotationMap/changeableInfo`, data, { noAuth: true })
}

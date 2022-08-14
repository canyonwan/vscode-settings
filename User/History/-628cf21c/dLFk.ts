import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'

const serverName = RequestServerEnum.BASE
/**
 * 首页轮播图
 *
 */
export function queryBannerList(): Promise<void> {
  return request?.get?.(`${serverName}rotationMap/changeableInfo`, {}, { noAuth: true })
}

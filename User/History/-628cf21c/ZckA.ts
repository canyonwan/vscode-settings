import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'
import type { IBannerItem } from './types'

const serverName = RequestServerEnum.BASE
/**
 * 首页轮播图
 *
 */
export function querySwiperList(): Promise<IBannerItem[]> {
  return request?.get?.(`${serverName}rotationMap/changeableInfo`, {}, { noAuth: true })
}

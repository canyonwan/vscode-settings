import { RequestServerEnum } from '@/enums/http-enum'
import request from '@/utils/request'

const serverName = RequestServerEnum.BASE
/**
 * ๅๅๅ่กจ
 *
 */
export function queryGoodsList(data: any): Promise<IGoodsItem> {
  return request?.get?.(`${serverName}rotationMap/changeableInfo`, data, { noAuth: true })
}

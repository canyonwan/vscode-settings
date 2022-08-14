import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
import { IResultPage } from '@/utils/http/axios/types'
import { IGoodsItem } from './types'
const serverName = RequestServerEnum.GOODS

//获取table
export function queryGoodsList(params: any): Promise<IResultPage<IGoodsItem>> {
  return http.request({
    url: `${serverName}/goods/page`,
    method: RequestEnum.POST,
    data: params
  })
}

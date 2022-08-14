import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
const serverName = RequestServerEnum.GOODS
//获取table
export function queryGoodsList(params: any) {
  return http.request({
    url: `${serverName}/goods/page`,
    method: RequestEnum.POST,
    data: params
  })
}

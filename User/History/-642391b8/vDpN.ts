import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'

const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 案由浏览
 * @desc 案由tree
 */
export function queryCauseTree(params: any): Promise<void> {
  return http.request({
    url: `${ServerName}causeTag/list/filterCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}

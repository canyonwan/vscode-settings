// caseType/list/byIdList

import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'

const BaseServerName = RequestServerEnum.BASE
/**
 * @Title 案由维护
 * @desc 法 -> 查询处置方式列表
 * @params id
 */
export function queryHandlingWayList(id: string): Promise<IHandlingWayType[]> {
  return http.request({
    url: `${ServerName}causeSubLaw/info/getCaseType/${id}`,
    method: RequestEnum.GET
  })
}

// caseType/list/byIdList

import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICaseType } from '../setting/types'
import type { IHandlingWayType, ISaveHandlingWayGroupType, ISubCauseBaseAttrType } from './types'
// 案由维护
const ServerName = RequestServerEnum.CauseManage
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

import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICaseType } from '../cause-manage/types'

const ServerName = RequestServerEnum.BASE
/**
 * @Title 案由维护
 * @desc 法 -> 查询处置方式列表
 * @params id
 */
export function queryCaseTypeByIds(ids: string[]): Promise<ICaseType[]> {
  return http.request({
    url: `${ServerName}caseType/list/byIdList`,
    method: RequestEnum.POST,
    data: ids
  })
}

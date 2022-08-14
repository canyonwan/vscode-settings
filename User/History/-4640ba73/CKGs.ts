import type { IResultPage } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICauseManageSearchType, ICauseSubListItemType } from '@/api/cause-manage/types'

// 案由维护
const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 案由维护
 * @desc 7.分页查询案由维护列表(维护使用)
 * @param params
 */
export function queryCauseManageList(params: ICauseManageSearchType): Promise<IResultPage<ICauseSubListItemType[]>> {
  return http.request({
    url: `${ServerName}causeSub/list`,
    method: RequestEnum.POST,
    data: params
  })
}

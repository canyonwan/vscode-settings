import type { IResultPage } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICauseAttrItemType, ICauseSubListItemType, IPrimaryCauseItemType, ISubCauseBaseAttrType } from '@/api/cause-manage/types'
import type { ILawItemType, ILawTagType } from '@/api/law/types'

// 案由维护
const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 案由维护
 * @desc 7.分页查询案由维护列表(维护使用)
 * @param params
 */
export function queryCauseManageList(params: any): Promise<IResultPage<IPrimaryCauseItemType[]>> {
  return http.request({
    url: `${ServerName}causeSub/list`,
    method: RequestEnum.POST,
    data: params
  })
}

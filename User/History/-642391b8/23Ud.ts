import type { IResultPage } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICauseAttrItemType, ICauseManageSearchType, ICauseSubListItemType, IPrimaryCauseItemType, ISaveCause, ISubCauseBaseAttrType } from '@/api/cause-manage/types'
import type { ILawItemType, ILawTagType } from '@/api/law/types'

/**
 * @Title 案由维护
 * @desc 保存子案由
 */
export function saveSubCause(params: ISaveCause): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeSub/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

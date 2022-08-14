import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'

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

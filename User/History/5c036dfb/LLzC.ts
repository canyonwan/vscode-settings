import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import { ILawTagType } from '@/api/law/types'

const ServerName = RequestServerEnum.EnforceBase

/**
 * @Title 法类型
 * 查询所有法类型
 */
export function queryAllLawTypes(): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}lawType/list`,
    method: RequestEnum.GET
  })
}
/**
 * @Title 法类型
 * 操作法类型
 */
export function saveLawTypes(params: ILawTagType): Promise<ILawTagType[]> {
  return http.request(
    {
      url: `${ServerName}lawType/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * @Title 法类型
 * 删除所有法类型
 */
export function deleteLawType(id: number): Promise<void> {
  return http.request(
    {
      url: `${ServerName}lawType/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

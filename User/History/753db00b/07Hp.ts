import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import { ILawTagType } from '@/api/law/types'

const ServerName = RequestServerEnum.EnforceBase

/**
 * 查询所有法标签
 */
export function queryAllLawTags(): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}lawTag/list`,
    method: RequestEnum.GET
  })
}
/**
 * 保存法标签
 */
export function saveLawTag(params: ILawTagType): Promise<ILawTagType[]> {
  return http.request(
    {
      url: `${ServerName}lawTag/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 删除所有法标签
 */
export function deleteLawTag(id: number): Promise<void> {
  return http.request(
    {
      url: `${ServerName}lawTag/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 法绑定法标签
 */
export function lawBindTag(params: any): Promise<ILawTagType[]> {
  return http.request(
    {
      url: `${ServerName}lawTagLawBinding/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * 查询法对应的法标签
 */
export function queryTagsWithLaw(lawId: string): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}lawTagLawBinding/lawTag/list/${lawId}`,
    method: RequestEnum.GET
  })
}
/**
 * 查询法标签对应的法数据
 */
export function queryLawsWithTag(tagId: number): Promise<ILawTagType[]> {
  return http.request(
    {
      url: `${ServerName}lawTagLawBinding/law/list/${tagId}`,
      method: RequestEnum.GET
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

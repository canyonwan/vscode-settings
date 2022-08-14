import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ILawItemType, ILawType } from '@/api/law/types'
import { IResultPage } from '@/utils/axios/types'
import { IBaseType } from '../setting/types'

const ServerName = RequestServerEnum.EnforceBase

/**
 * 新增/更新法
 * @param params
 * 案由法(法基础)
 */
export function saveLaw(params: ILawItemType): Promise<void> {
  return http.request(
    {
      url: `${ServerName}law/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 删除指定id的法
 * @param id
 */
export function deleteLaw(id: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}law/info/`,
      method: RequestEnum.DELETE,
      params: id
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 查询指定法
 * @param id
 */
export function queryAssignLaw(id: string): Promise<ILawItemType> {
  return http.request({
    url: `${ServerName}law/info/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 查询指定的法集合
 * @param ids
 */
export function queryLawDetailList(ids: string[]): Promise<ILawItemType[]> {
  return http.request({
    url: `${ServerName}law/info/idList`,
    method: RequestEnum.POST,
    data: ids
  })
}

/**
 * 查询指定的部门集合
 * @param ids
 */
export function queryDeptList(ids: string[]): Promise<IBaseType[]> {
  return http.request({
    url: `${ServerName}departmentType/getListByIdList`,
    method: RequestEnum.POST,
    data: ids
  })
}

/**
 * 查询法列表
 * @param params
 */
export function queryLaws(params: ILawType): Promise<IResultPage<ILawItemType[]>> {
  return http.request({
    url: `${ServerName}law/page`,
    method: RequestEnum.POST,
    data: params
  })
}

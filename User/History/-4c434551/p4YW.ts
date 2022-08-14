import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import { IRegionType } from '@/api/setting/types'

const ServerName = RequestServerEnum.EnforceBase

/**
 * 新增/更新法
 * @param params
 * 违法行为法(法基础)
 */
export function saveRegion(params: IRegionType): Promise<void> {
  return http.request(
    {
      url: `${ServerName}region/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * 获取地区列表
 * @param id
 */
export function queryRegions(id: string): Promise<IRegionType[]> {
  return http.request({
    url: `${ServerName}region/list/${id}`,
    method: RequestEnum.GET
  })
}
/**
 * 获取地区列表
 * @param id
 */
export function queryAssignRegion(id: string): Promise<IRegionType> {
  return http.request({
    url: `${ServerName}region/info/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 删除指定id的地区
 * @param id
 */
export function deleteRegion(id: string): Promise<void> {
  return http.request({
    url: `${ServerName}region/info/`,
    method: RequestEnum.DELETE,
    params: id
  })
}

/**
 * 根据地区id查询所有上级id
 * @param id
 */
export function getRegionIds(id: number | string): Promise<number[]> {
  return http.request({
    url: `${ServerName}region/parentIdList/${id}`,
    method: RequestEnum.GET
  })
}

import { HttpResponse } from '@/@types'
import VAxios from '../axios'
import { ISearch, serveName } from './types'

/**
 * 分页通用接口
 * @param params
 * @param api
 */
export function queryOpenPageData(params: ISearch, api: string): Promise<HttpResponse> {
  return VAxios.fetchPost(`${serveName}${api}/list`, { ...params, noQS: 1 })
}

/**
 * 详情通用接口
 * @param id
 * @param api
 */

export function queryOpenDetail(id: string, api: string): Promise<HttpResponse> {
  return VAxios.fetchGet(`${serveName}${api}/info/${id}`, {})
}

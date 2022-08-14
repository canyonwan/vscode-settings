import { HttpResponse } from '@/@types'
import { deleteNoParam } from '@/utils'
import VAxios from '../axios'
import { ISearch, serveName } from './types'

/**
 * 行政许可分页
 * @param params
 */
export function queryLicensePage(params: ISearch): Promise<HttpResponse> {
  return VAxios.fetchPost(`${serveName}afterExpropriation/list`, { ...params, noQS: 1 })
}

/**
 * 征收征用的详情
 * @param params
 */

export function queryDetail(): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/member/findLoginMemberInfo', {})
}

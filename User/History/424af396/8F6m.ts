import { HttpResponse } from '@/@types'
import VAxios from '../axios'
import { ISearch, serveName } from './types'

/**
 * 征收征用分页
 * @param params
 */
export function queryExpropriatedPage(params: ISearch): Promise<HttpResponse> {
  return VAxios.fetchPost(`${serveName}afterExpropriation/list`, { ...params, noQS: 1 })
}

/**
 * 征收征用的详情
 * @param id
 */

export function queryExpropriatedDetail(id: string): Promise<HttpResponse> {
  return VAxios.fetchGet('infrastructure/member/findLoginMemberInfo', { id })
}

import { HttpResponse } from '@/@types'
import { deleteNoParam } from '@/utils'
import VAxios from '../axios'
import type { ISearch } from './types'

/**
 * 行政许可分页
 * @param params
 */
export function queryLicensePage(params: ISearch): Promise<HttpResponse> {
  return VAxios.fetchPost('businessStatistics/certificates/queryAllStatistics', { ...params, noQS: 1 })
}

import { HttpResponse } from '@/@types'
import { deleteNoParam } from '@/utils'
import VAxios from '../axios'

/**
 * 行政许可分页
 * @param params
 */
export function queryLicensePage(params: any): Promise<HttpResponse> {
  return VAxios.fetchPost('businessStatistics/certificates/queryAllStatistics', { ...params, noQS: 1 })
}

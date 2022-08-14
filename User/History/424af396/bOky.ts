import { HttpResponse } from '@/@types'
import { deleteNoParam } from '@/utils'
import VAxios from '../axios'

/**
 * 证件统计
 * @param params
 */
export function getCertificateCount(params: any): Promise<HttpResponse> {
  return VAxios.fetchPost('businessStatistics/certificates/queryAllStatistics', { ...params, noQS: 1 })
}

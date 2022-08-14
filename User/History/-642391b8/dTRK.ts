import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'

const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 案由浏览
 * @desc 案由tree
 */
export function queryCauseTree(params: any): Promise<ICauseTreeLeaf[]> {
  return http.request({
    url: `${ServerName}causeTag/list/filterCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}

export interface ICauseTreeLeaf {
  id: string
  parentId: number
  name: string
  code: string
  fullName?: any
  remarks: string
  list: ICauseTreeLeaf[]
}

import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import { IResultPage } from '@/utils/axios/types'
import { IToolInfo } from './types'
const serverName = RequestServerEnum.Workflow

/**
 * 工具名模糊查询信息
 *@param {*参数} params
 */
export function queryToolData(params): Promise<IResultPage<IToolInfo[]>> {
  return http.request({
    url: `${serverName}tool/select`,
    method: RequestEnum.POST,
    params: params
  })
}

/**
 * 新增修改工具信息
 *@param {*参数} params
 */
export function saveTool(params) {
  return http.request(
    {
      url: `${serverName}tool/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      params: params
    },
    {
      successMessageText: '保存成功！'
    }
  )
}

/**
 * 删除工具
 *@param {*参数} id
 */
export function deleteTool(id) {
  return http.request(
    {
      url: `${serverName}tool/del/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: '删除成功！'
    }
  )
}

/**
 * @Title 工具箱
 * @desc 保存出示执法证
 * @param params
 */
export function saveShowEnforceCert(params: IPrimaryCauseItemType): Promise<void> {
  return http.request(
    {
      url: `${ServerName}showCertificate/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

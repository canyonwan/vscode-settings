import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import { ITargetType } from './types'
const serverName = RequestServerEnum.BASE

/**
 * 检查对象类型 查询所有
 * @returns
 */
export function queryTargetTypes(): Promise<ITargetType[]> {
  return http.request({
    url: `${serverName}penaltyObjectType/list`,
    method: RequestEnum.GET
  })
}

/**
 * 检查对象类型 查下级所有
 * @returns
 */
export function queryTargetTypesChild(id): Promise<ITargetType[]> {
  return http.request({
    url: `${serverName}penaltyObjectType/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 检查对象类型 查单条
 * @param {*参数} id
 * @returns
 */
export function queryTargetTypeInfo(id): Promise<ITargetType> {
  return http.request({
    url: `${serverName}penaltyObjectType/list/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 新增修改
 *@param {*参数} params 新增POST 编辑PUT
 */
export function saveTargetType(params: ITargetType) {
  return http.request(
    {
      url: `${serverName}penaltyObjectType/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      params: params
    },
    {
      successMessageText: '保存成功！'
    }
  )
}
/**
 * 删除
 * @param {*参数} id
 * @returns
 */
export function deleteTargetType(id): Promise<ITargetType[]> {
  return http.request({
    url: `${serverName}penaltyObjectType/info/${id}`,
    method: RequestEnum.DELETE
  })
}

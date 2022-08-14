import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'

export interface BasicResponseModel<T = any> {
  code: number
  message: string
  result: T
}

export interface BasicPageParams {
  pager: number
  size: number
  total: number
}

const serverName = RequestServerEnum.USER

/**
 * 获取用户个人信息
 * @returns
 */
export function getUserInfo() {
  return http.request({
    // url: `${serverName}user/queryUserData`,
    url: `${serverName}user/queryUserData`,
    method: RequestEnum.GET
  })
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/login',
      method: 'POST',
      params
    },
    {
      isTransformResponse: false
    }
  )
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: 'POST',
      params
    },
    {
      isTransformResponse: false
    }
  )
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: '/login/logout',
    method: 'POST',
    params
  })
}

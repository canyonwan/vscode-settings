import request from '@/utils/request.ts'

/**
 * 获取用户信息
 *
 */
export function fetchUserInfo() {
  return request?.get?.('/user/userInfo', {}, { noAuth: true })
}

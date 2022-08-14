import { ContentTypeEnum, RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
import type { ILogin } from './types'
const serverName = RequestServerEnum.AUTH

/**
 * 登录
 * @param params
 * @param loginWay true是账号密码登录，false手机号验证码登录
 * @returns
 */
export function login(params: ILogin, loginWay: boolean) {
  return http.request(
    {
      url: `${serverName}loginRelated/login`,
      method: RequestEnum.POST,
      params: params,
      headers: loginWay ? { 'Content-Type': ContentTypeEnum.FORM_DATA } : { 'Content-Type': ContentTypeEnum.FORM_DATA, 'verification-method': 'verificationCode' }
    },
    {
      successMessageText: '登录成功🎉',
      errorMessageText: '登录失败，请稍后重试!'
    }
  )
}

/**
 * 退出登录
 * @returns
 */
export function logout() {
  return http.request(
    {
      url: `${serverName}loginRelated/logout`,
      method: RequestEnum.GET
    },
    {
      successMessageText: '退出登录成功！'
    }
  )
}

/**
 * token刷新
 * @param params
 * @returns
 */
export function refreshAuth() {
  return http.request({
    url: `${serverName}loginRelated/tokenPassiveRefresh`,
    method: RequestEnum.GET
  })
}

/**
 * 获取验证码
 * @param params
 * @returns
 */
export function getCaptcha(params) {
  return http.request(
    {
      url: `${serverName}loginRelated/sendVerificationCode`,
      method: RequestEnum.GET,
      params: params
    },
    {
      successMessageText: '验证码已发送！'
    }
  )
}

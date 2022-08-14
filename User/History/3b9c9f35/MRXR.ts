import { RequestEnum, RequestServerEnum, ContentTypeEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import { ILogin } from './type'
const serverName = RequestServerEnum.AUTH

/**
 * 登录
 * @param params
 * @param loginWay true是账号密码登录，false手机号验证码登录
 * @returns
 */
export function login(params: ILogin, loginWay: boolean) {
  debugger
  return http.request(
    {
      url: `${serverName}loginRelated/login`,
      method: RequestEnum.POST,
      params: params,
      headers: loginWay ? { 'Content-Type': ContentTypeEnum.FORM_DATA } : { 'Content-Type': ContentTypeEnum.FORM_DATA, 'verification-method': 'verificationCode' }
    },
    {
      successMessageText: '登录成功！',
      errorMessageText: '登录失败，请稍后重试!'
    }
  )
}

/**
 * 自定义表单查询 列表
 * @param params
 * @returns
 */
export function refreshAuth() {
  return http.request({
    url: `${serverName}loginRelated/tokenPassiveRefresh`,
    method: RequestEnum.GET
    // params: params
  })
}
/**
 * 登录
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

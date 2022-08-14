import { http } from '@/utils/http/axios'

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

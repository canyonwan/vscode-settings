import Axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import qs from 'qs'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { removeToken } from '@/utils/auth'

class VAxios {
  private axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = Axios.create({
      baseURL: process.env.VUE_APP_BASE_URL,
      timeout: 0
    })
    this.setupInterceptors()
  }
  private setupInterceptors() {
    /**
     * @description 请求发起前的拦截器
     * @returns {AxiosRequestConfig} config
     */
    this.axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
      // 如果是获取token接口：
      if (config.url && config.url.indexOf('/login') < 0 && getToken()) {
        config.headers.Authorization = 'Bearer ' + getToken()
      }
      if (config.method === 'post') {
        if (!config.headers['Content-Type']) {
          if (!config.data.noQS) {
            // 保存时不需要通过qs加密
            config.data = qs.stringify(config.data)
          } else {
            delete config.data.noQS
          }
        }
      }
      return config
    })

    /**
     * @description 响应收到后的拦截器
     * @returns {}
     */
    this.axiosInstance.interceptors.response.use(
      /** 请求有响应 */
      async (response: AxiosResponse) => {
        if (response.status === 200) {
          const res = response.data
          if (response.config.responseType && response.config.responseType === 'blob') {
            return response.data
          } else {
            if (res.code !== 1000) {
              // 不等于2000是错误异常
              if (res.code === 208) {
                // token失效需要重新登录
                removeToken()
                store.commit('app/SET_USERINFO', {})
                window.location.href = '#/login'
                return Promise.reject(res)
              } else {
                return Promise.reject(res)
              }
            } else {
              return response.data
            }
          }
        } else {
          const __text = this.getErrorCode2text(response)
          return Promise.reject(new Error(__text))
        }
      },
      /** 请求无响应 */
      (error: AxiosError) => {
        let __emsg: string = error.message || ''
        if (error.message) {
          __emsg = error.message
        }

        if (error.response) {
          __emsg = error.response.data.message ? error.response.data.message : error.response.data.data
        }
        // timeout
        if (__emsg.indexOf('timeout') >= 0) {
          __emsg = 'timeout'
        }
        return Promise.reject(new Error(__emsg))
      }
    )
  }
  /**
   * get status code
   * @param {AxiosResponse} response Axios  response object
   */
  getErrorCode2text = (response: AxiosResponse): string => {
    /** http status code */
    const code = response.status
    /** notice text */
    let message = 'Request Error'
    switch (code) {
      case 400:
        message = 'Request Error'
        break
      case 401:
        message = '登录丢失'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '访问资源不存在'
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        message = '位置错误'
        break
      case 501:
        message = '承载服务未实现'
        break
      case 502:
        message = '网关错误'
        break
      case 503:
        message = '服务暂不可用'
        break
      case 504:
        message = '网关超时'
        break
      case 505:
        message = '暂不支持的 HTTP 版本'
        break
      default:
        message = '位置错误'
    }
    return message
  }

  // 封装POST请求
  fetchPost<T>(code: string, params: any, config: AxiosRequestConfig = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .post(code, params, config)
        .then(
          (response) => {
            resolve((response as unknown) as Promise<T>)
          },
          (err) => {
            message.warning(err.message)
            reject(err)
          }
        )
        .catch((error) => {
          message.error(error.message)
          reject(error)
        })
    })
  }
  // 封装GET请求
  fetchGet<T>(code: string, params: any, config: AxiosRequestConfig = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .get(code, {
          params,
          ...config
        })
        .then(
          (response) => {
            resolve((response as unknown) as Promise<T>)
          },
          (err) => {
            message.warning(err.message)
            reject(err)
          }
        )
        .catch((error) => {
          message.error(error.message)
          reject(error)
        })
    })
  }
}

const http = new VAxios()
export default http

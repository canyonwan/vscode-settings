// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { VAxios } from './axios'
import { AxiosTransform } from './axios-transform'
import axios, { AxiosResponse } from 'axios'
import { checkStatus } from './check-status'
import { formatRequestDate, joinTimestamp } from './helper'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/http-enum'
import { PageEnum } from '@/enums/page-enum'

import { useGlobSetting } from '@/hooks/setting'

import { isString } from '@/utils/is/'
import { setObjToUrlParams } from '@/utils/url-utils'
import { parseFormData } from '@/utils'

import { IResult, RequestOptions } from './types'

import { useUserStoreWidthOut } from '@/store/modules/user'
import qs from 'qs'
import router from '@/router'
import { storage } from '@/utils/Storage'
const globSetting = useGlobSetting()
const urlPrefix = globSetting.urlPrefix || ''

let isRefreshing = false // 是否正在刷新 节流
// 失效后同时发送请求的容器 -- 缓存接口
let subscribers: any = []
// 刷新 token 后, 将缓存的接口重新请求一次
function onAccessTokenFetched(token) {
  subscribers.forEach((callback) => {
    callback(token)
  })
  // 清空缓存接口
  subscribers = []
}
// 添加缓存接口
function addSubscriber(callback) {
  subscribers.push(callback)
}
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (res: AxiosResponse<IResult>, options: RequestOptions) => {
    // @ts-ignore
    const { $message: Message, $dialog: Modal } = window
    const { isShowMessage = true, isShowErrorMessage, isShowSuccessMessage, successMessageText, errorMessageText, isTransformResponse, isReturnNativeResponse } = options

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      console.log('%c [ res ]-48', 'font-size:13px; background:#0095FF; color:white;', res.data)
      return res.data
    }

    const reject = Promise.reject

    const { data } = res

    if (!data) {
      // return '[HTTP] Request has no return value';
      return reject(data)
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, data: result, message } = data
    // 请求成功
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    // 是否显示提示信息
    if (isShowMessage && code !== ResultEnum.TOKENREFRESH && code !== ResultEnum.TIMEOUT) {
      if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
        // 是否显示自定义信息提示
        Message.success(successMessageText || message || '操作成功！')
      } else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
        // 是否显示自定义信息提示
        Message.error(message || errorMessageText || '操作失败！')
      } else if (!hasSuccess && options.errorMessageMode === 'modal') {
        // errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        Modal.info({
          title: '提示',
          content: message,
          positiveText: '确定',
          onPositiveClick: () => {}
        })
      }
    }

    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
      return result === null ? '操作成功' : result
    }
    // 接口请求错误，统一提示错误信息
    if (code === ResultEnum.ERROR) {
      if (message) {
        Message.error(data.message)
        Promise.reject(new Error(message))
      } else {
        const msg = '操作失败,系统异常!'
        Message.error(msg)
        Promise.reject(new Error(msg))
      }
      return reject()
    }
    // 这里逻辑可以根据项目进行修改
    if (!hasSuccess) {
      return reject(new Error(message))
    }

    return data
  },
  responseInterceptors: (res) => {
    const { code } = res.data
    // token超时
    if (code === ResultEnum.TOKENREFRESH && !res.config.url!.includes('/loginRelated/tokenPassiveRefresh')) {
      if (!isRefreshing) {
        // 控制重复获取token
        isRefreshing = true
        // debugger
        const userStore = useUserStoreWidthOut()
        userStore
          .tokenPassiveRefresh()
          .then((res) => {
            onAccessTokenFetched(res)
          })
          .catch(() => {
            // window.location.href = '/#/login'
          })
          .finally(() => {
            isRefreshing = false
          })
      }
      // 将其他接口缓存起来
      return new Promise((resolve) => {
        // 返回Promise并且让其状态一直为等待状态,
        // 只有当token刷新成功后, 就会调用通过addSubscriber函数添加的缓存接口,
        // 此时, Promise的状态就会变成resolve
        addSubscriber((newToken) => {
          // 表示用新的token去替换掉原来的token
          res.config.headers!.Authorization = 'Bearer ' + newToken
          // res.config.headers!.ignoreCancelToken = true
          // 替换掉url -- 因为baseURL会扩展请求url
          res.config.url = res.config.url!.replace(res.config.baseURL!, '')
          delete res.config.cancelToken
          // 用重新封装的config去请求, 就会将重新请求后的返回
          resolve(Axios.request(res.config, { isReturnNativeResponse: true }))
        })
      })
    }
    // 刷新token超时
    if (code === ResultEnum.TIMEOUT || code === ResultEnum.TIMEOUTO) {
      // @ts-ignore
      const { $dialog: Modal } = window
      const LoginName = PageEnum.BASE_LOGIN_NAME
      if (router.currentRoute.value.name == LoginName) return
      // 到登录页
      const timeoutMsg = '登录超时,请重新登录!'
      Modal.warning({
        title: '提示',
        content: '登录身份已失效，请重新登录!',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          storage.clear()
          const userStore = useUserStoreWidthOut()
          userStore.logout().then(() => {
            router
              .replace({
                name: LoginName,
                query: {
                  redirect: router.currentRoute.value.fullPath
                }
              })
              .finally(() => location.reload())
          })
        },
        onNegativeClick: () => {}
      })
      return Promise.reject(timeoutMsg)
    }
    return res
  },
  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { joinPrefix, joinParamsToUrl, formatDate, joinTime = false } = options

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length) {
          config.data = data
          config.params = params
        } else {
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data))
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
      const requestType = config.headers ? config.headers['Content-Type'] : ''
      if (requestType === ContentTypeEnum.FORM_URLENCODED) {
        config.data = qs.stringify(config.data)
      } else if (requestType === ContentTypeEnum.FORM_DATA) {
        config.data = parseFormData(config.data)
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const userStore = useUserStoreWidthOut()
    const token = userStore.getToken
    if (token && !config.url!.includes('/loginRelated/login')) {
      // jwt token
      if (config.url!.includes('/loginRelated/tokenPassiveRefresh')) {
        const reToken = userStore.getRefreshToken
        config.headers!.RefreshAuthorization = 'RefreshBearer ' + reToken
      }
      config.headers!.Authorization = 'Bearer ' + token
    }
    return config
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    // @ts-ignore
    const { $message: Message, $dialog: Modal } = window
    const { response, code, message } = error || {}
    // TODO 此处要根据后端接口返回格式修改
    const msg: string = response && response.data && response.data.message ? response.data.message : ''
    const err: string = error.toString()
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        Message.error('接口请求超时,请刷新页面重试!')
        return
      }
      if (err && err.includes('Network Error')) {
        Modal.info({
          title: '网络异常',
          content: '请检查您的网络连接是否正常!',
          positiveText: '确定',
          onPositiveClick: () => {}
        })
        return
      }
    } catch (error) {
      // throw new Error(error)
    }
    // 请求是否被取消
    const isCancel = axios.isCancel(error)
    if (!isCancel) {
      checkStatus(error.response && error.response.status, msg, Message)
    } else {
      console.warn(error, '请求被取消！')
    }
    return error
  }
}

const Axios = new VAxios({
  timeout: 10 * 1000,
  // 接口前缀
  baseURL: globSetting.apiUrl,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 数据处理方式
  transform,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: false,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'none',
    // 接口地址
    apiUrl: globSetting.apiUrl as string,
    //显示失败的信息
    isShowErrorMessage: true
  },
  withCredentials: false
})
export default Axios
// export { transform } // 可导出其他

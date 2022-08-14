export interface AxiosRequestConfig<D = any> {
  url?: string
  method?: Method
  baseURL?: string
  // headers?: AxiosRequestHeaders
  params?: any
  paramsSerializer?: (params: any) => string
  data?: D
  timeout?: number
  timeoutErrorMessage?: string
  withCredentials?: boolean
  responseType?: ResponseType
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onUploadProgress?: (progressEvent: any) => void
  onDownloadProgress?: (progressEvent: any) => void
  maxContentLength?: number
  validateStatus?: ((status: number) => boolean) | null
  maxBodyLength?: number
  maxRedirects?: number
  socketPath?: string | null
  httpAgent?: any
  httpsAgent?: any
  decompress?: boolean
  signal?: AbortSignal
  insecureHTTPParser?: boolean
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
export interface RequestOptions {
  // 请求参数拼接到url
  joinParamsToUrl?: boolean
  // 格式化请求参数时间
  formatDate?: boolean
  // 是否显示提示信息
  isShowMessage?: boolean
  // 是否解析成JSON
  // isParseToJson?: boolean
  // 成功的文本信息
  successMessageText?: string
  // 是否显示成功信息
  isShowSuccessMessage?: boolean
  // 是否显示失败信息
  isShowErrorMessage?: boolean
  // 错误的文本信息
  errorMessageText?: string
  // 是否加入url
  joinPrefix?: boolean
  // 接口地址， 不填则使用默认apiUrl
  apiUrl?: string
  // 错误消息提示类型
  errorMessageMode?: 'none' | 'modal'
  // 是否添加时间戳
  joinTime?: boolean
  // 不进行任何处理，直接返回
  isTransformResponse?: boolean
  // 是否返回原生响应头
  isReturnNativeResponse?: boolean
}

export interface IResult<T = any> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message: string
  data?: T
}
export interface IResultPage<T> {
  total: number
  size: number
  page: number
  contents: T
}

export interface RequestSuccessCallbackResult<T = any> {
  /**
   * 开发者服务器返回的数据
   */
  data: string | AnyObject | ArrayBuffer | T
  /**
   * 开发者服务器返回的 HTTP 状态码
   */
  statusCode: number
  /**
   * 开发者服务器返回的 HTTP Response Header
   */
  header: any
  /**
   * 开发者服务器返回的 cookies，格式为字符串数组
   */
  cookies: string[]
}

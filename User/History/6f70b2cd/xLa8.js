/**
 * @description: 请求结果集
 */
 export enum ResultEnum {
  SUCCESS = 2000,
  ERROR = -1,
  TOKENREFRESH = 4013,
  TIMEOUT = 4016,
  TIMEOUT17 = 4017,
  TYPE = 'success'
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description: 服务名
 */
export enum RequestServerEnum {
  USER = '/user/',
  GOODS = '/goods/',
  BASE = '/base/',
  EnforceBase = '/enforce-base/',
  AUTH = '/auth/'
}

/**
 * @description: http提示信息
 */
export enum HttpMessageEnum {
  SUCCESS = '操作成功🎉',
  ERROR = '操作失败🚧'
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

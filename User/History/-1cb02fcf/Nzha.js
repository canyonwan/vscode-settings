import {RequestServerEnum} from './http-enum'
const serverName = RequestServerEnum.
export const queryGoodsList(params) {
  return request({
    url: '/goods/page',
    data: params,
    method: 'GET'
  })
}


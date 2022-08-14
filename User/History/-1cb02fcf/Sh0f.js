import {RequestServerEnum} from './http-enum'
const serverName = RequestServerEnum.GOODS
export const queryGoodsList(params) {
  return request({
    url: '/goods/page',
    data: params,
    method: 'GET'
  })
}


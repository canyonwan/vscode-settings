import { RequestServerEnum } from './http-enum'
const serverName = RequestServerEnum.GOODS
export function queryGoodsList(params) {
  return request({
    url: '/goods/page',
    data: params,
    method: 'GET'
  })
}


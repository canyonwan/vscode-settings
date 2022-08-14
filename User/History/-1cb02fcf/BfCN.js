import { RequestServerEnum } from '../../utils/http-enum'
const serverName = RequestServerEnum.GOODS
export function queryGoodsList(params) {
  return request({
    url: `${serverName}/goods/page`,
    data: params,
    method: 'GET'
  })
}


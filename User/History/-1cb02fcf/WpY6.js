const serverName = 'goods'
export function queryGoodsList(params) {
  return request({
    url: `${serverName}/goods/page`,
    data: params,
    method: 'GET'
  })
}


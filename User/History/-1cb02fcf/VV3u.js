export const queryGoodsList(params) {
  return request({
    url: '/goods/page',
    data: params,
    method: 'GET'
  })
}

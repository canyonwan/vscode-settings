export const queryGoodsList(params) {
  return request({
    url: '/goods/list',
    data: params,
    method: 'POST'
  })
}

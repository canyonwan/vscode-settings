import { http } from '@/utils/http/axios';

//获取table
export function getTableList(params: any) {
  return http.request({
    url: 'goods/page',
    method: 'post',
    data: params,
  });
}

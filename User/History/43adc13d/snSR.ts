import { RequestEnum, RequestServerEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http/axios'
const serverName = RequestServerEnum.FILE

/**
 * 上传文件
 *@param {*参数} params
 */
export function uploadFile(params) {
  return http.request({
    url: `${serverName}common/upload`,
    method: RequestEnum.POST,
    headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundary' },
    params: params
  })
}

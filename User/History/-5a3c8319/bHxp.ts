import axios from 'axios'

export const function getUploadToken()  {
  return axios.get('http://upload.qiniup.com/Upload/getQiuniuToken')
}

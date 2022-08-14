import axios from 'axios'

export const getUploadToken() =>  {
  return axios.get('http://upload.qiniup.com/Upload/getQiuniuToken')
}

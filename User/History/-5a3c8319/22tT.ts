import axios from 'axios'
const { VITE_GLOB_API_URL } = ENV;
export const getUploadToken() {
  return axios.get('')
}

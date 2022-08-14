import { affixProps } from "naive-ui/es/affix/src/Affix"
import {Axios as axios} from 'axios'
export const getUploadToken() {
  return axios.get('.')
}

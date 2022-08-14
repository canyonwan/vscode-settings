import axios from "axios";

export function getUploadToken() {
  return axios.post("http://upload.qiniup.com/qiniu/getTokenn");
}

import axios from "axios";

export function getUploadToken() {
  return axios.get("http://upload.qiniup.com/qiniu/getTokenn");
}

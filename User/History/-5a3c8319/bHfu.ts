import axios from "axios";

export function getUploadToken() {
  return axios.post("http://upload.qiniup.com/qiniuToken");
}

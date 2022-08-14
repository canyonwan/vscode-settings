import axios from "axios";

export function query() {
  return axios.post("https://api.qiniu.com/v2/query", {
    ak: "aIlCDzSWnIMgq2kAXmrOr5-TF9QLwdz0VEZUvzhD",
    bucket: "1777-bucket",
  });
}

export function getUploadToken() {
  return axios.post("http://upload.qiniup.com/qiniu/getToken", {});
}

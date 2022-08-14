import axios from "axios";

export function query() {
  return axios.get("https://api.qiniu.com/v2/query", {
    params: {
      ak: "aIlCDzSWnIMgq2kAXmrOr5-TF9QLwdz0VEZUvzhD",
      bucket: "1777-bucket",
    },
  });
}

export function getUploadToken() {
  return axios.post("https://upload-cn-east-2.qiniup.com/", {});
}

// export function getUploadToken() {
//   return axios.post("http://upload.qiniup.com/qiniu/getToken", {});
// }

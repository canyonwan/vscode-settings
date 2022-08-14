<script setup lang="ts">
import { query } from "@/api";
import type { GlobEnvConfig } from "@/types/types";
import type { UploadFileInfo } from "naive-ui/es/upload";
import QRCodeVue3 from "qrcode-vue3";
import { ref } from "vue";
import qiniu from "qiniu";
defineProps<{
  msg: string;
}>();

const fileItem = ref<string>("");

function handleFinish({ event: Event }) {
  const res = eval("(" + Event.target.response + ")");
  console.log(
    "%c [ res ]-13",
    "font-size:13px; background:#0095FF; color:white;",
    res
  );
  // const infoField = componentSetting.upload.apiSetting.infoField;
  // const { code } = res;
  // const message = res.msg || res.message || "上传失败";
  // const result = res[infoField];
  // //成功
  // if (code === ResultEnum.SUCCESS) {
  //   state.imgList.push(result);
  //   emit("update:value", state.imgList);
  //   if (props.isSuccessBack) {
  //     emit("onSuccess");
  //   }
  // } else message.error(message);
}

const ENV = import.meta.env as unknown as GlobEnvConfig;
const { VITE_GLOB_API_URL } = ENV;
const api = "upload.qiniup.com";
const DOMAIN = "idv093d.qiniudns.com/";
const bucketname = "1777-bucket";
const ak = "aIlCDzSWnIMgq2kAXmrOr5-TF9QLwdz0VEZUvzhD";
const sk = "fOJw46n43nMAlsii58CE13bTSlOHmpbPzPlmn0H2";
const action = `https://upload-cn-east-2.qiniup.com/`;

async function getToken() {
  await query();
}

var options = {
  scope: bucketname,
  expires: 7200,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
const map = {
  accessKey: "",
  secretKey: "",
};
var uploadToken = putPolicy.uploadToken(mac);
</script>

<template>
  <div class="with-full flex justify-around">
    <n-button type="primary" @click="getToken">获取TOKEN</n-button>
    <n-upload
      list-type="image-card"
      class="w-40"
      :action="action"
      @finish="handleFinish"
    />
    <QRCodeVue3
      :width="200"
      :height="200"
      :value="fileItem || 'https://www.baidu.com'"
      :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
      :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
      :dotsOptions="{
        type: 'dots',
        color: '#26249a',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#26249a' },
            { offset: 1, color: '#26249a' },
          ],
        },
      }"
      :backgroundOptions="{ color: '#ffffff' }"
      :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
      :cornersDotOptions="{ type: undefined, color: '#000000' }"
      fileExt="png"
      imgclass="img-qr"
      :downloadOptions="{ name: 'vqr', extension: 'png' }"
    />
  </div>
</template>

<template>
  <div class="w-full">
    <div class="upload">
      <!-- <div class="mb-4" v-if="isShowPlaybackTime"> -->
      <!-- <label style="width: 200px">文件总播放时长</label> -->
      <!-- <n-input-number class="inline-block" v-model:value="fileTotalPlaybackTime" placeholder="请输入文件总播放时长" :min="1"> <template #suffix> （秒） </template></n-input-number>
      </div> -->
      <div class="upload-card">
        <div v-for="(item, index) in imgList" :key="`img_${index}`">
          <div class="upload-card-item" :style="getCSSProperties">
            <div class="w-full upload-card-item-info">
              <div class="img-box">
                <img :src="item.fileUrl" v-if="item.fileType === FileTypeEnum.Picture" />
                <div v-else-if="item.fileType === FileTypeEnum.Pdf">
                  <pdf-show v-if="item.fileUrl" :url="item.fileUrl" :pdfScale="0.15" />
                </div>
                <div v-else class="flex align-center"> {{ item.fileName }} </div>
              </div>
              <div class="img-box-actions">
                <n-icon size="18" class="mx-2 action-icon" @click="preview(item.fileUrl, item.fileType)">
                  <EyeOutlined />
                </n-icon>
                <n-icon size="18" class="mx-2 action-icon" @click="remove(index)" v-if="!disabled">
                  <DeleteOutlined />
                </n-icon>
              </div>
            </div>
          </div>
        </div>

        <!--上传图片-->
        <div
          class="upload-card-item upload-card-item-select-picture"
          :class="{ 'upload-card-item-select-picture-white': getBindValue.isWhiteTheme === true }"
          :style="getCSSProperties"
          v-if="imgList.length < maxNumber"
        >
          <n-upload
            v-bind="getBindValue"
            class="w-auto h-auto"
            :disabled="disabled"
            :action="`${filePath}/file/common/upload`"
            :headers="{ Authorization: 'Bearer ' + userStore.getToken }"
            :file-list-style="{ display: 'none' }"
            :data="fileTotalPlaybackTime ? { fileTotalPlaybackTime: fileTotalPlaybackTime } : {}"
            @before-upload="beforeUpload"
            @finish="finish"
          >
            <div :style="getCSSProperties">
              <div class="flex flex-col items-center justify-center w-full h-full">
                <n-icon size="18" class="">
                  <PlusOutlined />
                </n-icon>
                <div class="upload-title">上传</div>
              </div>
            </div>
          </n-upload>
        </div>
      </div>
    </div>

    <!--上传图片-->
    <n-space>
      <n-alert title="提示" type="info" v-if="helpText" class="flex w-full">
        {{ helpText }}
      </n-alert>
    </n-space>
  </div>

  <!--预览图片-->
  <n-modal v-model:show="showModal" preset="card" title="预览" :bordered="false" style="width: 50%">
    <div class="flex justify-center align-center">
      <img class="w-auto" :src="previewUrl" />
    </div>
  </n-modal>
</template>

<script lang="ts">
  import { EyeOutlined, DeleteOutlined, PlusOutlined } from '@vicons/antd'
  import { basicProps } from './props'
  import { useMessage, useDialog } from 'naive-ui'
  import { ResultEnum } from '@/enums/http-enum'
  import componentSetting from '@/settings/component-setting'
  import { useGlobSetting } from '@/hooks/setting'
  import { isString } from '@/utils/is'
  import { useUserStoreWidthOut } from '@/store/modules/user'
  import { FileTypeEnum } from '@/enums/file-enum'
  import { PdfShow } from '@/components/pdf'
  import { FileInfo } from './type'
  // import axios from 'axios'

  const globSetting = useGlobSetting()

  export default defineComponent({
    name: 'BasicUpload',

    components: { PdfShow, EyeOutlined, DeleteOutlined, PlusOutlined },
    props: {
      ...basicProps
    },
    emits: ['update:value', 'delete', 'onSuccess', 'deleteFile'],
    setup(props, { emit }) {
      const getCSSProperties = computed(() => {
        return {
          width: `${props.width}px`,
          height: `${props.height}px`
        }
      })

      const message = useMessage()
      const dialog = useDialog()
      const userStore = useUserStoreWidthOut()

      const state = reactive({
        filePath: globSetting.apiUrl,
        showModal: false,
        previewUrl: '',
        isShowPlaybackTime: false, // 是否文件总播放时长
        fileTotalPlaybackTime: null, // 文件总播放时长（单位：秒），限制文件格式（.m4a;.mov;.mp3;.mp4;.wav） 其他文件格式，返回null
        // originalImgList: [] as FileInfo[],
        imgList: [] as FileInfo[],
        file: File
      })

      watch(
        () => props.value,
        () => {
          if (props.value) {
            state.imgList = props.value.length >= 0 ? props.value : [props.value]
          } else {
            state.imgList = []
          }
          console.log('%c [ state.imgList ]-132', 'font-size:13px; background:#0095FF; color:white;', state.imgList)
        },
        {
          immediate: true
        }
      )

      const getBindValue = computed(() => ({ ...props } as Recordable))

      //预览
      function preview(url: string, fileType: number) {
        // if (fileType === (FileTypeEnum.Picture || FileTypeEnum.Pdf || FileTypeEnum.Word || FileTypeEnum.Audio || FileTypeEnum.Video)) {
        if ([FileTypeEnum.Picture, FileTypeEnum.Pdf, FileTypeEnum.Word, FileTypeEnum.Audio, FileTypeEnum.Video].includes(fileType)) {
          state.showModal = true
          state.previewUrl = url
        } else {
          window.open(url)
        }
      }

      //删除
      function remove(index: number) {
        dialog.info({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            const deleteFile = state.imgList[index]
            state.imgList.splice(index, 1)
            emit('update:value', state.imgList)
            // emit('delete', state.imgList)
            if (props.isSuccessBack) {
              emit('deleteFile', deleteFile)
            }
          },
          onNegativeClick: () => {}
        })
      }

      function checkFileType(acceptType, fileType: string) {
        const index = fileType.lastIndexOf('.')
        const type = '.' + fileType.substring(index + 1, fileType.length)
        return acceptType.indexOf(type) === -1 ? false : true
      }

      //上传之前
      function beforeUpload({ file }) {
        const fileInfo = file.file
        const { accept } = props
        const acceptRef = (isString(accept) && accept.split(',')) || []

        // 设置最大值，则判断
        // if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
        //   message.error(`上传文件最大值不能超过${maxSize}M`)
        //   return false
        // }
        // 设置类型,则判断
        // const fileType = componentSetting.upload.fileType
        if (acceptRef.length > 0 && !checkFileType(acceptRef, fileInfo.name)) {
          message.error(`只能上传文件类型为${acceptRef}`)
          return false
        }
        message.warning('文件上传中...')
        state.file = fileInfo // File文件实体
        return true
      }
      // 自定义上传请求
      // const customRequest = ({ file, action, withCredentials, headers, onFinish }) => {
      //   const formData = new FormData()
      //   const showType = ['.m4a', '.mov', '.mp3', '.mp4', '.wav', '.mpeg']
      //   const showTime = checkFileType(showType, file.file.type)
      //   formData.append('file', file.file)
      //   if (state.fileTotalPlaybackTime && showTime) {
      //     formData.append('fileTotalPlaybackTime', state.fileTotalPlaybackTime)
      //   }
      //   axios
      //     .post(action as string, formData, {
      //       withCredentials,
      //       headers
      //     } as any)
      //     .then(() => {
      //       onFinish()
      //     })
      // }
      //上传结束
      function finish({ event: Event }) {
        const res = eval('(' + Event.target.response + ')')
        const infoField = componentSetting.upload.apiSetting.infoField
        const { code } = res
        const message = res.msg || res.message || '上传失败'
        const result = res[infoField]
        //成功
        if (code === ResultEnum.SUCCESS) {
          state.imgList.push(result)
          emit('update:value', state.imgList, state.file)
          if (props.isSuccessBack) {
            emit('onSuccess')
          }
        } else message.error(message)
      }

      // 是否显示文件播放时长输入框
      // const judgeShowType = () => {
      //   const { accept } = props
      //   const acceptRef = (isString(accept) && accept.split(',')) || []
      //   const showType = ['.m4a', '.mov', '.mp3', '.mp4', '.wav', '.mpeg']
      //   state.isShowPlaybackTime = acceptRef.some((item) => {
      //     return showType.includes(item)
      //   })
      // }
      // onMounted(() => {
      //   judgeShowType()
      // })

      return {
        FileTypeEnum,
        ...toRefs(state),
        finish,
        preview,
        remove,
        getBindValue,
        beforeUpload,
        // customRequest,
        getCSSProperties,
        userStore
      }
    }
  })
</script>

<style lang="less">
  .upload {
    width: 100%;
    overflow: hidden;

    &-card {
      width: auto;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      &-item {
        margin: 0 8px 8px 0;
        position: relative;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        &:hover {
          background: 0 0;

          .upload-card-item-info::before {
            opacity: 1;
          }

          &-info::before {
            opacity: 1;
          }
        }

        &-info {
          position: relative;
          height: 100%;
          padding: 0;
          overflow: hidden;

          &:hover {
            .img-box-actions {
              opacity: 1;
            }
          }

          &::before {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.3s;
            content: ' ';
          }

          .img-box {
            position: relative;
            //padding: 8px;
            //border: 1px solid #d9d9d9;
            border-radius: 2px;
          }

          .img-box-actions {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 10;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:hover {
              background: 0 0;
            }

            .action-icon {
              color: rgba(255, 255, 255, 0.85);

              &:hover {
                cursor: pointer;
                color: #fff;
              }
            }
          }
        }
      }

      &-item-select-picture {
        border: 1px dashed #3a669e;
        border-radius: 2px;
        cursor: pointer;
        background: #072a47;
        color: rgba(255, 255, 255, 0.82);

        .upload-title {
          color: rgba(255, 255, 255, 0.82);
        }
      }
      &-item-select-picture-white {
        border: 1px dashed #d9d9d9 !important;
        border-radius: 2px;
        cursor: pointer;
        background: #fafafa !important;
        color: #666 !important;

        .upload-title {
          color: #666 !important;
        }
      }
    }
  }
</style>

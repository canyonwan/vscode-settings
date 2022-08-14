<script setup lang="ts">
  import type { IFileItem } from '@/api/program/types'
  import { importPersonnel } from '@/api/user/personnel'
  import { downloadFile, blobToString } from '@/utils/download-file'
  import { useMessage } from 'naive-ui'

  const formRef = ref()
  const props = defineProps({
    orgId: {
      type: String,
      default: ''
    }
  })
  const emit = defineEmits(['submit-handler'])

  const rules = {
    fileSie: {
      required: true,
      message: '请上传文件',
      trigger: ['blur', 'change']
    }
  }

  interface IState {
    fileTemp: File[]
    fileSize: string
  }

  const searchState: IState = reactive({
    fileSize: '',
    fileTemp: []
  })

  function handleUpload(_: IFileItem[], file: File) {
    searchState.fileTemp = file ? [file] : []
    searchState.fileSize = file && file.size.toString()
  }

  const message = useMessage()

  function handleSubmit() {
    formRef.value.validate(async (err) => {
      if (!err) {
        // TODO 待完成调试人员导入
        const res = await importPersonnel({ file: searchState.fileTemp[0], orgId: props.orgId })
        blobToString(res).then((resString) => {
          const ret = JSON.parse(resString)
          if (!ret.hasOwnProperty('data')) {
            downloadFile(res, '问题表格.xls')
          } else {
            message.success(ret.message || '导入成功')
          }
        })
        emit('submit-handler')
      }
    })
  }
</script>
<template>
  <div class="import-personnel">
    <n-form :model="searchState" ref="formRef" :rules="rules" :inline="false">
      <n-form-item ref="fileRef" label="上传文件" label-placement="left" path="fileSize">
        <BasicUpload :max="1" @update:value="handleUpload" accept=".xls,.xlsx" />
      </n-form-item>
      <div class="float-right">
        <n-button type="primary" @click="handleSubmit" :disabled="!searchState.fileSize">确定</n-button>
      </div>
    </n-form>
  </div>
</template>

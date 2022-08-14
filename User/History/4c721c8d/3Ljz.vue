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

  const loading = ref(false)

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
        loading.value = true
        const res = await importPersonnel({ file: searchState.fileTemp[0], orgId: props.orgId })
        if (res.type === 'application/json') {
          const res2 = await blobToString(res)
          const jsonResult = JSON.parse(res2)
          if (jsonResult.code === 2000) {
            emit('submit-handler')
            message.success('导入成功🎉')
          } else {
            message.error(jsonResult.message ?? '导入失败')
          }
        } else {
          message.error('导入失败,请查看下方的问题表格')
          downloadFile(res, '问题表格.xls')
        }

        loading.value = false
      }
    })
  }

  function downloadTemplate() {
    window.open('http://27.128.193.219:12001/dev_files/filestorage/1658970945903.xlsx')
  }
</script>
<template>
  <n-spin :show="loading" class="import-personnel">
    <n-form-item label="">
      <n-button type="primary" ghost size="medium" @click="downloadTemplate" class="ml-16">下载人员模板</n-button>
    </n-form-item>
    <n-form :model="searchState" ref="formRef" :rules="rules" :inline="false">
      <n-form-item ref="fileRef" label="上传文件" label-placement="left" path="fileSize">
        <BasicUpload :max="1" @update:value="handleUpload" accept=".xls,.xlsx" />
      </n-form-item>
      <div class="float-right">
        <n-button type="primary" @click="handleSubmit" :disabled="!searchState.fileSize">确定</n-button>
      </div>
    </n-form>
  </n-spin>
</template>

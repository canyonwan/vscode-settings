<template>
  <div class="import-excel">
    <a-spin :spinning="loading">
      <a-row>
        <div style="padding-right: 30px">
          <a-button @click="downloadTemplate" type="link">
            <template #icon><VerticalAlignBottomOutlined /></template>
            下载模板
          </a-button>
        </div>
        <a-upload accept=".xls, .xlsx" :showUploadList="false" :customRequest="onCustomRequest">
          <a-button shape="round">
            <template #icon><DownloadOutlined /></template>
            导入Excel
          </a-button>
        </a-upload>
      </a-row>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { DownloadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { Upload } from 'ant-design-vue'
import { downLoadFile, blobToString } from '@/utils'
import { fetchImportExcel } from '@/api/subject/certificate'
import { importTemplate } from '@/@types'

export default defineComponent({
  name: 'ImportExcel',
  emits: ['onSave'],
  components: {
    'a-upload': Upload,
    DownloadOutlined,
    VerticalAlignBottomOutlined
  },
  setup(props, ctx) {
    const internalInstance = getCurrentInstance()
    const state = reactive({
      loading: false
    })
    const downloadTemplate = () => {
      window.open(importTemplate.certificate)
    }
    const onCustomRequest = (options: any) => {
      state.loading = true
      let params = new FormData()
      params.append('file', options.file)
      fetchImportExcel(params).then(
        (result) => {
          console.log('%c [ result ]-52', 'font-size:13px; background:#0095FF; color:white;', result)
          state.loading = false
          if (result.type === 'application/json') {
            blobToString(result).then((resultString) => {
              const ret = JSON.parse(resultString)
              if (ret.code === 1000) {
                internalInstance?.appContext.config.globalProperties.$message.success('导入成功')
                ctx.emit('onSave')
              } else {
                internalInstance?.appContext.config.globalProperties.$message.error(`${ret.message}`)
              }
            })
          } else {
            internalInstance?.appContext.config.globalProperties.$message.warning('导入失败，请仔细检查问题表格')
            // 下载错误文件流
            downLoadFile(result, '导入问题表格.xls')
          }
        },
        () => {
          state.loading = false
        }
      )
    }
    return { ...toRefs(state), downloadTemplate, onCustomRequest }
  }
})
</script>

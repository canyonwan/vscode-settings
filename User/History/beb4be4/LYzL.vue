<template>
  <div class="import-account">
    <a-spin :spinning="loading">
      <a-button class="mg-left-top" type="link" @click="downloadTemplate()">
        <template #icon><VerticalAlignBottomOutlined /></template>
        下载模板
      </a-button>
      <a-upload :showUploadList="false" :customRequest="handleChange">
        <a-button shape="round" class="mg-left-top btn-min-w">
          <template #icon><DownloadOutlined /></template>
          导入Excel
        </a-button>
      </a-upload>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { Upload } from 'ant-design-vue'
import { DownloadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { importAccountExcel } from '@/api/supervise/machine-account'
import { blobToString, downLoadFile } from '@/utils'
import { importTemplate } from '@/@types'
export default defineComponent({
  name: 'ImportAccount',
  components: {
    'a-upload': Upload,
    DownloadOutlined,
    VerticalAlignBottomOutlined
  },
  props: {
    accountType: {
      type: Number,
      default: 1
    }
  },
  setup(props, context) {
    const internalInstance = getCurrentInstance()
    const loading = ref(false)
    const downloadTemplate = () => {
      if (props.accountType === 1) {
        // 许可
        window.open(importTemplate.administrativeLicense)
      } else if (props.accountType === 2) {
        // 处罚
        window.open(importTemplate.administrativePunish)
      } else {
        // 检查
        window.open(importTemplate.administrativeInspection)
      }
    }
    const handleChange = (info: any) => {
      let params = new FormData()
      if (props.accountType === 3) {
        params.append('inspectionCaseFile', info.file)
      } else {
        params.append('file', info.file)
      }
      loading.value = true
      importAccountExcel(params, props.accountType).then(
        (data) => {
          console.log('%c [ data ]-63', 'font-size:13px; background:#0095FF; color:white;', data)
          if (data.type === 'application/json') {
            blobToString(data).then((dataString) => {
              let ret = JSON.parse(dataString)
              if (ret.code === 1000) {
                internalInstance?.appContext.config.globalProperties.$message.success('导入成功')
                context.emit('okSave')
              } else {
                internalInstance?.appContext.config.globalProperties.$message.error(`${ret.message}`)
              }
            })
          } else {
            internalInstance?.appContext.config.globalProperties.$message.warning('导入失败，请仔细检查问题表格')
            downLoadFile(data, '导入问题表格.xls')
          }
          loading.value = false
        },
        () => {
          loading.value = false
        }
      )
    }
    return {
      loading,
      downloadTemplate,
      handleChange
    }
  }
})
</script>

<style></style>

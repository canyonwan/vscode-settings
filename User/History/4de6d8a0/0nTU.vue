<template>
  <div class="import-member">
    <a-spin :spinning="loading">
      <a-button class="mg-left-top" type="link" @click="downloadTemplate">
        <template #icon><VerticalAlignBottomOutlined /></template>
        下载模板
      </a-button>
      <a-upload :showUploadList="false" :customRequest="handleChange" class="mg-left-top">
        <a-button class="mg-left-top" shape="round">
          <template #icon><DownloadOutlined /></template>
          导入人员
        </a-button>
      </a-upload>
      <div class="care">
        注意事项：<br />
        1. 请用下载的模板填写并导入人员信息。<br />
        2. 此处导入的人员在其他人员栏目可以查看。<br />
        3. 导入的人员有证件号码需要导入的请再从证件管理下载导入模板并导入证件信息。<br />
        4. 证件号码导入后，有执法证件的可以在执法人员栏目查看，有监督证件的可以在执法监督人员栏目进行查看。
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { Upload } from 'ant-design-vue'
import { DownloadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { importMemberInfo } from '@/api/subject/personnel'
import { downLoadFile, blobToString } from '@/utils'
import { importTemplate } from '@/@types'
export default defineComponent({
  name: 'ImportMember',
  components: {
    'a-upload': Upload,
    DownloadOutlined,
    VerticalAlignBottomOutlined
  },
  setup(props, context) {
    const loading = ref(false)
    const internalInstance = getCurrentInstance()
    const downloadTemplate = () => {
      window.open(importTemplate.user)
    }
    const handleChange = (info: any) => {
      loading.value = true
      let params = new FormData()
      params.append('excelFile', info.file)
      importMemberInfo(params).then(
        (data) => {
          loading.value = false
          if (data.type === 'application/json') {
            blobToString(data).then((dataString: any) => {
              const ret = JSON.parse(dataString)
              if (ret.code === 1000) {
                internalInstance?.appContext.config.globalProperties.$message.success('导入成功')
                context.emit('okSave')
              } else {
                internalInstance?.appContext.config.globalProperties.$message.error(`${ret.message}`)
              }
            })
          } else {
            internalInstance?.appContext.config.globalProperties.$message.warning('导入失败，请仔细检查问题表格')
            // 下载错误文件流
            downLoadFile(data, '导入问题表格.xls')
          }
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
<style lang="less" scoped>
.import-member {
  .care {
    font-size: 10px;
    margin-top: 25px;
    color: #d02902;
  }
}
</style>

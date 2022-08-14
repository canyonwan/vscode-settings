<template>
  <div class="import-excel">
    <a-spin :spinning="loading">
      <a-radio-group class="marginBottom" v-model:value="checkedObj.templateName" @change="onRadioChange">
        <a-radio v-for="(item, index) in radioGroupField" :key="index" :value="item.templateName">{{ item.templateName }}</a-radio>
      </a-radio-group>
      <a-row>
        <a-button class="mg-left-top" type="link" shape="round" @click="downloadTemplate">
          <template #icon><VerticalAlignBottomOutlined /></template>
          下载模板
        </a-button>
        <a-upload class="mg-left-top" accept=".xls, .xlsx" :showUploadList="false" :customRequest="onImportExcel">
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
import { StateType, UserType } from '@/@types/index'
import { importIndividualUnitExcel, individualUnitArray, IndividualUnitItemType } from '@/api/statistics'
import { blobToString, downLoadFile } from '@/utils'
import { Radio, Upload } from 'ant-design-vue'
import { defineComponent, reactive, toRefs, getCurrentInstance } from 'vue'
import { DownloadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ImportExcel',
  components: {
    DownloadOutlined,
    VerticalAlignBottomOutlined,
    'a-radio': Radio,
    'a-upload': Upload,
    'a-radio-group': Radio.Group
  },
  emits: ['onSave'],
  setup(props, ctx) {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const state = reactive({
      loading: false,
      checkedObj: {} as IndividualUnitItemType,
      radioGroupField: [] as IndividualUnitItemType[] // 遍历项
    })
    const customMap = new Map()
      .set(individualUnitArray[0].templateName, individualUnitArray[0])
      .set(individualUnitArray[1].templateName, individualUnitArray[1])
      .set(individualUnitArray[2].templateName, individualUnitArray[2])
      .set(individualUnitArray[3].templateName, individualUnitArray[3])
      .set(individualUnitArray[4].templateName, individualUnitArray[4])

    // 是司法局且是单位主帐号
    // 行政检查->各单位 / 全部->县市司法局
    if (user.isJustice && user.organizationType === 1 && (user.districtType === 2 || user.districtType === 3)) {
      state.radioGroupField = individualUnitArray
      state.checkedObj = { ...state.radioGroupField[0] }
    } else {
      state.radioGroupField = individualUnitArray.slice(4)
      state.checkedObj = { ...state.radioGroupField[0] }
    }
    // Radio change
    const onRadioChange = ({ target }: any) => {
      state.checkedObj = { ...customMap.get(target.value) }
    }

    // 下载模板
    const downloadTemplate = () => window.open(state.checkedObj.templateUrl)

    // 导入
    const onImportExcel = (options: any) => {
      debugger
      state.loading = true
      let params = new FormData()
      params.append('file', options.file)
      importIndividualUnitExcel(state.checkedObj.importUrl, params).then(
        (result) => {
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

    return { individualUnitArray, ...toRefs(state), onRadioChange, onImportExcel, downloadTemplate }
  }
})
</script>

<style lang="less" scoped>
.import-excel {
}
</style>

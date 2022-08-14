<template>
  <div class="enforce-documents-index">
    <a-row type="flex" :gutter="15" style="padding-bottom: 20px">
      <a-col :span="4">
        <div class="item" :class="{ 'selected-item': selectedType === 1 }" @click="onSelect(1)">
          <div>
            <FileTextFilled class="icon" style="color: #f25768" />&nbsp;&nbsp;
            <span class="title">{{ enumData[0]?.enumDescription }}</span>
          </div>
          <div class="total">
            <span class="total-num1">{{ statisticsCountObj.permitTotal }}</span
            ><span>&nbsp;个</span>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="item" :class="{ 'selected-item': selectedType === 2 }" @click="onSelect(2)">
          <div>
            <FileTextFilled class="icon" style="color: #f08236" />&nbsp;&nbsp;
            <span class="title">{{ enumData[1]?.enumDescription }}</span>
          </div>
          <div class="total">
            <span class="total-num2">{{ statisticsCountObj.punishTotal }}</span
            ><span>&nbsp;个</span>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="item" :class="{ 'selected-item': selectedType === 3 }" @click="onSelect(3)">
          <div>
            <FileTextFilled class="icon" style="color: #6a6cf4" />&nbsp;&nbsp;
            <span class="title">{{ enumData[2]?.enumDescription }}</span>
          </div>
          <div class="total">
            <span class="total-num3">{{ statisticsCountObj.inspectTotal }}</span
            ><span>&nbsp;个</span>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="item" :class="{ 'selected-item': selectedType === 4 }" @click="onSelect(4)">
          <div>
            <FileTextFilled class="icon" style="color: #1e61d7" />&nbsp;&nbsp;
            <span class="title">{{ enumData[3]?.enumDescription }}</span>
          </div>
          <div class="total">
            <span class="total-num4">{{ statisticsCountObj.collectionTotal }}</span
            ><span>&nbsp;个</span>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="item" :class="{ 'selected-item': selectedType === 5 }" @click="onSelect(5)">
          <div>
            <FileTextFilled class="icon" style="color: #07a67e" />&nbsp;&nbsp;
            <span class="title">{{ enumData[4]?.enumDescription }}</span>
          </div>
          <div class="total">
            <span class="total-num5">{{ statisticsCountObj.expropriationTotal }}</span
            ><span>&nbsp;个</span>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="item" :class="{ 'selected-item': selectedType === 6 }" @click="onSelect(6)">
          <div>
            <FileTextFilled class="icon" style="color: #de7af1" />&nbsp;&nbsp;
            <span class="title">{{ enumData[5]?.enumDescription }}</span>
          </div>
          <div class="total">
            <span class="total-num6">{{ statisticsCountObj.confirmTotal }}</span
            ><span>&nbsp;个</span>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-card hoverable>
      <div class="marginBottom search-div flex-between">
        <div>
          <span class="mg-left-top">
            <label>文书模板名称：</label>
            <a-input v-model:value="searchData.templateName" placeholder="请输入文书模板名称" allowClear style="width: 200px" />
          </span>
          <a-button type="primary" class="mg-left-top" shape="round" @click="onSearchData">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
        </div>
        <a-button v-if="user.isJustice && user.districtType === 2" class="marginLeft10" shape="round" @click="importDocumentTemplates"><DownloadOutlined />导入文书样本</a-button>
      </div>
      <a-table
        bordered
        :scroll="{ x: 800, y: 'calc(100vh - 420px)' }"
        :dataSource="dataSources"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="'id'"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" @click="onDownload(record)">下载</a-button>
            <a-button type="link" size="small" style="color: red" @click="onDelete(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="showImportModal" title="导入文书" :footer="null" width="40%" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <import-modal @closeModal="showImportModal = false" @onOkSave="onSave" :type="searchData.type" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { StateType, UserType } from '@/@types/index'
import { deleteEnforceDocument, EnforceDocType, EnforceDocumentStatisticsCountType, EnumDataType, queryEnforceDocuments, queryStatisticsForEnforceDocument } from '@/api/statistics'
import enumFactory from '@/common-api/enum'
import { createVNode, defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { FileTextFilled, DownloadOutlined, CloseCircleFilled, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import ImportModal from './import-modal.vue'
export default defineComponent({
  name: 'EnforceDocumentsIndex',
  components: { FileTextFilled, DownloadOutlined, CloseCircleFilled, ImportModal, SearchOutlined },
  setup() {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const searchData = reactive({
      pageIndex: 1,
      pageSize: 10,
      type: 1,
      templateName: ''
    })
    const state = reactive({
      loading: false,
      statisticsCountObj: {} as EnforceDocumentStatisticsCountType,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      showImportModal: false,
      selectedType: 1,
      dataSources: [] as EnforceDocType[],
      enumData: [] as EnumDataType[],
      columns: [
        {
          title: '文书模板名称',
          dataIndex: 'templateName'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.updateTime)
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 135
        }
      ]
    })

    // 获取枚举数据
    const getEnumData = async () => {
      const { enforcementDocumentType } = await enumFactory(['enforcementDocumentType'])
      state.enumData = enforcementDocumentType
    }

    // 获取分页
    const getData = (type: number) => {
      searchData.type = type
      state.loading = true
      searchData.pageIndex = state.pagination.current
      searchData.pageSize = state.pagination.pageSize
      queryEnforceDocuments(searchData).then(
        (res: any) => {
          state.dataSources = res.data.data
          state.pagination.total = res.data.dataCount
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }

    const onSearchData = () => {
      state.pagination.current = 1
      getData(searchData.type)
    }
    // 分页改变
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData(searchData.type)
    }
    // 切换顶部选项卡
    const onSelect = (type: number) => {
      state.selectedType = type
      getData(type)
    }
    // 顶部统计数
    const queryStatisticsCount = async () => {
      let res = await queryStatisticsForEnforceDocument()
      state.statisticsCountObj = res.data
    }

    const onDownload = (record: EnforceDocType) => record.fileUrl && window.open(record.fileUrl)

    const onDelete = (record: EnforceDocType) => {
      internalInstance?.appContext.config.globalProperties.$modal.confirm({
        title: '操作提示',
        content: '确认是否删除？',
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          deleteEnforceDocument(record.id).then(() => {
            getData(searchData.type)
            queryStatisticsCount()
          })
        }
      })
    }
    const importDocumentTemplates = () => {
      state.showImportModal = true
    }
    const onSave = () => {
      state.showImportModal = false
      getData(searchData.type)
      queryStatisticsCount()
    }

    onMounted(() => {
      getEnumData()
      onSelect(1)
      queryStatisticsCount()
    })

    return { ...toRefs(state), onSearchData, searchData, user, onSelect, onDownload, onDelete, importDocumentTemplates, onSave, handleTableChange }
  }
})
</script>

<style lang="less" scoped>
.enforce-documents-index {
  .selected-item {
    border: 2px solid #1461ee;
  }
  .item {
    padding: 14px 20px 0 20px;
    background-color: white;
    border-radius: 10px;
    cursor: pointer;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .total {
      :nth-child(1) {
        font-size: 32px;
        font-weight: bold;
      }
      :nth-child(2) {
        font-size: 12px;
        font-weight: bold;
        color: #a0bcee;
      }
    }
    .icon {
      opacity: 0.6;
      font-size: 18px;
    }
    .total-num1 {
      color: #f25768;
    }
    .total-num2 {
      color: #f08236;
    }
    .total-num3 {
      color: #6a6cf4;
    }
    .total-num4 {
      color: #1e61d7;
    }
    .total-num5 {
      color: #07a67e;
    }
    .total-num6 {
      color: #de7af1;
    }
  }
}
</style>

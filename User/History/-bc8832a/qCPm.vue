<template>
  <div class="record">
    <header-navigation>
      <span>
        <a-button class="mg-left-top" shape="round" style="background: transparent" @click="exportData" :loading="exportLoading">
          <template #icon><UploadOutlined /></template>
          导出数据
        </a-button>
        <a-button class="mg-left-top" type="link" style="color: #222222" @click="onSetUpColumn"><SettingOutlined />设置</a-button>
      </span>
    </header-navigation>
    <a-card hoverable>
      <div class="search-div marginBottom">
        <span class="mg-left-top">
          <label>单位名称：</label>
          <selector-unit v-model:unitId="searchData.unitOrganizationId" :showType="1"></selector-unit>
        </span>
        <span class="mg-left-top">
          <label>处罚决定书文号：</label>
          <a-input placeholder="请输入处罚决定书文号" v-model:value="searchData.penaltyDecisionDocumentNumber" allowClear style="width: 160px"></a-input>
        </span>
        <span class="mg-left-top">
          <label>送达日期：</label>
          <a-rangle v-model:value="timeR" style="width: 200px"></a-rangle>
        </span>
        <span class="mg-left-top">
          <label>状态：</label>
          <a-radio-group v-model:value="searchData.majorAdministrativePenaltyRecordStatus" button-style="solid">
            <a-radio-button :value="0">全部</a-radio-button>
            <template v-for="item in recordStatus" :key="item.enumCode">
              <a-radio-button :value="item.enumCode" v-if="item.enumCode !== '5'" :key="item.enumCode">{{ item.enumDescription }}</a-radio-button>
            </template>
          </a-radio-group>
        </span>
        <a-button type="primary" class="mg-left-top" shape="round" @click="resetInit"><SearchOutlined />查询</a-button>
      </div>
      <a-table
        bordered
        :data-source="dataSource"
        :columns="columns"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 340px)' }"
        :pagination="pagination"
        :loading="loading"
        rowKey="id"
        size="small"
        @change="handleTableChange"
      >
        <template #caseName="{ record }">
          <template v-if="record.caseName.length > 23">
            <a-tooltip>
              <template #title>
                <div>{{ record.caseName }}</div>
              </template>
              {{ record.caseName.substring(0, 23) + '...' }}
            </a-tooltip>
          </template>
          <template v-else> {{ record.caseName }}</template>
        </template>
        <template #majorAdministrativePenaltyRecordStatus="{ record }">
          <a-badge
            :status="
              record.majorAdministrativePenaltyRecordStatusId === 2
                ? 'error'
                : record.majorAdministrativePenaltyRecordStatusId === 1 || record.majorAdministrativePenaltyRecordStatusId === 3
                ? 'warning'
                : 'processing'
            "
            :text="record.majorAdministrativePenaltyRecordStatusName"
          />
        </template>
        <template #action="{ record }">
          <a-button type="link" size="small" @click="checkDetail(record)" v-if="record.majorAdministrativePenaltyRecordStatusId === 4 || record.majorAdministrativePenaltyRecordStatusId === 3">
            查看详情
          </a-button>
          <a-button type="link" size="small" @click="recordReview(record.id)" v-if="user.isJustice && record.majorAdministrativePenaltyRecordStatusId === 2">备案审查</a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="checkDetailModel" title="查看详情" :footer="null" width="70%">
      <template #closeIcon><CloseCircleFilled /></template>
      <record-detail :recordDetail="recordDetailData"></record-detail>
    </a-modal>
    <a-modal v-model:visible="recordReviewModel" title="备案审查" :footer="null">
      <template #closeIcon><CloseCircleFilled /></template>
      <record-review :recordData="recordData" @closeModal="recordReviewModel = false" @onSave="recordSuccess"></record-review>
    </a-modal>
    <a-modal v-model:visible="setUpColumnModel" title="设置字段" :footer="null" width="70%" class="set-up-column-modal">
      <template #closeIcon><CloseCircleFilled /></template>
      <set-up-column @closeModal="setUpColumnModel = false" :defaultColumn="defaultColumn" @updateColumn="updateColumn"></set-up-column>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import HeaderNavigation from '@/views/layout/components/header-navigation.vue'
import SelectorUnit from '@/components/selector-unit/index.vue'
import SetUpColumn from '@/components/set-up-column/index.vue'
import RecordDetail from './components/record-detail.vue'
import RecordReview from './components/record-review.vue'
import { DatePicker, Radio, Tooltip, Badge } from 'ant-design-vue'
import { SearchOutlined, SettingOutlined, CloseCircleFilled, UploadOutlined } from '@ant-design/icons-vue'
import { exportRecordInfo, getRecordData, RecordForm, recordLog } from '@/api/supervise/record'
import enumFactory from '@/common-api/enum'
import { downLoadFile } from '@/utils'
import { StateType, UserType } from '@/@types'
import { useStore } from 'vuex'
import { TimeRangeValueType } from '@/api/subject/law-test'
export default defineComponent({
  name: 'Record',
  components: {
    HeaderNavigation,
    SelectorUnit,
    SetUpColumn,
    'a-rangle': DatePicker.RangePicker,
    'a-radio-group': Radio.Group,
    'a-radio-button': Radio.Button,
    'a-tooltip': Tooltip,
    'a-badge': Badge,
    SearchOutlined,
    SettingOutlined,
    CloseCircleFilled,
    UploadOutlined,
    RecordDetail,
    RecordReview
  },
  setup() {
    const internalInstance = getCurrentInstance()
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const state = reactive({
      loading: false,
      exportLoading: false,
      checkDetailModel: false, // 查看详情窗体
      recordDetailData: {}, // 重大案件详情数据
      recordReviewModel: false, //备案审查窗体
      recordData: {},
      setUpColumnModel: false, // 设置字段窗体
      defaultColumn: [] as any,
      timeR: [] as any as TimeRangeValueType,
      searchData: {
        unitOrganizationId: undefined,
        penaltyDecisionDocumentNumber: '',
        majorAdministrativePenaltyRecordStatus: 0
      } as RecordForm,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      columns: [
        {
          title: '单位名称',
          dataIndex: 'subjectOrganName',
          width: 200
        },
        {
          title: '案件名称',
          dataIndex: 'caseName',
          width: 200,
          slots: { customRender: 'caseName' }
        },
        {
          title: '处罚决定书文号',
          dataIndex: 'penaltyDecisionDocumentNumber',
          width: 170
        },
        {
          title: '处理结果',
          dataIndex: 'administrativePenaltyTypeName',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'majorAdministrativePenaltyRecordStatusName',
          width: 100,
          slots: { customRender: 'majorAdministrativePenaltyRecordStatus' }
        },
        {
          title: '结案日期',
          dataIndex: 'closingTime',
          width: 100,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.closingTime, '{y}-{m}-{d}')
            }
          }
        },
        {
          title: '处罚决定生效日期(送达日期)',
          dataIndex: 'serviceTime',
          width: 130,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.serviceTime, '{y}-{m}-{d}')
            }
          }
        },
        {
          title: '预警天数',
          dataIndex: 'majorAlarmDays',
          width: 80
        },
        {
          title: '拘留天数',
          dataIndex: 'detentionDays',
          width: 80
        },
        {
          title: '没收违法所得/非法财务价值(万元)',
          dataIndex: 'illegalGainsAndPropertyConfiscationValue',
          width: 130
        },
        {
          title: '罚没金额(万元)',
          dataIndex: 'confiscationAmount',
          width: 110
        },
        {
          title: '提交时间',
          dataIndex: 'majorSubmitTime',
          width: 100,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.majorSubmitTime, '{y}-{m}-{d}')
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      recordStatus: [] // 重大备案状态
    })
    const getData = (type = 0) => {
      let params = { ...state.searchData }
      if (state.timeR.length > 0) {
        params.serviceTimeStart = internalInstance?.appContext.config.globalProperties.$parseTime(state.timeR[0], '{y}-{m}-{d} 00:00:00')
        params.serviceTimeEnd = internalInstance?.appContext.config.globalProperties.$parseTime(state.timeR[1], '{y}-{m}-{d} 23:59:59')
      }
      if (params.unitOrganizationId) {
        params.unitOrganizationSearchParam = 1 // 有单位id说明查询的自己
      } else {
        params.unitOrganizationId = user.unitOrgId
        params.unitOrganizationSearchParam = 2 // 没有查同级
      }
      params.pageIndex = state.pagination.current
      params.pageSize = state.pagination.pageSize
      if (!type) {
        state.loading = true
        getRecordData(params).then(
          (result) => {
            state.dataSource = result.data.data
            state.pagination.total = result.data.dataCount
            state.loading = false
          },
          () => {
            state.loading = false
          }
        )
      } else {
        state.exportLoading = true
        exportRecordInfo(params).then(
          (data) => {
            const exportList = data
            downLoadFile(exportList, '重大行政处罚备案审查信息表格.xls')
            state.exportLoading = false
          },
          () => {
            state.exportLoading = false
          }
        )
      }
    }
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    const resetInit = () => {
      state.pagination.current = 1
      getData()
    }
    // 查看详情
    const checkDetail = async (record: any) => {
      const result = await recordLog(record.id)
      if (result.data && result.data.length > 0) {
        state.recordDetailData = {
          base: record,
          recordLog: result.data
        }
        state.checkDetailModel = true
      } else {
        internalInstance?.appContext.config.globalProperties.$message.error('备案数据获取异常')
      }
    }
    // 备案审查
    const recordReview = async (id: string) => {
      const result = await recordLog(id)
      if (result.data && result.data.length > 0) {
        state.recordData = {
          recordId: id,
          files: result.data[result.data.length - 1].files
        }
        state.recordReviewModel = true
      } else {
        internalInstance?.appContext.config.globalProperties.$message.error('备案文件获取异常')
      }
    }
    // 设置字段
    const onSetUpColumn = () => {
      state.setUpColumnModel = true
    }
    const updateColumn = (column: any) => {
      state.columns = column
      state.setUpColumnModel = false
    }
    const exportData = () => {
      getData(1)
    }
    const getEnumData = async () => {
      const { majorAdministrativePenaltyRecordStatus } = await enumFactory(['majorAdministrativePenaltyRecordStatus'], 'business')
      state.recordStatus = majorAdministrativePenaltyRecordStatus
    }
    const recordSuccess = () => {
      // 备案成功回调
      state.recordReviewModel = false
      getData()
    }
    state.defaultColumn = state.columns
    getEnumData()
    resetInit()
    return {
      user,
      handleTableChange,
      resetInit,
      exportData,
      checkDetail,
      recordReview,
      onSetUpColumn,
      updateColumn,
      recordSuccess,
      ...toRefs(state)
    }
  }
})
</script>

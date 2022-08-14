<!--suppress ALL -->
<template>
  <div class="legal-knowledge-examination-training">
    <div>
      <header-navigation>
        <span style="float: right">
          <a-button class="mg-left" style="background: transparent" shape="round" :loading="exportLoading" @click="onExport">
            <template #icon><UploadOutlined /></template>
            导出数据
          </a-button>
          <template v-if="user.isJustice">
            <a-button class="mg-left" style="background: transparent" shape="round" @click="onTrainingRecord">
              <template #icon><HistoryOutlined /></template>
              培训记录
            </a-button>
            <a-button type="primary" class="mg-left button-color-warning" shape="round" @click="onInitiateTraining">
              <img src="../../../assets/subject/faqipeixun.png" alt="" width="16" style="margin-right: 6px" />
              发起培训
            </a-button>
          </template>
          <a-button type="primary" class="mg-left button-color-warning" v-if="currentHasTrainingForUnit && currentHasTrainingForUnit.trainId" shape="round" @click="onEnterForTraining">
            参加报名
          </a-button>
        </span>
      </header-navigation>
      <template v-if="user.isJustice">
        <transition name="sub-comments">
          <div class="echarts" v-show="showBox">
            <a-row class="training-select" type="flex" justify="space-between">
              <a-row>
                <a-col class="tab-text" style="color: #5de5c3">公共法律知识培训考试</a-col>
                <a-col class="tab-text">专业法律知识培训考试</a-col>
                <a-col class="tab-text">法律知识培训测试</a-col>
              </a-row>
              <div>
                <label style="color: white; padding-top: 4px">培训年份及名称: </label>
                <span class="mg-left">
                  <a-select v-model:value="searchData.trainId" @select="onSelect" style="width: 300px" placeholder="请选择">
                    <a-select-option v-for="item in trainingSelectList" :key="item.value" :value="item.value">{{ item.flag + '_' + item.label }}</a-select-option>
                  </a-select>
                </span>
                <span class="mg-left">
                  <label style="color: white; padding-top: 4px">市直单位合计: </label>
                  <a-switch v-model:checked="searchData.isTotal" @change="onSwitchChange" />
                </span>
              </div>
            </a-row>
            <a-row class="statistic" type="flex" justify="space-around">
              <a-col>
                <div class="value">
                  <span class="count">{{ statisticsTotal.signUpTotal ?? 0 }}</span>
                </div>
                <div class="tip">报名人数</div>
              </a-col>
              <a-col>
                <div class="value">
                  <span class="count">{{ statisticsTotal.joinTrainTotal ?? 0 }}</span>
                </div>
                <div class="tip">参训人数</div>
              </a-col>
              <a-col>
                <div class="value">
                  <span class="count">{{ statisticsTotal.joinTrainRate ?? 0 }}</span>
                  %
                </div>
                <div class="tip">参训率</div>
              </a-col>
              <a-col>
                <div class="value">
                  <span class="count">{{ statisticsTotal.joinExamRate ?? 0 }}</span>
                  %
                </div>
                <div class="tip">参考率</div>
              </a-col>
              <a-col>
                <div class="value">
                  <span class="count">{{ statisticsTotal.adoptRate ?? 0 }}</span>
                  %
                </div>
                <div class="tip">通过率</div>
              </a-col>
            </a-row>
            <chart-bar-line-mix
              ref="chatRef"
              v-if="barValue.length > 0"
              @selectBar="selectBar"
              :showDataZoom="barValue.length > 10"
              :chartData="barValue"
              class="chart"
              :splitLineY="false"
              lineStyleType="dashed"
              theme="dark"
              select="single"
            />
          </div>
        </transition>
        <div class="expandedButton" @click="onDisplay">
          <UpOutlined class="arrow" v-if="showBox" />
          <DownOutlined class="arrow" v-else />
        </div>
      </template>
    </div>
    <a-card hoverable style="margin: 20px 0">
      <div class="search-div marginBottom">
        <template v-if="!user.isJustice">
          <span class="mg-left-top">
            <label>机构名称：</label>
            <selector-organization style="width: 140px" v-model:agencyId="searchData.agencyId"></selector-organization>
          </span>
          <span class="mg-left-top">
            <label>培训年份及名称：</label>
            <a-select v-model:value="searchData.trainId" style="width: 300px" allowClear placeholder="请选择">
              <a-select-option v-for="item in trainingSelectList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </span>
        </template>
        <span class="mg-left-top">
          <label>姓名：</label>
          <a-input v-model:value="searchData.memberName" placeholder="请输入姓名" allowClear style="width: 140px" />
        </span>
        <span class="mg-left-top">
          <label>身份证号：</label>
          <a-input v-model:value="searchData.idCard" placeholder="请输入身份证号" allowClear style="width: 140px" />
        </span>
        <span class="mg-left-top">
          <label>执法证号：</label>
          <a-input v-model:value="searchData.certificatesLawCode" placeholder="请输入执法证号" allowClear style="width: 140px" />
        </span>
        <span class="mg-left-top">
          <label>是否通过：</label>
          <a-radio-group v-model:value="searchData.isAdopt">
            <a-radio :value="0">全部</a-radio>
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="2">未通过</a-radio>
          </a-radio-group>
        </span>
        <a-button type="primary" class="mg-left-top" shape="round" @click="onSearch">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
      </div>
      <a-table
        :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :scroll="{ x: 800, y: 'calc(100vh - 350px)' }"
        :dataSource="dataSources"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'isPassExam'">
            <template v-if="record.nowAchievement !== null && record.nowAchievement >= 60">
              <a-tag color="success">通过</a-tag>
            </template>
            <template v-else-if="record.nowAchievement !== null && record.nowAchievement < 60">
              <a-tag color="success">未通过</a-tag>
            </template>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" @click="onEditCurrentItem(record)"><EditFilled /></a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <!--    发起培训-->
    <a-modal width="40%" v-model:visible="showInitiateTrainModal" title="发起培训" :footer="null" :body-style="{ paddingLeft: '20px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <initiate-training @closeModal="showInitiateTrainModal = false" @onSave="onSaveInitiateTraining" />
    </a-modal>
    <!--    参加报名-->
    <a-modal width="50%" v-model:visible="showEnterForTrainingModal" title="参加报名" :footer="null" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <enter-for-training
        @closeModal="showEnterForTrainingModal = false"
        :trainingData="currentHasTrainingForUnit"
        v-if="currentHasTrainingForUnit && currentHasTrainingForUnit.trainId"
        :key="currentHasTrainingForUnit.trainId"
        @onSave="onSaveEnterForTraining"
      />
    </a-modal>
    <!--    编辑-->
    <a-modal width="30%" v-model:visible="showEditModal" title="编辑" :footer="null" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <edit @closeModal="showEditModal = false" :editData="currentRowData" @onSave="onSaveEdit" />
    </a-modal>
    <!--    培训记录-->
    <a-modal width="70%" v-model:visible="showTrainingRecordModal" title="培训记录" :footer="null">
      <template #closeIcon><CloseCircleFilled /></template>
      <training-record :refreshData="showTrainingRecordModal" @closeModal="showTrainingRecordModal = false" @onSave="onSaveTrainingRecord" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { StateType, UserType } from '@/@types/index'
import {
  CanSignUpTrainType,
  fetchExportForm,
  fetchPersonnelScoreList,
  fetchStatisticsData,
  fetchStatisticsTotal,
  PersonnelScoreItemType,
  queryCanEnterTrainingForCurrentUnit,
  queryTrainingList,
  SearchPersonnelScoreType,
  StatisticRootType,
  TrainingYearSelectType
} from '@/api/subject/law-test'
import { ChartBarLineMix } from '@/components/charts'
import SelectorOrganization from '@/components/selector-organization/index.vue'
import { downLoadFile } from '@/utils'
import HeaderNavigation from '@/views/layout/components/header-navigation.vue'
import Edit from '@/views/subject/law-test/components/edit.vue'
import EnterForTraining from '@/views/subject/law-test/components/enter-for-training.vue'
import InitiateTraining from '@/views/subject/law-test/components/initiate-training.vue'
import TrainingRecord from '@/views/subject/law-test/components/training-record.vue'
import { CloseCircleFilled, DownOutlined, EditFilled, HistoryOutlined, SearchOutlined, UploadOutlined, UpOutlined } from '@ant-design/icons-vue'
import { Radio, Select, Switch, Tag } from 'ant-design-vue'
import { defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'LegalKnowledgeTrainingExamination',
  components: {
    HeaderNavigation,
    InitiateTraining,
    Edit,
    TrainingRecord,
    EnterForTraining,
    'a-radio-group': Radio.Group,
    'a-radio': Radio,
    'a-tag': Tag,
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-switch': Switch,
    UploadOutlined,
    CloseCircleFilled,
    HistoryOutlined,
    SearchOutlined,
    EditFilled,
    UpOutlined,
    DownOutlined,
    SelectorOrganization,
    ChartBarLineMix
  },
  setup() {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const chatRef = ref()
    const searchData: SearchPersonnelScoreType = reactive({
      pageIndex: 1,
      pageSize: 10,
      certificatesLawCode: '', // 执法证号
      memberName: '', // 人员名称
      idCard: '', // 身份证号
      orgId: '', // 机关ID
      agencyId: '', // 机构ID
      trainId: undefined, // 培训id
      isTotal: false, // 是否合计
      isAdopt: 0 // 是否通过 0 1是 2否
    })
    const state = reactive({
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      exportLoading: false,
      statisticsTotal: {} as StatisticRootType,
      barValue: [] as any[],
      dataSources: [] as PersonnelScoreItemType[],
      trainingSelectList: [] as TrainingYearSelectType[],
      currentRowData: {},
      loading: false,
      showInitiateTrainModal: false,
      showEditModal: false,
      showTrainingRecordModal: false,
      showEnterForTrainingModal: false,
      showBox: true,
      currentHasTrainingForUnit: {} as CanSignUpTrainType,
      columns: [
        {
          title: '机构名称',
          dataIndex: ['memberInfoOutput', 'agencyOrganizationName']
        },
        {
          title: '姓名',
          width: 90,
          dataIndex: ['memberInfoOutput', 'memberName']
        },
        {
          title: '身份证号',
          dataIndex: ['memberInfoOutput', 'memberIdCard'],
          width: 140,
          ellipsis: true
        },
        {
          title: '执法证号',
          dataIndex: ['memberInfoOutput', 'certificateCode'],
          width: 140
        },
        {
          title: '学习时长（分钟）',
          dataIndex: 'nowStudyDuration',
          width: 140
        },
        {
          title: '考试成绩',
          dataIndex: 'nowAchievement',
          width: 80
        },
        {
          title: '是否通过',
          width: 80,
          dataIndex: 'isPassExam'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 80
        }
      ]
    })

    const getData = () => {
      searchData.pageIndex = state.pagination.current
      searchData.pageSize = state.pagination.pageSize
      searchData.orgId = searchData.isTotal ? '' : searchData.orgId
      state.loading = true
      fetchPersonnelScoreList(searchData).then(
        (result: any) => {
          state.pagination.total = result.data.dataCount
          state.dataSources = result.data.data
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }

    // 查询当前有无可参加的培训
    const queryCanEnterTraining = async () => {
      const res = await queryCanEnterTrainingForCurrentUnit()
      state.currentHasTrainingForUnit = res.data
    }
    // 查询下拉框数据
    const queryTrainingSelectList = () => {
      queryTrainingList().then((result: any) => {
        state.trainingSelectList = result.data
        if (result.data.length > 0) {
          searchData.trainId = result.data[0].value
          user.isJustice ? queryStatisticsData() : onSearch()
        }
      })
    }
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    const onSearch = () => {
      state.pagination.current = 1
      getData()
    }
    onMounted(() => {
      searchData.orgId = user.unitOrgId
      queryCanEnterTraining()
      queryTrainingSelectList()
    })
    const onExport = () => {
      state.exportLoading = true
      const params = { ...searchData }
      fetchExportForm(params).then(
        (result: any) => {
          downLoadFile(result, '人员成绩表格.xls')
          state.exportLoading = false
        },
        () => {
          state.exportLoading = false
        }
      )
    }
    // 发起培训
    const onInitiateTraining = () => (state.showInitiateTrainModal = true)

    const onSaveInitiateTraining = () => {
      queryTrainingSelectList()
      queryCanEnterTraining()
      state.showInitiateTrainModal = false
    }
    // 培训记录
    const onTrainingRecord = () => (state.showTrainingRecordModal = true)

    const onSaveTrainingRecord = () => (state.showTrainingRecordModal = false)

    // 参加报名
    const onEnterForTraining = () => (state.showEnterForTrainingModal = true)

    const onSaveEnterForTraining = () => {
      getData()
      queryCanEnterTraining()
      if (user.isJustice) {
        queryStatisticsTotal()
        queryStatisticsData()
      }
      state.showEnterForTrainingModal = false
    }
    // 编辑
    const onEditCurrentItem = (record: PersonnelScoreItemType) => {
      state.showEditModal = true
      const { id, nowStudyDuration, nowAchievement } = record
      state.currentRowData = { id, nowStudyDuration, nowAchievement }
    }
    // 柱状图
    const queryStatisticsData = (isLoadingFirst = false) => {
      fetchStatisticsData(searchData.trainId).then((result: any) => {
        state.barValue = result.data.map((item: any) => {
          return {
            orgId: item.orgId,
            name: item.orgName,
            value: item.signUpTotal
          }
        })
        if (isLoadingFirst) {
          nextTick(() => {
            chatRef.value.selectBarName(0)
          })
        }
      })
    }
    // 统计图总计数
    // 是否合计 合计不传orgId
    const queryStatisticsTotal = () => {
      let params = {
        trainId: searchData.trainId,
        isTotal: searchData.isTotal,
        orgId: searchData.isTotal ? null : searchData.orgId
      }
      fetchStatisticsTotal(params).then((result: any) => {
        state.statisticsTotal = result.data
      })
    }
    // 柱子被点击时
    const selectBar = (result: any) => {
      if (result) {
        searchData.isTotal = false
        searchData.orgId = result.orgId
        onSearch()
        queryStatisticsTotal()
      }
    }
    // 点击下拉框
    const onSelect = () => {
      searchData.isTotal = false
      queryStatisticsData(true)
    }
    // 合计开关
    const onSwitchChange = (value: any, _: Event) => {
      if (value) {
        queryStatisticsTotal()
        onSearch()
        chatRef.value.cancelSelectBarName()
      } else {
        chatRef.value.selectBarName(0)
      }
    }
    const onSaveEdit = () => {
      getData()
      state.showEditModal = false
    }
    const onDisplay = () => (state.showBox = !state.showBox)

    return {
      searchData,
      ...toRefs(state),
      user,
      chatRef,
      selectBar,
      onSelect,
      onExport,
      onSwitchChange,
      handleTableChange,
      onInitiateTraining,
      onSaveInitiateTraining,
      onEnterForTraining,
      onSaveEnterForTraining,
      onTrainingRecord,
      onSaveTrainingRecord,
      onSaveEdit,
      onSearch,
      onEditCurrentItem,
      queryTrainingSelectList,
      onDisplay
    }
  }
})
</script>

<style lang="less" scoped>
.legal-knowledge-examination-training {
  .expandedButton {
    margin: auto;
    width: 100px;
    height: 0;
    border-top: 20px solid #0f0c2a;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    position: relative;
    cursor: pointer;
    .arrow {
      color: white;
      position: absolute;
      bottom: 3px;
      left: 30px;
    }
  }
  .echarts {
    height: 450px;
    background-color: #0f0c2a;
    border-radius: 10px;
    overflow: hidden;
    .statistic {
      width: 100%;
      text-align: center;
      .value {
        font-size: 18px;
        line-height: normal;
        color: white;
        .count {
          font-size: 35px;
          font-family: @font-familyC;
        }
      }
      .tip {
        font-size: 8px;
        color: #999999;
      }
    }
    .chart {
      width: 100%;
      height: 340px;
    }
    .training-select {
      padding: 15px 50px;
      .tab-text {
        color: white;
        padding-right: 40px;
      }
      .ant-switch {
        background-color: #444a56 !important;
      }
      .ant-switch-checked {
        background-color: #87e8ab !important;
      }
      :deep(.ant-select-selector) {
        background-color: #444a56;
        color: white;
        border-radius: 20px;
        border: 0.5px solid white;
      }
    }
  }
  .sub-comments-enter-from,
  .sub-comments-leave-to {
    height: 0;
  }
  /*显示后和隐藏前的样式*/
  .sub-comments-leave-from,
  .sub-comments-enter-to {
    height: 450px;
  }
  /*显示和隐藏时的过渡效果*/
  .sub-comments-enter-active,
  .sub-comments-leave-active {
    transition: all 1s ease;
  }
}
</style>

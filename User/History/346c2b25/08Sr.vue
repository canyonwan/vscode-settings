<template>
  <div class="confiscation-permit">
    <top-menu @showModal="showModal" :orgType="searchData.type" :isJustice="searchData.level"></top-menu>
    <a-card hoverable>
      <div class="marginBottom search-div">
        <span class="mg-left-top">
          <label for="">单位名称：</label>
          <a-input v-model:value="searchData.judicialAgencyName" placeholder="请输入关键词搜索" allowClear style="width: 200px" />
        </span>
        <!-- <span class="mg-left-top">
          <label for="">提交时间：</label>
          <a-range-picker v-model:value="timeR" style="width: 220px" allowClear />
        </span> -->
        <span class="mg-left-top">
          <label for="">办理/年检年度：</label>
          <a-date-picker picker="year" v-model:value="submitYear" placeholder="请选择年份" format="YYYY年" style="width: 100px" />
        </span>
        <span class="mg-left-top">
          <label for="">审核状态：</label>
          <a-select v-model:value="searchData.status" style="width: 120px" allowClear :options="statusOption" placeholder="请选择状态"> </a-select>
        </span>
        <a-button type="primary" class="mg-left-top" shape="round" @click="resetInit">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
      </div>
      <a-table
        bordered
        :scroll="{ x: 'max-content', y: tHeight }"
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        size="small"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'confiscatedRoom'">
            <!-- 罚没机构 -->
            <a-tooltip v-if="record.confiscatedRoom && record.confiscatedRoom.length">
              <template #title>
                <span v-for="(item, index) in record.confiscatedRoom" :key="index">
                  {{ index === 0 ? item.house : ',' + item.house }}
                </span>
              </template>
              {{}}
            </a-tooltip>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-badge :status="record.status === 1 ? 'success' : record.status === 2 ? 'error' : 'warning'" :text="record.status === 1 ? '通过' : record.status === 2 ? '退回' : '待审核'" />
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-button type="link" danger size="small" v-if="user.isJustice" :disabled="record.status === 1 ? false : true" @click="delectSubmit(record)">重新审核</a-button>
            <a-button type="link" size="small" @click="showPermit(record.submitId)">查看</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="permitModal" title="罚没许可证办理/年检" :footer="null" width="55%" :bodyStyle="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <confiscation-permit-add :permitId="detailId" :permitStatus="permitStatus" v-if="permitModal" @okSave="okPermit"></confiscation-permit-add>
    </a-modal>
    <a-modal v-model:visible="reportModal" title="年检报告" :footer="null" width="55%">
      <template #closeIcon><CloseCircleFilled /></template>
      <annual-check-up-report></annual-check-up-report>
    </a-modal>
    <a-modal v-model:visible="reportAddModal" title="提交年检报告" :footer="null">
      <template #closeIcon><CloseCircleFilled /></template>
      <annual-check-up-report-add @showModal="showModal" @closeModal="reportAddModal = false"></annual-check-up-report-add>
    </a-modal>
    <a-modal v-model:visible="draftsModal" title="草稿箱" :footer="null" :width="600">
      <template #closeIcon><CloseCircleFilled /></template>
      <drafts @showPermit="showPermit" v-if="draftsModal"></drafts>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, getCurrentInstance, onMounted, createVNode, ref } from 'vue'
import TopMenu from './components/top-menu.vue'
import { SearchOutlined, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import ConfiscationPermitAdd from './components/confiscation-permit-add.vue'
import AnnualCheckUpReport from './components/annual-check-up-report.vue'
import AnnualCheckUpReportAdd from './components/annual-check-up-report-add.vue'
import Drafts from './components/drafts.vue'
import { judicialPermitList, SearchFrom, permitStatus, JudicialPermit, geReAudit } from '@/api/subject/confiscation-permit'
// import { TableState } from 'ant-design-vue/es/table/interface'
// type Pagination = TableState['pagination']
import { StateType, UserType } from '@/@types'
import { useStore } from 'vuex'
import { DatePicker, Select, Badge, Tooltip } from 'ant-design-vue'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'ConfiscationPermit',
  components: {
    TopMenu,
    SearchOutlined,
    ConfiscationPermitAdd,
    CloseCircleFilled,
    AnnualCheckUpReport,
    AnnualCheckUpReportAdd,
    Drafts,
    // 'a-range-picker': DatePicker.RangePicker,
    'a-date-picker': DatePicker,
    'a-select': Select,
    'a-badge': Badge,
    'a-tooltip': Tooltip
  },
  setup() {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const submitYear = ref<dayjs.Dayjs>(dayjs()) // 当前年份
    const searchData: SearchFrom = reactive({
      judicialAgencyName: '',
      // startTime: 0,
      // endTime: 0,
      year: undefined,
      status: null,
      type: user.districtType,
      level: user.isJustice,
      pageIndex: 1,
      pageSize: 10
    })
    const state = reactive({
      tHeight: window.innerHeight - 400,
      timeR: [],
      statusOption: [
        { value: 3, label: '待审核' },
        { value: 1, label: '通过' },
        { value: 2, label: '退回' }
      ],
      columns: [
        {
          title: '单位名称',
          dataIndex: 'agencyName',
          width: 150,
          customCell: (record: any) => {
            return {
              props: { rowSpan: record.rowSpan }
            }
          }
        },
        {
          title: '罚没主体名称',
          width: 150,
          dataIndex: 'confiscatedName'
        },
        {
          title: '罚没许可证编号',
          width: 150,
          dataIndex: 'licenseOriginal'
        },
        {
          title: '提交时间',
          dataIndex: 'writeTime',
          width: 150,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.writeTime),
              props: { rowSpan: record.rowSpan }
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 80,
          customCell: (record: any) => {
            return {
              props: { rowSpan: record.rowSpan }
            }
          }
        },
        {
          title: '单位地址',
          dataIndex: 'agencyAddress',
          width: 180,
          customCell: (record: any) => {
            return {
              props: { rowSpan: record.rowSpan }
            }
          }
        },
        {
          title: '法定代表人',
          width: 100,
          dataIndex: 'legalRepresentative'
        },
        {
          title: '罚没机构',
          width: 150,
          dataIndex: 'confiscatedRoom'
        },
        // {
        //   title: '执法职能',
        //   width: 200,
        //   dataIndex: 'confiscatedMatter',
        //   slots: { customRender: 'confiscatedMatter' }
        // },
        {
          title: '法制机构负责人',
          dataIndex: 'lawyer',
          width: 120,
          customCell: (record: any) => {
            return {
              props: { rowSpan: record.rowSpan }
            }
          }
        },
        {
          title: '联系电话',
          dataIndex: 'iphoneNumber',
          width: 110,
          customCell: (record: any) => {
            return {
              props: { rowSpan: record.rowSpan }
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: user.isJustice ? 140 : 60,
          fixed: 'right',
          customCell: (record: any) => {
            return {
              // children: [
              //   createVNode(
              //     Button,
              //     {
              //       type: 'link',
              //       size: 'small',
              //       disabled: record.status === 1 && user.isJustice ? false : true,
              //       danger: true,
              //       style: {
              //         color: record.status === 1 && user.isJustice ? '#D02902' : '#d9d9d9',
              //         display: user.isJustice ? 'inline-block' : 'none'
              //       },
              //       onClick: () => {
              //         delectSubmit(record)
              //       }
              //     },
              //     '重新审核'
              //   ),
              //   createVNode(
              //     Button,
              //     {
              //       type: 'link',
              //       size: 'small',
              //       onClick: () => {
              //         showPermit(record.submitId)
              //       }
              //     },
              //     '查看'
              //   )
              // ],
              props: { rowSpan: record.rowSpan }
            }
          }
        }
      ],
      dataSource: [] as any,
      loading: false,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      permitModal: false, // 办理modal
      reportModal: false, // 年检报告窗体
      reportAddModal: false, // 提交年检报告
      draftsModal: false, // 草稿箱modal
      detailId: '', // 详情的id
      permitStatus: '' // 该单位的罚没状态
    })
    const showModal = (type: number) => {
      if (type === 1) {
        state.detailId = ''
        state.permitModal = true
      } else if (type === 2) {
        state.reportAddModal = true
      } else if (type === 3) {
        state.reportModal = true
      } else if (type === 4) {
        state.permitModal = false
        state.draftsModal = true
      }
    }

    function test() {
      record.confiscatedRoom
        ? record.confiscatedRoom.length
          ? record.confiscatedRoom
              .map((item: any) => {
                return item.house
              })
              .join(',').length > 15
            ? record.confiscatedRoom
                .map((item: any) => {
                  return item.house
                })
                .join(',')
                .substring(0, 15) + '...'
            : record.confiscatedRoom
                .map((item: any) => {
                  return item.house
                })
                .join(',')
          : ''
        : ''
    }
    const showPermit = (id: string) => {
      state.draftsModal = false
      state.detailId = id
      // 草稿点击跳转
      state.permitModal = true
    }
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    const getData = () => {
      searchData.pageIndex = state.pagination.current
      searchData.pageSize = state.pagination.pageSize
      state.loading = true
      // if (state.timeR.length > 0) {
      //   searchData.startTime = new Date(internalInstance?.appContext.config.globalProperties.$parseTime(state.timeR[0], '{y}-{m}-{d} 00:00:00')).getTime()
      //   searchData.endTime = new Date(internalInstance?.appContext.config.globalProperties.$parseTime(state.timeR[1], '{y}-{m}-{d} 23:59:59')).getTime()
      // } else {
      //   searchData.startTime = undefined
      //   searchData.endTime = undefined
      // }
      if (submitYear.value) {
        searchData.year = submitYear.value.year()
      } else {
        searchData.year = undefined
      }
      judicialPermitList(searchData).then(
        (result) => {
          const showData = [] // 返回的数据需要处理成多行 并合并
          if (result.data.data && result.data.data.length > 0) {
            for (const item of result.data.data) {
              if (item.confiscatedSubject && item.confiscatedSubject.length > 0) {
                //循环罚没主体
                let row: any = {}
                for (let index = 0; index < item.confiscatedSubject.length; index++) {
                  row = {
                    id: item.submitId + '_' + index,
                    submitId: item.submitId,
                    agencyName: item.agencyName,
                    agencyCode: item.agencyCode,
                    agencyAddress: item.agencyAddress,
                    writeTime: item.writeTime,
                    lawyer: item.lawyer,
                    iphoneNumber: item.iphoneNumber,
                    status: item.status
                  }
                  if (index === 0) {
                    // 证明第一行
                    row.rowSpan = item.confiscatedSubject.length
                  } else {
                    row.rowSpan = 0
                  }
                  row = { ...row, ...item.confiscatedSubject[index] }
                  showData.push(row)
                }
              }
            }
          }
          if (showData && showData.length) {
            if (showData.length > state.pagination.pageSize) {
              state.pagination.pageSize = showData.length
            }
          }
          state.dataSource = showData
          state.pagination.total = result.data.dataCount
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }
    const resetInit = () => {
      state.pagination.current = 1
      getData()
    }
    // 重新审核
    const delectSubmit = (report: JudicialPermit) => {
      internalInstance?.appContext.config.globalProperties.$modal.confirm({
        title: '温馨提示',
        content: `您确认重新审核【${report.agencyName}】提交的材料吗?确认后部门会重新提交材料需要重新审核`,
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          geReAudit({ submitId: report.submitId }).then(() => {
            internalInstance?.appContext.config.globalProperties.$message.success(`请【${report.agencyName}】重新提交材料`, 5)
            resetInit()
            getPermitStatus()
          })
        }
      })
    }
    // 年检报告提交回调
    const okPermit = (type: number) => {
      if (type === 1) {
        // 提交回调刷新界面
        getData()
        getPermitStatus()
      }
      state.permitModal = false
    }
    const getPermitStatus = async () => {
      const result = await permitStatus()
      state.permitStatus = result.data
    }
    onMounted(() => {
      resetInit()
      getPermitStatus()
    })
    return {
      submitYear,
      user,
      showModal,
      showPermit,
      resetInit,
      searchData,
      handleTableChange,
      okPermit,
      delectSubmit,
      ...toRefs(state)
    }
  }
})
</script>

<template>
  <div class="training-record">
    <a-row>
      <a-form-item label="培训年份">
        <a-date-picker mode="year" v-model:value="currentYear" placeholder="请选择年份" format="YYYY" @openChange="openChangeOne" @panelChange="panelChangeOne" :open="yearShowOne" />
      </a-form-item>
    </a-row>
    <a-table
      bordered
      :scroll="{ x: 800, y: 'calc(100vh - 370px)' }"
      :dataSource="dataSources"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      rowKey="trainId"
      @change="handleTableChange"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'fileList'">
          <p style="color: blue; cursor: pointer" v-for="(item, index) in record.fileList" :key="index" @click="openFile(item.fileUrl)">{{ item.fileName }}</p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" size="small" @click="onSignUpRecord(record)">报名记录</a-button>
          <a-button type="link" size="small" v-if="!record.sendTime" @click="onSendSignUpForm(record)">发送报名表</a-button>
        </template>
      </template>
    </a-table>
    <!--    报名记录-->
    <a-modal width="70%" v-model:visible="showSignUpRecordModal" title="报名记录" :footer="null">
      <template #closeIcon><CloseCircleFilled /></template>
      <sign-up-record :refreshData="showSignUpRecordModal" :trainId="trainId" @closeModal="showSignUpRecordModal = false" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { StateType, UserType } from '@/@types/index'
import { fetchTrainingRecords, submitSignUpForm, TrainingInfoType } from '@/api/subject/law-test'
import SignUpRecord from '@/views/subject/law-test/components/sign-up-record.vue'
import dayjs, { Dayjs } from 'dayjs'
import { createVNode, defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { useStore } from 'vuex'
import { CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'TrainingRecord',
  components: {
    SignUpRecord,
    'a-date-picker': DatePicker,
    CloseCircleFilled
  },
  props: {
    refreshData: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    interface ISearch {
      pageIndex: number
      pageSize: number
      trainYear: number | undefined
    }
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const currentYear = ref<dayjs.Dayjs>(dayjs()) // 当前年份
    const state = reactive({
      loading: false,
      trainId: '',
      showSignUpRecordModal: false, // 报名记录
      yearShowOne: false,
      searchData: {
        pageIndex: 1,
        pageSize: 10,
        trainYear: undefined
      } as ISearch,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      dataSources: [] as TrainingInfoType[],
      columns: [
        {
          title: '培训年份',
          dataIndex: 'trainYear',
          width: 90
        },
        {
          title: '培训名称',
          dataIndex: 'trainName',
          width: 160
        },
        {
          title: '报名期间',
          children: [
            {
              title: '开始时间',
              dataIndex: 'signUpStartTime',
              width: 100,
              customCell: (record: any) => {
                return {
                  innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.signUpStartTime, '{y}-{m}-{d}')
                }
              }
            },
            {
              title: '结束时间',
              dataIndex: 'signUpEndTime',
              width: 100,
              customCell: (record: any) => {
                return {
                  innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.signUpEndTime, '{y}-{m}-{d}')
                }
              }
            }
          ]
        },
        {
          title: '培训及考试期间',
          dataIndex: 'trainStartTime',
          children: [
            {
              title: '开始时间',
              dataIndex: 'trainStartTime',
              width: 100,
              customCell: (record: any) => {
                return {
                  innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.trainStartTime, '{y}-{m}-{d}')
                }
              }
            },
            {
              title: '结束时间',
              dataIndex: 'trainEndTime',
              width: 100,
              customCell: (record: any) => {
                return {
                  innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.trainEndTime, '{y}-{m}-{d}')
                }
              }
            }
          ]
        },
        {
          title: '文件',
          dataIndex: 'fileList',
          width: 120
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: 100
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 180
        }
      ]
    })
    // 年选择器器弹出关闭
    const openChangeOne = (status: any) => {
      if (status) state.yearShowOne = true
    }
    // 得到年份选择器的值
    const panelChangeOne = (value: number) => {
      state.searchData.trainYear = value
      state.yearShowOne = false
      state.pagination.current = 1
      getData()
    }
    const openFile = (fileUrl: string) => {
      window.open(fileUrl)
    }
    const getData = () => {
      let params = { ...state.searchData }
      params.pageIndex = state.pagination.current
      params.pageSize = state.pagination.pageSize
      // params.trainYear = internalInstance?.appContext.config.globalProperties.$parseTime(state.searchData.trainYear, '{y}')
      // params.trainYear = state.searchData.trainYear.year()
      state.loading = true
      fetchTrainingRecords(params).then(
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
    // 报名记录
    const onSignUpRecord = (record: any) => {
      state.trainId = record.trainId
      state.showSignUpRecordModal = true
    }
    // 发送报名表
    const onSendSignUpForm = (record: any) => {
      internalInstance?.appContext.config.globalProperties.$modal.confirm({
        title: '操作提示',
        content: '您确认要发送报名表吗',
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          state.loading = true
          submitSignUpForm(record.trainId).then(
            () => {
              state.loading = false
              internalInstance?.appContext.config.globalProperties.$message.success('发送成功')
              getData()
            },
            () => {
              state.loading = false
            }
          )
        }
      })
    }
    const initData = () => {
      state.pagination.current = 1
      // state.searchData.trainYear = dayjs(internalInstance?.appContext.config.globalProperties.$parseTime(dayjs(new Date()), '{y}')) as any
      state.searchData.trainYear = currentYear.value.year()
      getData()
    }
    onMounted(() => {
      initData()
    })
    watch(
      () => props.refreshData,
      () => {
        if (props.refreshData) {
          getData()
        }
      }
    )
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    return { ...toRefs(state), openFile, user, currentYear, handleTableChange, openChangeOne, panelChangeOne, onSendSignUpForm, onSignUpRecord }
  }
})
</script>

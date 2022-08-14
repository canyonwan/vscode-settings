<!--办理情况: 办理列表-->
<template>
  <div class="handle-situation-list">
    <div style="padding: 20px 0">
      <label>办理状态: </label>
      <a-radio-group v-model:value="searchData.isFinished" @change="onChangeHandleStatus">
        <a-radio>全部</a-radio>
        <a-radio :value="true">已办理</a-radio>
        <a-radio :value="false">未办理</a-radio>
      </a-radio-group>
    </div>
    <a-table
      bordered
      :scroll="{ x: 'max-content', y: 400 }"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      size="small"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" size="small" @click="onViewCurrentItemDetail(record.id)">查看详情</a-button>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="matterDetailModal" title="查看详情" :footer="null" width="70%">
      <template #closeIcon><CloseCircleFilled /></template>
      <matter-detail
        :matterId="matterId"
        v-if="matterDetailModal"
        :isInform="true"
        :isLaunchMySelf="false"
        :isShowSamples="false"
        :handleId="doneId"
        @onSave="matterDetailModal = false"
        @closeModal="matterDetailModal = false"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { getMatterHandleSituationList, SearchDataType } from '@/api/matter'
import { Radio } from 'ant-design-vue'
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { CloseCircleFilled } from '@ant-design/icons-vue'
import MatterDetail from './matter-detail.vue'
export default defineComponent({
  name: 'handleSituationList',
  components: {
    'a-radio': Radio,
    'a-radio-group': Radio.Group,
    CloseCircleFilled,
    MatterDetail
  },
  props: {
    matterId: {
      type: String,
      default: '',
      return: true
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance()
    const state = reactive({
      loading: false,
      searchData: {} as SearchDataType,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      dataSource: [],
      columns: [
        {
          title: '单位名称',
          dataIndex: 'receiveOrgName'
        },
        {
          title: '接收时间',
          dataIndex: 'readTime',
          width: 170,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.readTime)
            }
          }
        },
        {
          title: '办结时间',
          dataIndex: 'finishedTime',
          width: 170,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.finishedTime)
            }
          }
        },
        {
          title: '承办人',
          dataIndex: 'doneUser',
          width: 200
        },
        {
          title: '联系电话',
          dataIndex: 'donePhone',
          width: 130
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 110
        }
      ],
      matterDetailModal: false, // 详情界面
      doneId: '' // 办结id
    })

    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getList()
    }

    const resetInit = () => {
      state.pagination.current = 1
      getList()
    }

    const getList = () => {
      state.searchData.pageIndex = state.pagination.current
      state.searchData.pageSize = state.pagination.pageSize
      state.searchData.isInform = true
      let id = props.matterId
      let isMyLaunch = true
      state.loading = true
      getMatterHandleSituationList({ ...state.searchData, id, isMyLaunch }).then(
        (res: any) => {
          state.dataSource = res.data.data
          state.pagination.total = res.data.dataCount
          state.loading = false
        },
        () => (state.loading = false)
      )
    }
    // 改变办理状态时
    const onChangeHandleStatus = () => {
      resetInit()
    }
    // 查看办理详情
    const onViewCurrentItemDetail = (id: any) => {
      state.doneId = id
      state.matterDetailModal = true
    }

    onMounted(() => getList())

    return { ...toRefs(state), handleTableChange, onViewCurrentItemDetail, onChangeHandleStatus }
  }
})
</script>

<style lang="less" scoped>
.handle-situation-list {
}
</style>

<template>
  <div class="message-list">
    <div class="marginBottom search-div" v-if="currentKey !== '3'">
      <template v-if="currentKey === '1'">
        <span class="mg-left-top">
          <label>消息主题：</label>
          <a-input v-model:value="searchData.subject" placeholder="请输入关键词搜索" allowClear style="width: 200px" />
        </span>
      </template>
      <!--      <template v-else>-->
      <!--        <span class="mg-left-top">-->
      <!--          <label>发布单位：</label>-->
      <!--          <a-input v-model:value="searchData.messageName" placeholder="请输入单位" allowClear style="width: 200px" />-->
      <!--        </span>-->
      <!--      </template>-->
      <template v-if="currentKey === '2'">
        <span class="mg-left-top">
          <label>状态：</label>
          <a-radio-group v-model:value="searchData.readed">
            <a-radio :value="-1">全部</a-radio>
            <a-radio :value="2">已读</a-radio>
            <a-radio :value="1">未读</a-radio>
          </a-radio-group>
        </span>
      </template>
      <span class="mg-left-top">
        <label>发布日期：</label>
        <a-range-picker v-model:value="timeList" style="width: 220px" allowClear />
      </span>
      <a-button type="primary" class="mg-left-top" shape="round" @click="onSearch">
        <template #icon><SearchOutlined /></template>
        查询
      </a-button>
    </div>
    <template v-if="showAction">
      <a-row>
        <a-button type="primary" class="mg-left marginBottom" ghost shape="round" :loading="deleteLoading" @click="onDelete"> 删除 </a-button>
        <template v-if="currentKey === '2'">
          <a-button type="primary" class="mg-left marginBottom" ghost shape="round" :loading="markReadLoading" @click="onMarkRead"> 标记已读 </a-button>
        </template>
      </a-row>
    </template>
    <a-table
      bordered
      :scroll="{ y: 'calc(100vh - 470px)' }"
      :dataSource="dataSource"
      :columns="currentKey === '3' ? draftBoxColumns : outBoxColumns"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      size="small"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template #subjectName="{ record }" v-if="currentKey === '2'">
          <template v-if="record.readed === 1">
            <a-badge dot /><span style="padding-left: 8px">{{ record.subject }}</span>
          </template>
          <template v-else>{{ record.subject }} </template>
        </template>
        <template #action="{ record }">
          <a-button v-if="currentKey === '3'" type="link" size="small" @click="onEditMessage(record)">编辑</a-button>
          <a-button v-else type="link" size="small" @click="onViewCurrentItemDetail(record)">查看详情</a-button>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="showDetailModal" title="消息详情" :footer="null" width="70%" :bodyStyle="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <message-detail @closeModal="showDetailModal = false" :messageId="messageId"></message-detail>
    </a-modal>
    <a-modal v-model:visible="editDraftModel" title="草稿编辑" :footer="null" width="70%" :bodyStyle="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <message-add @closeModal="editDraftModel = false" @okSave="saveOkMessage" :messageId="messageId" v-if="editDraftModel"></message-add>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { apiObj, deleteOutOrDraft, fetchOutBoxMessageList, SearchDataType, setReadForInBox } from '@/api/message'
import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons-vue'
import { Badge, DatePicker, Radio } from 'ant-design-vue'
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { draftBoxColumns, outBoxColumns } from './column-field'
import MessageAdd from './message-add.vue'
import MessageDetail from './message-detail.vue'

export default defineComponent({
  name: 'MessageList',
  components: {
    'a-range-picker': DatePicker.RangePicker,
    'a-radio-group': Radio.Group,
    'a-radio': Radio,
    'a-badge': Badge,
    SearchOutlined,
    CloseCircleFilled,
    MessageDetail,
    MessageAdd
  },
  props: {
    currentKey: {
      type: String,
      default: '',
      required: true
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance()
    const searchData: SearchDataType = reactive({
      pageIndex: 1,
      pageSize: 10,
      subject: '', // 消息主题
      sentTimeStart: '', // 发布开始日期
      sentTimeEnd: '', // 发布结束日期
      readed: -1 // 状态
    })
    const state = reactive({
      timeList: [],
      dataSource: [] as any,
      loading: false,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      selectedRowKeys: [] as string[],
      deleteLoading: false,
      markReadLoading: false,
      showAction: false,
      showDetailModal: false,
      editDraftModel: false, //草稿编辑弹窗
      messageId: '' // 消息id，发件箱和草稿箱是返回的id，收件箱是返回的messageId
    })
    // 分页改变
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }

    // 获取数据
    const getData = () => {
      let params: any = { ...searchData }
      params.pageIndex = state.pagination.current
      params.pageSize = state.pagination.pageSize
      state.loading = true
      if (state.timeList && state.timeList.length > 0) {
        params.sentTimeStart = internalInstance?.appContext.config.globalProperties.$parseTime(state.timeList[0], '{y}-{m}-{d} 00:00:00')
        params.sentTimeEnd = internalInstance?.appContext.config.globalProperties.$parseTime(state.timeList[1], '{y}-{m}-{d} 23:59:59')
      } else {
        delete params.sentTimeStart
        delete params.sentTimeEnd
      }
      if (props.currentKey !== '2' || searchData.readed === -1) {
        delete params.readed
        delete params.subject
      }
      let apiUrl = props.currentKey === '1' ? apiObj.outBoxApi : props.currentKey === '2' ? apiObj.inBoxApi : apiObj.draftBoxApi
      fetchOutBoxMessageList(apiUrl, params).then(
        (result: any) => {
          state.dataSource = result.data.data
          state.pagination.total = result.data.dataCount
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }

    // 查看详情
    const onViewCurrentItemDetail = (record: any) => {
      state.showDetailModal = true
      if (props.currentKey === '2') {
        if (record.readed === 1) setReadForInBox(record.id).then(() => onSearch())
        state.messageId = record.messageId
      } else {
        state.messageId = record.id
      }
    }

    const onEditMessage = (record: any) => {
      state.editDraftModel = true
      state.messageId = record.id
    }

    const onSearch = () => {
      state.pagination.current = 1
      getData()
    }

    // 删除
    const onDelete = () => {
      state.deleteLoading = true
      let ids = state.selectedRowKeys.join(',')
      deleteOutOrDraft(ids).then(
        () => {
          state.deleteLoading = false
          state.selectedRowKeys = []
          onSearch()
        },
        () => (state.deleteLoading = false)
      )
    }

    const saveOkMessage = () => {
      state.editDraftModel = false
      getData()
    }
    // 设置已读
    const onMarkRead = () => {
      state.markReadLoading = true
      let ids = state.selectedRowKeys.join(',')
      setReadForInBox(ids).then(
        () => {
          state.markReadLoading = false
          onSearch()
          state.selectedRowKeys = []
          state.showAction = false
        },
        () => (state.markReadLoading = false)
      )
    }

    const onSelectChange = (selectedRowKeys: string[]) => {
      state.selectedRowKeys = selectedRowKeys
      state.showAction = selectedRowKeys.length > 0
    }

    onMounted(() => onSearch())

    return {
      searchData,
      ...toRefs(state),
      onViewCurrentItemDetail,
      onEditMessage,
      onSelectChange,
      onDelete,
      onMarkRead,
      handleTableChange,
      draftBoxColumns,
      outBoxColumns,
      onSearch,
      saveOkMessage
    }
  }
})
</script>

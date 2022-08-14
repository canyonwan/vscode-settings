<script setup lang="ts">
  import { queryMessages } from '@/api/infrom'
  import type { IMessageSearch, IMessageItem } from '@/api/infrom/types'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { messageColumn } from '@/views/inform/message/columns'
  import MessageDetail from './detail.vue'
  import { whetherReadOptions } from '@/views/inform/announcement/schemas'

  const tableRef = ref()
  const newsId = ref<string>()

  const actionColumn = ref({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: IMessageItem) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  })

  const createActions = (record: IMessageItem) => {
    return [
      {
        label: '查看详情',
        onClick: viewDetail.bind(null, record)
      }
    ]
  }

  function viewDetail(row: IMessageItem) {
    newsId.value = row.newsId
    openModal()
  }

  const searchParams = reactive<IMessageSearch>({
    page: 1,
    size: 10,
    whetherRead: 0
  })

  async function loadTableData(page: any) {
    return await queryMessages({ ...page, ...searchParams })
  }

  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '查看详情',
    displayDirective: 'if'
  })

  function handleSubmit() {
    closeModal()
    reloadTable()
  }

  function reloadTable() {
    tableRef.value.reload()
  }
</script>

<template>
  <div class="message">
    <n-form-item label="是否已读">
      <n-radio-group v-model:value="searchParams.whetherRead" size="small">
        <n-radio-button v-for="read in whetherReadOptions" :key="read.value" :value="read.value">
          {{ read.label }}
        </n-radio-button>
      </n-radio-group>
    </n-form-item>
    <basic-table
      :request="loadTableData"
      :row-key="(row: IMessageItem) => row.newsId"
      ref="tableRef"
      :columns="messageColumn"
      :action-column="actionColumn"
      scroll-x="1090"
      single-line
      single-column
    />
    <BasicModal @register="modalRegister" style="width: 70%">
      <!-- <message-detail :news-id="newsId" @handle-close="() => closeModal()" @handle-submit="handleSubmit" /> -->
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
  import { queryMessages, setReadForMessage, deleteMessage } from '@/api/infrom'
  import type { IMessageSearch, IMessageItem } from '@/api/infrom/types'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { messageColumn } from '@/views/inform/message/columns'
  import MessageDetail from './detail.vue'
  import { whetherReadOptions } from '@/views/inform/announcement/schemas'
  import { useDialog } from 'naive-ui'

  const tableRef = ref()
  const newsId = ref<string>()
  const selectedIds = ref<string[]>([])

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

  async function viewDetail(row: IMessageItem) {
    newsId.value = row.newsId
    if (searchParams.whetherRead === 0) {
      await setReadForMessage([row.newsId!])
      reloadTable()
    }
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

  function reloadTable() {
    tableRef.value.reload()
  }

  function handleCheckRowKeys(keys: string[]) {
    selectedIds.value = keys
  }

  const dialog = useDialog()

  function onDelete() {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteMessage(selectedIds.value)
        reloadTable()
      }
    })
  }

  async function onSetRead() {
    await setReadForMessage(selectedIds.value)
    reloadTable()
    selectedIds.value.length = 0
  }

  watch(
    () => searchParams.whetherRead,
    () => {
      reloadTable()
    }
  )
</script>

<template>
  <div class="message">
    <n-form label-placement="left">
        n-form-item label="是否已读" v-show="searchParams.queryType === 2">
        <n-select style="width: 120px" v-model:value="searchParams.whetherRead" :options="whetherReadOptions" clearable />
      </n-form-item>
    </n-form>
    <basic-table
      :request="loadTableData"
      :row-key="(row: IMessageItem) => row.newsId"
      @update:checked-row-keys="handleCheckRowKeys"
      ref="tableRef"
      :columns="messageColumn"
      :action-column="actionColumn"
      scroll-x="1090"
      single-line
      single-column
    >
      <template #tableTitle>
        <n-button class="mr-4" type="warning" ghost @click="onSetRead" :disabled="selectedIds.length === 0" v-show="searchParams.whetherRead === 0">一键已读</n-button>
        <n-button type="error" ghost @click="onDelete" :disabled="selectedIds.length === 0">一键删除</n-button>
      </template>
    </basic-table>
    <BasicModal @register="modalRegister" style="width: 70%">
      <message-detail :news-id="newsId" @handle-close="() => closeModal()" />
    </BasicModal>
  </div>
</template>

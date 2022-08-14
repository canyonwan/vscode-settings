<script setup lang="ts">
  import { deleteAnnouncement, setRead, queryAnnouncements } from '@/api/infrom'
  import type { IMessageItem, IAnnouncementSearch } from '@/api/infrom/types'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { announcementColumn } from '@/views/inform/announcement/columns'
  import { useDialog } from 'naive-ui'
  import { queryTypeOptions, whetherReadOptions } from './schemas'

  const tableRef = ref()
  const announcementId = ref<string>()
  const queryType = ref<number>(2)
  const selectedIds = ref<string[]>([])

  const currentComp = shallowRef()

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if'
  })

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
    setProps({ title: '查看详情' })
    queryType.value === 2 && (await setRead([row.id!]))
    if (queryType.value === 3) {
      announcementId.value = row.id
      currentComp.value = defineAsyncComponent(() => import('./save.vue'))
    } else {
      announcementId.value = row.id!
      currentComp.value = defineAsyncComponent(() => import('./detail.vue'))
    }
    openModal()
  }

  function sendAnnouncement() {
    setProps({ title: '发送公告' })
    announcementId.value = ''
    queryType.value = 3
    currentComp.value = defineAsyncComponent(() => import('./save.vue'))
    openModal()
  }

  function onSearch() {
    searchParams.queryType !== 2 && delete searchParams.whetherRead
    reload()
  }

  const searchParams = reactive<IAnnouncementSearch>({
    page: 1,
    size: 10,
    queryType: 2,
    whetherRead: 0,
    startDate: null,
    endDate: null
  })

  async function loadTableData(page: any) {
    return await queryAnnouncements({ ...page, ...searchParams })
  }

  function reload() {
    tableRef.value.reload()
  }

  function handleSubmit() {
    closeModal()
    reload()
  }

  const dialog = useDialog()

  function onDelete() {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteAnnouncement(selectedIds.value)
        reload()
      }
    })
  }

  async function onSetRead() {
    await setRead(selectedIds.value)
    reload()
    selectedIds.value.length = 0
  }

  function handleCheckRowKeys(keys: string[]) {
    selectedIds.value = keys
  }

  watch(
    () => searchParams.queryType,
    () => {
      queryType.value = searchParams.queryType
      onSearch()
    }
  )
</script>

<template>
  <div class="announcement">
    <n-form inline :label-width="100" :model="searchParams" class="my-4">
      <n-form-item label="关键词">
        <n-input v-model:value="searchParams.keyWord" placeholder="请输入标题或内容" clearable />
      </n-form-item>
      <n-form-item label="查询类型">
        <n-radio-group v-model:value="searchParams.queryType" size="small">
          <n-radio-button v-for="type in queryTypeOptions" :key="type.value" :value="type.value">
            {{ type.label }}
          </n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="是否已读" v-show="searchParams.queryType === 2">
        <n-radio-group v-model:value="searchParams.whetherRead" size="small">
          <n-radio-button v-for="read in whetherReadOptions" :key="read.value" :value="read.value">
            {{ read.label }}
          </n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="开始时间">
        <n-date-picker v-model:value="searchParams.startDate" placeholder="请选择开始时间" type="date" clearable />
      </n-form-item>
      <n-form-item label="结束时间">
        <n-date-picker v-model:value="searchParams.endDate" placeholder="请选择结束时间" type="date" clearable />
      </n-form-item>
      <n-form-item>
        <e-button type="blue" @click="onSearch">查询</e-button>
      </n-form-item>
    </n-form>
    <basic-table
      :request="loadTableData"
      :row-key="(row: IMessageItem) => row.id"
      ref="tableRef"
      @update:checked-row-keys="handleCheckRowKeys"
      :columns="announcementColumn"
      :action-column="actionColumn"
      scroll-x="1090"
      single-line
      single-column
    >
      <template #tableTitle>
        <n-button class="mr-4" type="warning" ghost @click="onSetRead" :disabled="selectedIds.length === 0" v-show="queryType === 2">一键已读</n-button>
        <n-button type="error" ghost @click="onDelete" :disabled="selectedIds.length === 0">一键删除</n-button>
      </template>
      <template #toolbar><n-button type="success" @click="sendAnnouncement">发送公告</n-button></template>
    </basic-table>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentComp" :query-type="queryType" :announcement-id="announcementId" @handle-close="() => closeModal()" @handle-submit="handleSubmit" />
    </basic-modal>
  </div>
</template>

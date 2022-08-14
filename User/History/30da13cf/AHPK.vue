<script setup lang="ts">
  import { TableAction } from '@/components/table'
  import { causeTableColumns } from './columns'
  import { useSearch } from './composables/useSearch'
  import { LawEnum } from '@/enums/law-enum'
  import type { ICauseSubListItemType } from '@/api/cause-manage/types'
  import { useDialog } from 'naive-ui'
  import { deleteSubCause, queryCauseManageList } from '@/api/cause-manage/cause-manage'
  import { useModal } from '@/components/modal'
  import { usePermission } from '@/hooks/web/use-permission'
  import { Search, Add } from '@vicons/ionicons5'
  import { ClearOutlined } from '@vicons/antd'

  const { buttonShowPermission, buttonDisabledPermission } = usePermission()

  const [saveModalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if'
  })

  const dialog = useDialog()
  const tableRef = ref()
  const causeId = ref('')
  const currentModalContent = shallowRef()

  const subCauseIds = reactive({
    causeSubId: '',
    causeId: ''
  })
  provide('subCauseIds', readonly(subCauseIds))

  const reloadTable = (param = {}) => {
    tableRef.value.reload(param)
  }

  const {
    currentComp,
    searchParams,
    displayState,
    onCloseModal,
    modalRegister,
    onSearch,
    onSelectLaw,
    selectLawHandler,
    onClearCauseTags,
    onSelectCauseTags,
    onDeleteSingleLaw,
    onClearLaws,
    selectCauseTagsHandler,
    causeTagDatasources,
    onDeleteSingleCauseTag
  } = useSearch(reloadTable)

  // 创建操作列
  const actionColumn = {
    width: 140,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: ICauseSubListItemType) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  }

  const createActions = (record: ICauseSubListItemType) => {
    return [
      {
        type: 'primary',
        label: '编辑',
        frontEndIdentification: ['b01_01_01'],
        onClick: onEdit.bind(null, record)
      },
      {
        type: 'primary',
        label: '编辑处置方式',
        frontEndIdentification: ['b01_01_02'],
        onClick: onEditHanlingWay.bind(null, record)
      },
      {
        type: 'error',
        label: '删除',
        frontEndIdentification: ['b01_01_03'],
        onClick: onDelete.bind(null, record)
      }
    ]
  }

  const loadTableData = async (page: any) => {
    return await queryCauseManageList({ ...page, ...searchParams })
  }

  function onAddCause() {
    causeId.value = ''
    setProps({ title: '新增案由' })
    currentModalContent.value = defineAsyncComponent(() => import('@/views/cause-library/manage/components/save-cause.vue'))
    openModal()
  }

  function onEdit(row: ICauseSubListItemType) {
    causeId.value = row.id!
    setProps({ title: '编辑案由' })
    currentModalContent.value = defineAsyncComponent(() => import('@/views/cause-library/manage/components/save-cause.vue'))
    openModal()
  }

  function onEditHanlingWay(row: ICauseSubListItemType) {
    subCauseIds.causeSubId = row.id!
    subCauseIds.causeId = row.causeId!
    causeId.value = row.id!
    setProps({ title: '编辑处置方式' })
    currentModalContent.value = defineAsyncComponent(() => import('@/views/cause-library/manage/components/components/handling-way-list'))
    openModal()
  }

  function saveCauseHandler() {
    closeModal()
    reloadTable({ page: 1 })
  }

  function onDelete(row: ICauseSubListItemType) {
    dialog.warning({
      title: '警告',
      content: '你确定删除该案由吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteSubCause(row.id!)
        reloadTable({ page: 1 })
      }
    })
  }
</script>
<template>
  <n-card class="manage-home rounded-tl-3xl">
    <!-- SEARCH -->
    <n-grid x-gap="12" :cols="4" :y-gap="40">
      <n-gi span="2">
        <n-space>
          <n-button class="mb-4" type="primary" @click="onSelectLaw">选择法</n-button>
          <n-button class="mb-4" circle strong secondary type="error" :disabled="searchParams.lawIdList?.length === 0" @click="onClearLaws">
            <template #icon> <n-icon :component="ClearOutlined" /></template>
          </n-button>
        </n-space>
        <n-space>
          <n-tag type="primary" closable v-for="law in displayState?.selectedLaws" :key="law.id" @close="onDeleteSingleLaw(law)"> {{ law.lawName }} </n-tag>
        </n-space>
      </n-gi>
      <n-gi span="2">
        <n-space>
          <n-button class="mb-4" type="primary" @click="onSelectCauseTags">选择案由标签</n-button>
          <n-button class="mb-4" circle strong secondary type="error" :disabled="searchParams.causeTagIdList?.length === 0" @click="onClearCauseTags">
            <template #icon> <n-icon :component="ClearOutlined" /></template>
          </n-button>
        </n-space>
        <n-space>
          <n-tag type="primary" closable v-for="item in displayState?.selectedCauseTags" :key="item.id" @close="onDeleteSingleCauseTag(item)"> {{ item.name }} </n-tag>
        </n-space>
      </n-gi>
      <n-gi span="2">
        <n-input v-model:value="searchParams.name" clearable placeholder="输入要搜索的案由名称" />
      </n-gi>
      <n-gi span="2">
        <n-space>
          <n-button icon-placement="right" type="success" @click="onSearch">
            <template #icon>
              <n-icon :component="Search" size="16" />
            </template>
            查询
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
    <!-- TABLE -->
    <basic-table ref="tableRef" :row-key="(row: ICauseSubListItemType) => row.id" :request="loadTableData" :columns="causeTableColumns" :action-column="actionColumn" :scroll-x="1800">
      <template #toolbar>
        <n-button class="mr-4" icon-placement="right" type="primary" @click="onAddCause" v-if="buttonShowPermission(['b01_01_01'])" :disabled="buttonDisabledPermission(['b01_01_01'])">
          <template #icon>
            <n-icon :component="Add" />
          </template>
          导入案由
        </n-button>
        <n-button icon-placement="right" type="primary" @click="onAddCause" v-if="buttonShowPermission(['b01_01_01'])" :disabled="buttonDisabledPermission(['b01_01_01'])">
          <template #icon>
            <n-icon :component="Add" />
          </template>
          新增案由
        </n-button>
      </template>
    </basic-table>
    <!--modal-->
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentComp"
        :use-selection="true"
        :cause-Law-bound-keys="searchParams.lawIdList"
        @submit-selection-handler="selectLawHandler"
        @on-cancel-modal="onCloseModal"
        use-check
        :request-type="LawEnum.CAUSE"
        :law-data="causeTagDatasources"
        :checkedKeys="searchParams.causeTagIdList"
        @on-select-ok="selectCauseTagsHandler"
        @on-close-modal="onCloseModal"
      />
    </basic-modal>
    <basic-modal @register="saveModalRegister" style="width: 70%">
      <component :is="currentModalContent" :id="causeId" @on-select-ok="saveCauseHandler" @on-close-modal="closeModal" />
    </basic-modal>
  </n-card>
</template>

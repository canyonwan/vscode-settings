<script setup lang="ts">
  import { tableColumns } from './columns'
  import { TableAction } from '@/components/table'
  import type { IAppPackageItem } from '@/api/setting/app-package-manage/types'
  import { queryBindOrgForApp, queryBindDeptForApp, queryAppPackageList, queryBoundDeptForApp, queryBoundOrgForApp } from '@/api/setting/app-package-manage/index'
  import { useModal } from '@/components/modal'
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { Add, Search } from '@vicons/ionicons5'
  import { appTypeOptions } from './options'

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({})

  const currentModalContent = shallowRef()

  const tableRef = ref()
  const rowId = ref<string>()
  const deptBoundKeys = ref<string[]>([])
  const searchParams = ref({
    page: 1,
    size: 10,
    appType: 1
  })

  const actionColumn = ref({
    width: 160,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: IAppPackageItem) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  })
  // 创建右侧Actions
  function createActions(record: IAppPackageItem) {
    return [
      {
        frontEndIdentification: ['b09_02_01'],
        type: 'info',
        label: '编辑',
        onClick: handleEdit.bind(null, record)
      },
      {
        frontEndIdentification: ['b09_02_01'],
        type: 'success',
        label: '绑定部门',
        onClick: handleBindDept.bind(null, record)
      },
      {
        frontEndIdentification: ['b09_02_01'],
        type: 'success',
        label: '绑定机关',
        onClick: handleBindOrg.bind(null, record)
      }
    ]
  }

  // 编辑
  function handleEdit(record: IAppPackageItem) {
    setProps({ title: '编辑' })
    openModal()
    rowId.value = record.id
    currentModalContent.value = defineAsyncComponent(() => import('./save.vue'))
  }

  // 获取列表数据
  const loadTableData = async (page) => {
    return await queryAppPackageList({ ...searchParams.value, ...page })
  }

  // 刷新数据
  const reloadTable = (param = {}) => {
    tableRef.value.reload(param)
  }

  function onSearch() {
    reloadTable()
  }

  function onAdd() {
    rowId.value = ''
    currentModalContent.value = defineAsyncComponent(() => import('./save.vue'))
    setProps({ title: '发布' })
    openModal()
  }

  async function handleBindDept(row: IAppPackageItem) {
    rowId.value = row.id
    currentModalContent.value = defineAsyncComponent(() => import('@/components/base-types/index.vue'))
    await getBoundDeptForApp(row.id!)
    setProps({ title: '绑定部门' })
    openModal()
  }

  function handleBindOrg(row: IAppPackageItem) {
    rowId.value = row.id
    setProps({ title: '绑定机关' })
    currentModalContent.value = defineAsyncComponent(() => import('@/views/user/org-manage/components/org-select.vue'))
    await getBoundOrgForApp(row.id!)
    openModal()
  }

  async function getBoundDeptForApp(id: string) {
    const res = await queryBoundDeptForApp(id)
    deptBoundKeys.value = res.map((i) => i.id)
  }

  async function getBoundOrgForApp(id: string) {
    const res = await queryBoundOrgForApp(id)
    deptBoundKeys.value = res.map((i) => i.id)
  }

  function handleSubmit() {
    closeModal()
    reloadTable()
  }

  // 获取部门类型数据
  async function getDepartmentData() {
    return await queryDepartmentTypes()
  }

  // 选择部门回调
  async function handleSelectDept(keys: string[]) {
    await queryBindDeptForApp({
      appId: rowId.value!,
      idList: keys
    })
    closeModal()
  }

  // 选择机关回调
  async function handleSlectOrg(keys: string[]) {
    await queryBindOrgForApp({
      appId: rowId.value!,
      idList: keys
    })
    closeModal()
  }
</script>
<template>
  <n-card class="app-package-home">
    <basic-table :request="loadTableData" ref="tableRef" :columns="tableColumns" :action-column="actionColumn" :scroll-x="1200" :row-key="(row: IAppPackageItem) => row.id ">
      <template #tableTitle>
        <n-select :options="appTypeOptions" v-model:value="searchParams.appType" class="mr-10" style="width: 50%" />
        <n-button type="primary" @click="onSearch">查询<n-icon :component="Search" /></n-button>
      </template>
      <template #toolbar>
        <n-button type="success" @click="onAdd">发布<n-icon :component="Add" /></n-button>
      </template>
    </basic-table>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentModalContent"
        :row-id="rowId"
        @handle-submit="handleSubmit"
        @selectedRowHandler="handleSelectDept"
        @onCheck="handleSlectOrg"
        :use-selection="true"
        :load-table-data="getDepartmentData"
        :bound-keys="deptBoundKeys"
      />
    </basic-modal>
  </n-card>
</template>

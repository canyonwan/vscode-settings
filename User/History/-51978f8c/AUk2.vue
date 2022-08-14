<script setup lang="ts">
  import { queryGoodsList } from '@/api/goods/goods'
  import { useForm } from '@/components/form'
  import { useModal } from '@/components/Modal'
  import { TableAction } from '@/components/table'
  import { goodsSchemas } from '../../goods/schemas'
  import { useDialog } from 'naive-ui'
  import { Add } from '@vicons/carbon'
  import { bannerColumns } from './columns'

  const tableRef = ref()
  const searchParams = reactive({
    name: '',
    goodsTypeId: ''
  })

  const dialog = useDialog()

  const actionColumn = ref({
    width: 120,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  })

  const createActions = (record: any) => {
    return [
      {
        label: '编辑',
        type: 'success',
        onClick: onEdit.bind(null, record)
      },
      {
        label: '删除',
        type: 'error',
        onClick: onDelete.bind(null, record)
      }
    ]
  }

  const [register] = useForm({
    gridProps: { cols: 4 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showResetButton: false,
    schemas: goodsSchemas
  })

  function onEdit(row: any) {}
  function onDelete(row: any) {}

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if'
  })

  const reloadTable = () => {
    tableRef.value.reload()
  }

  // 获取商品列表
  async function loadTableData(page: any) {
    return await queryGoodsList({ ...page, ...searchParams })
  }

  // 查询
  async function onSearch(page: any) {
    //
  }

  // add banner
  function addBanner() {
    //
  }

  // 保存回调
  function handleSave() {
    //
  }
</script>
<template>
  <div class="base-home">
    <basic-form @register="register" @submit="onSearch" submit-button-text="查询" />
    <basic-table :row-key="(row:any ) => row.id" :request="loadTableData" ref="tableRef" :columns="bannerColumns" :action-column="actionColumn" scroll-x="1090">
      <template #toolbar>
        <n-button type="primary" @click="addBanner"> 新增轮播图 <n-icon :component="Add" size="22" /></n-button>
      </template>
    </basic-table>
    <basic-modal @register="modalRegister" style="width: 70%">
      <save-detail :goods-id="goodsId" @handle-save="handleSave" />
    </basic-modal>
  </div>
</template>

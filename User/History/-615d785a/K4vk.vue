<script setup lang="ts">
  import { deleteGoodsItem, queryGoodsList } from '@/api/goods/goods'
  import { useForm } from '@/components/form'
  import { useModal } from '@/components/Modal'
  import { TableAction } from '@/components/Table'
  import { goodsColumns } from './columns'
  import { goodsSchemas } from './schemas'
  import SaveDetail from './components/save-detail.vue'
  import type { IGoodsItem } from '@/api/goods/types'
  import { useDialog } from 'naive-ui'
  import { Add } from '@vicons/carbon'

  const dialog = useDialog()
  const tableRef = ref()
  const searchParams = reactive({
    name: '',
    goodsTypeId: ''
  })
  const goodsId = ref<string>()

  const actionColumn = ref({
    width: 200,
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
        label: '查看详情',
        type: 'primary',
        onClick: viewDetail.bind(null, record)
      },
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

  // 查看详情
  function viewDetail(row: IGoodsItem) {
    setProps({ title: '查看详情' })
    openModal()
    goodsId.value = row.id
  }

  // 新增商品
  function addGoods() {
    setProps({ title: '新增商品' })
    openModal()
    goodsId.value = ''
  }

  // 编辑
  function onEdit(row: IGoodsItem) {
    setProps({ title: '编辑商品' })
    openModal()
    goodsId.value = row.id
  }

  // 删除
  function onDelete(row: IGoodsItem) {
    dialog.warning({
      title: '警告',
      content: `你确定删除${row.name}吗？`,
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        await deleteGoodsItem(row.id)
      }
    })
  }

  // 查询
  function onSearch(values: any) {
    console.log('search', values)
    searchParams.name = values.name
    searchParams.goodsTypeId = values.goodsTypeId
    reloadTable()
  }

  function handleSelectId(id: string) {
    searchParams.goodsTypeId = id
  }

  // 保存回调
  function handleSave() {
    closeModal()
    reloadTable()
  }
</script>

<template>
  <div class="goods">
    <basic-form @register="register" @submit="onSearch" submit-button-text="查询">
      <template #goodsTypeSlot>
        <tree-select @handleSelectId="handleSelectId" />
      </template>
    </basic-form>
    <basic-table :row-key="(row: any) => row.id" :request="loadTableData" ref="tableRef" :columns="goodsColumns" :action-column="actionColumn" scroll-x="1090">
      <template #toolbar>
        <n-button type="primary" @click="addGoods"> 新增商品 <n-icon :component="Add" size="22" /></n-button>
      </template>
    </basic-table>
    <basic-modal @register="modalRegister" style="width: 70%">
      <save-detail :goods-id="goodsId" @handle-save="handleSave" />
    </basic-modal>
  </div>
</template>

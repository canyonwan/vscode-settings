<script lang="ts">
  export default {
    name: 'DiscretionMenuHome',
    inheritAttrs: false
  }
</script>
<script setup lang="ts">
  import { deleteDiscretionMenu, queryAllDiscretionMenu } from '@/api/cause-manage/discretion'
  import type { IDiscretionMenuType } from '@/api/cause-manage/types'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { DataTableColumn, useDialog } from 'naive-ui'
  import useDynamicComp from '../../manage/options'
  import { tableColumns } from './columns'
  const props = defineProps({
    useSelection: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    loadTableData: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      default: null
    },
    boundKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    actionColumn: {
      type: Object as PropType<{}>,
      default: () => {}
    },
    tableColumn: {
      type: Array as PropType<DataTableColumn[]>,
      default: () => []
    }
  })
  const emits = defineEmits(['updateCheckedRowKeys', 'cancelBind'])
  const slots = useSlots()
  const attrs = useAttrs()
  const tableRef = ref()
  const dialog = useDialog()

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if' //
  })

  const { currentComp, onSwitchComp } = useDynamicComp()
  const state = reactive({
    currentRowData: {} as IDiscretionMenuType,
    boundKeys: [] as string[],
    data: [] as IDiscretionMenuType[]
  })

  // 创建操作列
  const actionColumn = {
    width: 260,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: IDiscretionMenuType) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  }

  const createActions = (record: IDiscretionMenuType) => {
    return [
      {
        type: 'info',
        label: '编辑',
        onClick: handleEdit.bind(null, record)
      },
      {
        type: 'error',
        label: '删除',
        onClick: handleDelete.bind(null, record)
      },
      {
        type: 'success',
        label: '新增子清单',
        onClick: handleAddSubItem.bind(null, record)
      }
    ]
  }

  const loadTableData = async (page: any) => {
    return await queryAllDiscretionMenu({ ...page })
  }

  const reloadTable = () => {
    tableRef.value.reload()
  }

  // 新增顶级
  const addMenu = () => {
    state.currentRowData.id = undefined
    state.currentRowData.parentId = '0'
    state.currentRowData.addSubItem = false
    setProps({ title: '新增裁量清单' })
    onSwitchComp(16)
    openModal()
  }

  // 编辑
  const handleEdit = (row: IDiscretionMenuType) => {
    const { ...values } = row
    state.currentRowData = { ...values }
    state.currentRowData.addSubItem = false
    setProps({ title: '编辑裁量清单' })
    onSwitchComp(16)
    openModal()
  }

  // 新增子项
  const handleAddSubItem = async (row: IDiscretionMenuType) => {
    state.currentRowData.addSubItem = true
    state.currentRowData.id = undefined
    state.currentRowData.parentId = row.id
    setProps({ title: '新增子裁量清单' })
    onSwitchComp(16)
    openModal()
  }

  // 删除
  const handleDelete = async (row: IDiscretionMenuType) => {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteDiscretionMenu(row.id!)
        reloadTable()
      }
    })
  }

  // 选中回调
  const submitBindDiscretionMenu = () => {
    emits('updateCheckedRowKeys', state.boundKeys)
  }

  // 提交回调
  const submitHandler = () => {
    closeModal()
    reloadTable()
  }

  watch(
    () => props.useSelection,
    () => {
      if (props.useSelection) {
        if (tableColumns.at(0)!.type !== 'selection') {
          tableColumns.unshift({
            type: 'selection'
          })
        }
        state.boundKeys = props.boundKeys || []
      } else {
        if (tableColumns.at(0)!.type === 'selection') {
          tableColumns.shift()
        }
      }
    },
    { immediate: true }
  )

  defineExpose({ reloadTable })
</script>
<template>
  <div>
    <n-card>
      <basic-table
        :row-key="(row: IDiscretionMenuType) => row.id"
        :request="props.loadTableData || loadTableData"
        ref="tableRef"
        v-model:checkedRowKeys="state.boundKeys"
        :columns="!props.tableColumn && tableColumns"
        :action-column="!props.useSelection ? props.actionColumn || actionColumn : {}"
        v-bind="attrs"
        :scroll-x="1800"
      >
        <template #toolbar v-if="!slots.toolbar && !props.useSelection">
          <n-button type="primary" @click="addMenu"> 新增裁量清单 </n-button>
        </template>
        <template #toolbar v-else>
          <slot name="toolbar"></slot>
        </template>
      </basic-table>

      <div class="pt-4 text-right" v-show="props.useSelection">
        <n-button class="ml-2" @click="() => emits('cancelBind')"> 取消 </n-button>
        <n-button class="ml-2" @click="submitBindDiscretionMenu" type="primary"> 确定绑定 </n-button>
      </div>
    </n-card>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentComp" :current-row-data="state.currentRowData" @submit-handler="submitHandler" @cancel-modal-handler="() => closeModal()" />
    </basic-modal>
  </div>
</template>

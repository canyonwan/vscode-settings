<script lang="ts">
  export default {
    name: 'DiscretionTypeHome',
    inheritAttrs: false
  }
</script>
<script setup lang="ts">
  import { deleteDiscretionType, queryDiscretionTypeList } from '@/api/cause-manage/discretion'
  import type { IDiscretionType } from '@/api/cause-manage/types'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import useDynamicComp from '../../manage/options'
  import { tableColumns } from './options'
  import BindEvidenceGroup from './bind-evidence-group.vue'
  import { useDialog } from 'naive-ui'
  const emits = defineEmits(['cancelBind', 'updateCheckedRowKeysHandler'])
  const attrs = useAttrs()
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
      default: () => null
    }
  })
  const slots = useSlots()
  const tableRef: any = ref()
  const state = reactive({
    discretionTypeId: '', // 裁量类型id
    currentRowData: {} as IDiscretionType,
    checkedRowKeys: [] as string[] // 选中的keys
  })

  const dialog = useDialog()

  const { currentComp, onSwitchComp } = useDynamicComp()
  const [modalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if'
  })
  const [bindEvidenceGroupmodalRegister, { openModal: openModal2, setProps: setProps2 }] = useModal({
    displayDirective: 'if',
    title: '绑定证据组'
  })

  // 创建操作列
  const actionColumn = {
    width: 200,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: any) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  }

  const createActions = (record: any) => {
    return [
      {
        type: 'primary',
        label: '绑定证据组',
        onClick: handleBindEvidenceGroup.bind(null, record)
      },
      {
        type: 'info',
        label: '编辑类型',
        onClick: handleEdit.bind(null, record)
      },
      {
        type: 'error',
        label: '删除类型',
        onClick: handleDelete.bind(null, record)
      }
    ]
  }

  const loadTableData = async (page: any) => {
    return await queryDiscretionTypeList({ ...page })
  }

  const reloadTable = () => {
    tableRef.value.reload()
  }

  // 删除
  const handleDelete = async (rows: IDiscretionType) => {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteDiscretionType(rows.id!)
        reloadTable()
      }
    })
  }

  // 绑定证据组
  function handleBindEvidenceGroup(rows: IDiscretionType) {
    openModal2()
    setProps2({ title: '绑定证据组' })
    state.discretionTypeId = rows.id!
  }

  // 编辑
  const handleEdit = (rows: IDiscretionType) => {
    const { ...values } = rows
    openModal()
    setProps({ title: '编辑裁量类型' })
    onSwitchComp(15)
    state.currentRowData = { ...values }
  }

  // 新增裁量类型
  const addTypes = () => {
    state.currentRowData.id = ''
    openModal()
    setProps({ title: '新增裁量类型' })
    onSwitchComp(15)
  }

  // 提交回调
  const submitHandler = () => {
    closeModal()
    reloadTable()
  }

  // 确定绑定row keys handler
  const submitBindDiscretionType = () => {
    emits('updateCheckedRowKeysHandler', state.checkedRowKeys)
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
        state.checkedRowKeys = props.boundKeys
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
        :row-key="(row: IDiscretionType) => row.id"
        :request="props.loadTableData || loadTableData"
        ref="tableRef"
        v-bind="attrs"
        v-model:checkedRowKeys="state.checkedRowKeys"
        :columns="tableColumns"
        single-line
        single-column
        :action-column="!props.useSelection ? $props.actionColumn || actionColumn : null"
        :scroll-x="1800"
      >
        <template #toolbar v-if="!props.useSelection && !slots.toolbar">
          <n-button type="primary" @click="addTypes"> 新增裁量类型 </n-button>
        </template>
        <template #toolbar v-else>
          <slot name="toolbar"></slot>
        </template>
      </basic-table>
      <div class="pt-4 text-right" v-show="props.useSelection">
        <n-button class="ml-2" @click="() => emits('cancelBind')"> 取消 </n-button>
        <n-button class="ml-2" @click="submitBindDiscretionType" type="primary"> 确定绑定 </n-button>
      </div>
    </n-card>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentComp" :current-row-data="state.currentRowData" @submit-handler="submitHandler" @cancelModalHandler="() => closeModal()" />
    </basic-modal>
    <basic-modal @register="bindEvidenceGroupmodalRegister" style="width: 70%">
      <bind-evidence-group :discretionTypeId="state.discretionTypeId" />
    </basic-modal>
  </div>
</template>

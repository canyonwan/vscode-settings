<template>
  <div :class="[$props.useSelection ? 'mt-10' : '', 'base-types mb-4']">
    <basic-table
      :title="!$props.useSelection ? `${$props.tableTitle}类型维护` : ''"
      :pagination="pagination"
      :request="$props.loadTableData"
      ref="tableRef"
      :row-key="(row: any) => row.id"
      :columns="tableColumnsRef"
      :action-column="!$props.useSelection ? actionColumn : {}"
      striped
      v-model:checked-row-keys="selectedRowKeys"
      @edit-end="onEditSave"
    >
      <template #toolbar v-if="!$props.useSelection">
        <n-button type="primary" @click="onAddTypes">新增</n-button>
      </template>
    </basic-table>
    <div v-if="$props.useSelection" class="pt-4 text-right">
      <n-button class="ml-2" @click="cancelModalHandler">取消</n-button>
      <n-button class="ml-2" @click="submitSelectionHandler" type="primary">确定</n-button>
    </div>
    <!--新增-->
    <basic-modal @register="modalRegister">
      <add-base-types @on-submit="submitHandler" :edit-mode="editMode" :form-schemas="$props.formSchemas" :edit-row-info="editRowInfo" @cancel-handler="() => closeModal()" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { TableAction } from '@/components/table'
  import { schemas, tableColumns } from '@/components/base-types/options'
  import { useModal } from '@/components/modal'
  import { BaseTypesEnum, IBaseType } from '@/api/setting/types'
  import type { FormSchema } from '@/components/form'

  export default defineComponent({
    name: 'BaseTypesComp',
    props: {
      // 是否使用选择行
      useSelection: {
        type: Boolean,
        default: false
      },
      createActions: {
        type: Function,
        // type: Array as PropType<ActionItem[]>,
        default: null
      },
      boundKeys: {
        type: Array as PropType<string[]>,
        default: () => [],
        required: false
      },
      tableColumns: {
        type: [Array],
        default: () => tableColumns,
        required: false
      },
      formSchemas: {
        type: [Array] as PropType<FormSchema[]>,
        default: () => schemas,
        required: false
      },
      loadTableData: {
        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null,
        required: false
      },
      tableTitle: {
        type: String,
        default: ''
      },
      pagination: {
        type: Boolean,
        default: false
      }
    },
    emits: ['selectedRowHandler', 'cancelModalHandler', 'submitHandler', 'editedSaveHandler'],
    setup(props, { emit }) {
      const tableColumnsRef = ref<any[]>(props.tableColumns)

      const tableRef = ref()

      const state = reactive({
        selectedRowKeys: [] as string[],
        editRowInfo: {} as IBaseType,
        tableTitle: '', // 表格标题
        editMode: false
      })

      const [modalRegister, { openModal, closeModal, setProps }] = useModal({
        title: '新增',
        displayDirective: 'if' //
        // maskClosable: true,
        // displayDirective: 'show' // v show使用何种指令控制模态框主体的条件渲染
      })

      // 创建操作列
      const actionColumn = ref({
        width: 120,
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        render(record: any) {
          return h(TableAction, {
            style: 'text',
            actions: props.createActions(record)
          })
        }
      })

      // 打开新增窗口
      function onAddTypes() {
        openModal()
        setProps({ title: '新增' })
        state.editMode = false
      }

      function reloadTable() {
        tableRef.value.reload()
      }

      // 打开编辑窗口
      function onOpenEditModal(values: IBaseType) {
        // TODO 新增或编辑的思路
        state.editMode = true
        setProps({ title: '编辑' })
        if (values) {
          state.editRowInfo = values
        }
        openModal()
      }

      // 新增提交回调
      function submitHandler(values: IBaseType) {
        emit('submitHandler', values)
      }

      // 提交
      function submitSelectionHandler() {
        console.log(
          'get table data',
          tableRef.value.getDataSource()
        )(
          // state.selectedRowKeys.filter(item => item)

          tableRef.value.getDataSource() as IBaseType[]
        )
        // emit('selectedRowHandler', [...state.selectedRowKeys])
      }

      // 取消Modal
      function cancelModalHandler() {
        emit('cancelModalHandler')
      }

      function onEditSave({ record }) {
        let param = {
          id: record.id,
          name: record.name
        }
        emit('submitHandler', param)
      }

      watch(
        () => props.boundKeys,
        () => {
          state.selectedRowKeys = props.boundKeys
        },
        { deep: true, immediate: true }
      )

      watch(
        () => props.useSelection,
        () => {
          // 如果props为true, if type 不是selection 则添加selection列
          // 如果props为false, if type 是selection 则删除
          if (props.useSelection) {
            tableColumnsRef.value.at(2).edit = false
            if (tableColumnsRef.value.at(0).type !== 'selection') {
              tableColumnsRef.value.unshift({
                type: 'selection'
              })
            }
          } else {
            tableColumnsRef.value.at(2).edit = true
            if (tableColumnsRef.value.at(0).type === 'selection') {
              tableColumnsRef.value.shift()
            }
          }
        },
        { immediate: true }
      )
      return {
        ...toRefs(state),
        tableRef,
        actionColumn,
        tableColumnsRef,
        modalRegister,
        submitSelectionHandler,
        onEditSave,
        submitHandler,
        onOpenEditModal,
        BaseTypesEnum,
        cancelModalHandler,
        onAddTypes,
        reloadTable,
        closeModal
      }
    }
  })
</script>

<template>
  <div class="law-cause">
    <n-card :bordered="false">
      <basic-form @register="register" @submit="onSearch">
        <template #lawTypeIdSlot>
          <law-type-tree-select @handle-update-value="handleTreeUpdateValue" :data-type="LawEnum.TYPE" />
        </template>
        <template #lawTagSlot>
          <law-type-tree-select @handle-update-value="handleTagTreeUpdateValue" :data-type="LawEnum.TAG" />
        </template>
      </basic-form>
      <basic-table
        striped
        :title="$props.useSelection ? '' : '案由法维护'"
        :request="loadTableData"
        :row-key="(row) => row.id"
        ref="tableRef"
        :columns="tableColumns"
        :action-column="!$props.useSelection ? actionColumn : {}"
        v-model:checked-row-keys="selectedRowKeys"
        @update:checked-row-keys="handleCheck"
        @update:page="updatePage"
        :scroll-x="1800"
      >
        <template #toolbar v-if="!$props.useSelection">
          <n-button type="primary" @click="onAdd">新增</n-button>
        </template>
      </basic-table>
    </n-card>
    <div v-if="$props.useSelection" class="pt-4 text-right">
      <n-button class="ml-2" @click="onCancel">取消</n-button>
      <n-button class="ml-2" @click="submitSelectionHandler" type="primary">确定</n-button>
    </div>
    <!--    新增-->
    <basic-modal @register="modalRegister" style="width: 60%">
      <add-cause @on-submit="onSubmit" :current-row-info="currentRowInfo" />
    </basic-modal>
    <n-drawer v-model:show="showDrawer" :width="502">
      <n-drawer-content :title="`为<${currentRowInfo.lawName}>绑定法标签`">
        <bind-tag :current-law-id="currentRowInfo.id" @on-submit="handleSubmit" @on-close-modal="handleCloseModal" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts">
  import { TableAction } from '@/components/table'
  import type { ILawItemType } from '@/api/law/types'
  import { deleteLaw, queryLaws } from '@/api/law/cause'
  import { schemas, tableColumns } from '@/views/law/law-cause/options'
  import AddCause from './components/add-cause.vue'
  import { useModal } from '@/components/modal'
  import BindTag from './components/bind-tag.vue'
  import { useForm } from '@/components/form/index'
  import LawTypeTreeSelect from '@/views/law/components/law-type-tree-select.vue'
  import { LawEnum } from '@/enums/law-enum'
  import { useDialog } from 'naive-ui'
  import { IBaseType } from '@/api/setting/types'

  export default defineComponent({
    name: 'LawCause',
    components: {
      AddCause,
      BindTag,
      LawTypeTreeSelect
    },
    props: {
      useSelection: {
        type: Boolean,
        default: false,
        required: false
      },
      causeLawBoundKeys: {
        type: Array as PropType<string[]>,
        default: () => [],
        required: false
      }
    },
    emits: ['submitSelectionHandler', 'onCancelModal'],
    setup(props, { emit }) {
      const tableColumnsRef = ref<any[]>(tableColumns)

      watchEffect(() => {
        if (props.useSelection) {
          if (tableColumnsRef.value.at(0)!.type !== 'selection') {
            tableColumnsRef.value.unshift({
              type: 'selection'
            })
          }
        } else {
          if (tableColumnsRef.value.at(0)!.type === 'selection') {
            tableColumnsRef.value.shift()
          }
        }
      })

      const [modalRegister, { openModal, closeModal, setProps }] = useModal({
        displayDirective: 'if' //
      })

      // 创建操作列
      const actionColumn = ref({
        width: 140,
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        render(record: ILawItemType) {
          return h(TableAction, {
            style: 'text',
            actions: createActions(record)
          })
        }
      })

      // 创建部门操作列
      function createActions(record: ILawItemType) {
        return [
          {
            label: '编辑',
            type: 'primary',
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '绑定法标签',
            type: 'success',
            onClick: handleBindTag.bind(null, record)
          },
          {
            label: '删除',
            type: 'error',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }

      const tableRef = ref()

      const state = reactive({
        showDrawer: false,
        searchParams: {} as ILawItemType,
        currentRowInfo: {} as ILawItemType,
        selectedRowKeys: [] as string[]
      })

      const [register] = useForm({
        gridProps: {
          cols: 4
        },
        labelWidth: 80,
        schemas
      })

      // 新增
      function onAdd() {
        state.currentRowInfo = {} as ILawItemType
        setProps({ title: '新增法' })
        openModal()
      }

      // 编辑
      function handleEdit(record: any) {
        setProps({ title: '编辑法' })
        state.currentRowInfo = record
        openModal()
      }

      // 绑定法标签Drawer
      function handleBindTag(record: ILawItemType) {
        state.showDrawer = true
        state.currentRowInfo = record
      }

      const dialog = useDialog()

      // 删除
      async function handleDelete(record: ILawItemType) {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deleteLaw(record.id as string)
            reloadTable()
          }
        })
      }

      function handleSubmit() {
        state.showDrawer = false
        reloadTable()
      }

      function handleCloseModal() {
        state.showDrawer = false
      }

      // 分页列表
      async function loadTableData(page) {
        return await queryLaws({ ...state.searchParams, ...page })
      }

      // 刷新
      function reloadTable() {
        tableRef.value.reload()
      }

      // 搜索
      function onSearch(keywords: any) {
        state.searchParams = {
          ...keywords,
          lawTypeId: state.searchParams.lawTypeId,
          lawTagList: state.searchParams.lawTagList
        }
        reloadTable()
      }

      // 法类型Tree选择
      function handleTreeUpdateValue(val: string) {
        state.searchParams.lawTypeId = val
      }

      // 法标签Tree选择
      function handleTagTreeUpdateValue(val: string[]) {
        state.searchParams.lawTagList = val
      }

      // 提交回调
      function onSubmit() {
        closeModal()
        reloadTable()
      }

      function onCancel() {
        emit('onCancelModal')
      }

      // 选择列
      function handleCheck(rows: string[]) {
        state.selectedRowKeys = rows
      }

      const selectedRows = ref<ILawItemType[]>([])
      function updatePage() {
        const dataSource: ILawItemType[] = tableRef.value.getDataSource()
        const result = dataSource.filter((item) => state.selectedRowKeys.includes(item.id!))
        selectedRows.value.push(...result)
        console.log('selectedRows', selectedRows.value)
      }

      // 提交选中的列,回调给调用方
      function submitSelectionHandler() {
        // 没有切换分页的情况
        const dataSource: ILawItemType[] = tableRef.value.getDataSource()
        console.log('selected keys', state.selectedRowKeys)
        const result = dataSource.filter((item) => state.selectedRowKeys.includes(item.id!))
        selectedRows.value.forEach((item) => {
          if (!result.includes(item)) {
            selectedRows.value.push(item)
          }
        })

        console.log('selectedRows', selectedRows.value)

        // emit('submitSelectionHandler', state.selectedRowKeys)
      }

      watch(
        () => props.causeLawBoundKeys,
        () => {
          state.selectedRowKeys = props.causeLawBoundKeys
        },
        { immediate: true }
      )

      return {
        ...toRefs(state),
        handleSubmit,
        onSearch,
        handleTreeUpdateValue,
        handleCloseModal,
        register,
        tableRef,
        modalRegister,
        reloadTable,
        actionColumn,
        tableColumns,
        onCancel,
        handleCheck,
        submitSelectionHandler,
        closeModal,
        handleEdit,
        onAdd,
        loadTableData,
        onSubmit,
        updatePage,
        handleTagTreeUpdateValue,
        LawEnum
      }
    }
  })
</script>

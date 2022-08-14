<template>
  <div>
    <n-card :bordered="false" class="proCard">
      <basic-form submitButtonText="查询" :label-width="80" :gridProps="{ cols: 4 }" :schemas="tableSchemas" @submit="onSearch" />
      <basic-table title="字典维护" :request="loadTableData" ref="tableRef" :columns="tableColumns" :action-column="actionColumn" :scroll-x="1090" :frontEndIdentification="['b09_02_01']">
        <template #toolbar="{ disabled }">
          <n-button type="primary" @click="onAdd" :disabled="disabled">新增</n-button>
        </template>
      </basic-table>
    </n-card>
    <basic-modal @register="modalRegister" style="width: 50%">
      <add-modal @on-submit="onOkModal" :row-data="rowData" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { TableAction } from '@/components/table'
  import { queryDictionariesForList } from '@/api/setting/dictionaries'
  import { tableColumns } from '@/views/setting/dictionary/options'
  import type { SearchListType } from './type'
  import type { FormSchema } from '@/components/form/src/types/form-type'
  import { BasicModal, useModal } from '@/components/modal'
  import AddModal from './components/add-dictionaries.vue'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import _ from 'lodash'
  import { IDictionaryType } from '@/api/setting/types'

  export default defineComponent({
    components: {
      BasicModal,
      AddModal
    },
    setup() {
      const [modalRegister, { openModal, closeModal, setProps }] = useModal({
        title: '新增',
        displayDirective: 'if'
      })
      const rowData = ref<IDictionaryType>()
      const tableRef = ref()
      const state = reactive({
        searchParams: {
          remarks: '',
          type: ''
        } as SearchListType
      })

      const tableSchemas = ref<FormSchema[]>([
        {
          field: 'remarks',
          component: 'NInput',
          label: '备注',
          giProps: {},
          defaultValue: '',
          componentProps: {
            placeholder: '请输入备注'
          }
        },
        {
          field: 'status',
          component: 'NSelect',
          label: '状态',
          giProps: {},
          defaultValue: null,
          componentProps: {
            placeholder: '请选择状态',
            options: []
          },
          componentDataSourceType: 'Dictionaries',
          componentDataSourceName: 'status'
        },
        {
          field: 'type',
          component: 'NInput',
          label: '类型',
          giProps: {},
          defaultValue: '',
          componentProps: {
            placeholder: '请输入类型'
          }
        }
      ])
      const actionColumn = ref({
        width: 150,
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
      // 创建右侧Actions
      function createActions(record: IDictionaryType) {
        return [
          {
            frontEndIdentification: ['b09_02_01'],
            type: 'info',
            label: '编辑',
            onClick: handleEdit.bind(null, record)
          }
        ]
      }

      // 编辑
      function handleEdit(record: IDictionaryType) {
        setProps({ title: '编辑' })
        openModal()
        rowData.value = record
      }

      function onAdd() {
        if (rowData) {
          rowData.value!.id = ''
        }
        setProps({ title: '新增' })
        openModal()
      }

      // 获取列表数据
      const loadTableData = async (page) => {
        let res = await queryDictionariesForList({ ...state.searchParams, ...page })
        res.contents.forEach((value) => {
          value.status = value.status === 1
          value.hiddenValue = _.toString(value.hiddenValue)
        })
        return {
          ...res
        }
      }

      // 刷新数据
      const reloadTable = (param = {}) => {
        tableRef.value.reload(param)
      }

      // 搜索
      function onSearch(keywords: Recordable<DistanceModelType>) {
        state.searchParams = { ...keywords }
        reloadTable({ page: 1 })
      }

      schemaDataHandle(tableSchemas.value)

      async function onOkModal() {
        closeModal()
        reloadTable({ page: 1 })
      }

      return {
        ...toRefs(state),
        rowData,
        modalRegister,
        onAdd,
        onOkModal,
        tableRef,
        tableSchemas,
        actionColumn,
        tableColumns,
        onSearch,
        loadTableData
      }
    }
  })
</script>

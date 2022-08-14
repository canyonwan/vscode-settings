<template>
  <div class="model-manage">
    <n-card :bordered="false">
      <basic-form @register="register" @submit="queryData" />
      <basic-table :columns="columns" :action-column="actionColumn" :request="resetInit" ref="tableRef">
        <template #tableTitle>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon>
                <AddOutline />
              </n-icon>
            </template>
            新增
          </n-button>
        </template>
      </basic-table>
      <basic-modal @register="modalRegister" style="width: 80%" :mask-closable="false">
        <tool-manage :model-detail="modelData" :defaultToolKey="defaultToolKey" @on-submit="okModal" @on-close="closeModal" />
      </basic-modal>
    </n-card>
  </div>
</template>

<script lang="ts">
  import { useDialog } from 'naive-ui'
  import { AddOutline } from '@vicons/ionicons5'
  import { columns } from './components/columns'
  import { schemas } from './components/search-options'
  import { useForm } from '@/components/form'
  import { TableAction } from '@/components/table'
  import { BasicModal, useModal } from '@/components/modal'
  import ToolManage from './components/tool-manage.vue'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { IModelDataInfo, IModelToolGroup } from '@/api/workflow/types'
  import { deleteModel, queryModelData, queryModelDetail, getModelCopy } from '@/api/workflow/model-manage'
  import type { SelectOption, SelectGroupOption } from 'naive-ui'
  import { queryToolData } from '@/api/workflow/model-tool'
  export default defineComponent({
    name: 'ModelManage',
    components: {
      AddOutline,
      BasicModal,
      ToolManage
    },
    setup() {
      const tableRef = ref()
      const dialog = useDialog()
      const loading = ref()
      const state = reactive({
        searchParam: {},
        modelData: {} as IModelDataInfo, //当前项
        toolGroups: [] as IModelToolGroup[],
        defaultToolKey: [] as Array<SelectOption | SelectGroupOption> // 默认的工具数据
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [register] = useForm({
        gridProps: {
          cols: 3
        },
        labelWidth: 120,
        submitButtonText: '查询',
        showAdvancedButton: false,
        schemas: schemasForm.value
      })
      const queryData = async (param) => {
        state.searchParam = param
        reloadTable()
      }
      const reloadTable = () => {
        // 刷新表单数据
        tableRef.value.reload()
      }
      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '新增编辑'
      })
      const okModal = () => {
        closeModal()
        reloadTable()
      }
      const actionColumn = ref({
        width: 180,
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
      const createActions = (record) => {
        return [
          {
            label: '复制模型',
            onClick: handleModelCopy.bind(null, record.id)
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const handleModelCopy = (id) => {
        dialog.warning({
          title: '提示',
          content: '你确定要复制该模型吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            loading.value = true
            getModelCopy(id).then(
              () => {
                loading.value = false
                reloadTable()
              },
              () => {
                loading.value = false
              }
            )
          },
          onNegativeClick: () => {}
        })
      }
      const handleAdd = () => {
        state.modelData = {
          id: null,
          name: '',
          typeId: null,
          toolGroups: []
        }
        openModal()
      }
      const handleEdit = async (info) => {
        if (info.whetherMain) {
          getDefaultTool()
        } else {
          state.defaultToolKey = []
        }
        const data = await queryModelDetail(info.id)
        state.modelData = data
        openModal()
      }
      const resetInit = async (res) => {
        return await queryModelData({ ...res, ...state.searchParam })
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            loading.value = true
            deleteModel(info.id).then(
              () => {
                loading.value = false
                reloadTable()
              },
              () => {
                loading.value = false
              }
            )
          },
          onNegativeClick: () => {}
        })
      }

      // 获取默认的工具的 key
      const getDefaultTool = async () => {
        const defaultT = await queryToolData({ page: 1, size: 500, types: [17, 18, 2] })
        state.defaultToolKey = []
        for (const tool of defaultT.contents) {
          tool.setDataExpressions.map((express) => {
            if (express) {
              state.defaultToolKey.push({
                label: tool.name + '_' + express.keyword,
                value: express.keyword
              })
            }
          })
        }
      }
      return {
        loading,
        register,
        tableRef,
        columns,
        actionColumn,
        modalRegister,
        ...toRefs(state),
        resetInit,
        handleAdd,
        queryData,
        closeModal,
        okModal
      }
    }
  })
</script>

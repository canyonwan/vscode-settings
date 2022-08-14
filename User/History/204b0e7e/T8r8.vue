<template>
  <div class="model-config">
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
      <basic-modal @register="modalRegister" @on-ok="okModal" style="width: 50%">
        <model-config-save :documentModelId="documentModelId" @on-submit="okModal" />
      </basic-modal>
      <n-drawer v-model:show="orgModal" :width="502">
        <n-drawer-content :title="`${documentModelInfo.documentModelName} 绑定机关`">
          <org-select @on-check="submitBindOrg" :bindKeys="bindOrgIds" @close-modal="orgModal = false" />
        </n-drawer-content>
      </n-drawer>
      <document-bind-dept :documentModelId="documentModelDeptId" ref="documentDeptRef" />
      <basic-modal @register="modalParamRegister" @on-ok="okModalParam" style="width: 70%">
        <document-bind-param :documentModelId="documentModelParamId" />
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
  import { useModal } from '@/components/modal'
  import ModelConfigSave from './components/model-config-save.vue'
  import OrgSelect from '@/views/user/org-manage/components/org-select.vue'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import DocumentBindDept from './components/document-bind-dept.vue'
  import DocumentBindParam from './components/document-bind-param.vue'
  import { bindDocumentOrg, deleteModelConfig, queryDocumentOrg, queryModelConfig } from '@/api/document/model-config'
  import { IModelConfigInfo } from '@/api/document/types'
  export default defineComponent({
    name: 'ModelConfig',
    components: {
      AddOutline,
      ModelConfigSave,
      OrgSelect,
      DocumentBindDept,
      DocumentBindParam
    },
    setup() {
      const tableRef = ref()
      const documentDeptRef = ref()
      const dialog = useDialog()
      const state = reactive({
        searchParam: {},
        documentModelInfo: {} as IModelConfigInfo,
        documentModelId: undefined, //当前id
        documentModelDeptId: undefined, //当前id
        documentModelParamId: undefined, //当前id
        orgModal: false,
        bindOrgIds: [] as string[] // 已绑定机关id集合
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [register] = useForm({
        gridProps: {
          cols: 4
        },
        labelWidth: 100,
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
      const okModalParam = () => {
        closeModalParam()
        reloadTable()
      }
      const [modalParamRegister, { openModal: openModalParam, closeModal: closeModalParam }] = useModal({
        title: '绑定字段'
      })
      const okModal = () => {
        closeModal()
        reloadTable()
      }
      const actionColumn = ref({
        width: 400,
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
            type: 'info',
            label: '绑定机关',
            onClick: handleBindOrg.bind(null, record)
          },
          {
            type: 'info',
            label: '绑定部门',
            onClick: handleBindDept.bind(null, record)
          },
          {
            type: 'info',
            label: '绑定字段',
            onClick: handleBindParam.bind(null, record)
          },
          {
            type: 'info',
            label: '编辑',
            onClick: handleEdit.bind(null, record)
          },
          {
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const handleAdd = () => {
        state.documentModelId = undefined
        openModal()
      }
      const handleEdit = (info) => {
        state.documentModelId = info.id
        openModal()
      }
      const handleBindOrg = (info) => {
        state.documentModelInfo = info
        queryDocumentOrg(state.documentModelInfo.id).then((data) => {
          state.bindOrgIds = data.map((item) => item.id)
        })
        state.orgModal = true
      }
      const handleBindDept = (info) => {
        state.documentModelDeptId = info.id
        documentDeptRef.value.openModal()
      }
      const handleBindParam = (info) => {
        state.documentModelParamId = info.id
        openModalParam()
      }
      // 提交组绑定机关ids集合
      const submitBindOrg = async (ids) => {
        await bindDocumentOrg({ sourceId: state.documentModelInfo.id, targetList: ids })
      }
      const resetInit = async (res) => {
        return await queryModelConfig({
          ...res,
          ...state.searchParam
        })
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deleteModelConfig(info.id)
            reloadTable()
          },
          onNegativeClick: () => {}
        })
      }
      return {
        register,
        tableRef,
        documentDeptRef,
        columns,
        actionColumn,
        modalRegister,
        modalParamRegister,
        ...toRefs(state),
        okModal,
        resetInit,
        okModalParam,
        queryData,
        handleAdd,
        submitBindOrg
      }
    }
  })
</script>

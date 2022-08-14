<template>
  <div class="approval-config-save">
    <basic-form class="mb-10" @register="register" @submit="handleSubmit" />
    <basic-table v-if="infoId" :columns="columnsDetail" :action-column="actionColumn" :request="getDetail" ref="tableRef" :pagination="false" @edit-end="handleEditSort">
      <template #tableTitle>
        <n-button type="primary" @click="handleAddBind">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          新增绑定
        </n-button>
      </template>
    </basic-table>
  </div>
  <basic-modal @register="modalRegister" style="width: 70%">
    <approval-level :isCheck="true" v-model:bind-keys-data="bindKeysData" @update:bind-keys-data="handleSubmitBind" @on-cancel="closeModalBind" />
  </basic-modal>
</template>

<script lang="ts">
  import { schemas } from './detail-options'
  import { AddOutline } from '@vicons/ionicons5'
  import { useForm } from '@/components/form'
  import { columnsDetail } from './columns'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { TableAction } from '@/components/table'
  import { BasicModal, useModal } from '@/components/modal'
  import ApprovalLevel from '@/views/approval/approval-level/index.vue'
  import { saveApproveData, queryApproveDataDetail, deleteLevelBinding, bindApproveLevel, saveApproveLevelSort } from '@/api/approval/approval-config'
  import { IApprovelLevel, IApprovelParam } from '@/api/approval/types'
  import { useDialog, useMessage } from 'naive-ui'
  export default defineComponent({
    name: 'ApprovalConfigSave',
    components: {
      AddOutline,
      BasicModal,
      ApprovalLevel
    },
    props: {
      infoId: {
        type: String,
        default: null
      }
    },
    emits: ['onSubmit'],
    setup(props, context) {
      const tableRef = ref()
      const dialog = useDialog()
      const message = useMessage()
      const state = reactive({
        configData: {} as IApprovelParam,
        configInfo: {
          id: '',
          name: '',
          approvalTypeId: '',
          approvalLevelTotal: null
        } as IApprovelParam,
        bindKeysData: [] as IApprovelLevel[] // 已绑定的id集合
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [register, { setFieldsValue, resetFields }] = useForm({
        gridProps: {
          cols: 2
        },
        labelWidth: 130,
        submitButtonText: '保存',
        layout: 'horizontal',
        // showAdvancedButton: false,
        buttonPosition: 'end',
        schemas: schemasForm.value
      })

      const [modalRegister, { openModal, closeModal: closeModalBind }] = useModal({
        title: '选择绑定'
      })
      const resetInit = async () => {
        if (props.infoId) {
          state.configData = await queryApproveDataDetail(props.infoId)
          setFieldsValue(state.configData)
          reloadTable()
        }
      }
      const getDetail = async () => {
        if (props.infoId && Object.keys(state.configData).length) {
          state.bindKeysData = state.configData.approvalConfigDataOutputs
          return state.configData.approvalConfigDataOutputs.length ? state.configData.approvalConfigDataOutputs : []
        } else {
          return []
        }
      }
      const handleSubmit = async (res) => {
        const param = {
          id: res.id,
          name: res.name,
          approvalTypeId: res.approvalTypeId,
          approvalLevelTotal: res.approvalLevelTotal
        }
        await saveApproveData(param)
        context.emit('onSubmit')
        if (!props.infoId) {
          resetFields()
        }
      }
      const reloadTable = () => {
        // 刷新表单数据
        tableRef.value.reload()
      }
      const actionColumn = ref({
        width: 40,
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
          // {
          //   label: '保存排序',
          //   onClick: handleEditSort.bind(null, record)
          // },
          {
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const handleEditSort = async ({ record }) => {
        const param = {
          sourceId: props.infoId,
          targetId: record.id,
          sort: record.sort
        }
        await saveApproveLevelSort(param)
      }
      const handleAddBind = () => {
        if (props.infoId) {
          openModal()
        } else {
          message.warning('请先保存审批文书配置')
        }
      }
      // 提交绑定
      const handleSubmitBind = async (chooseInfo) => {
        const targetList = chooseInfo.map((item) => {
          return {
            targetId: item.id,
            sort: item.sort
          }
        })
        const param = {
          sourceId: props.infoId,
          targetList: targetList
        }
        await bindApproveLevel(param)
        closeModalBind()
        resetInit()
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deleteLevelBinding({ documentApprovalConfigId: props.infoId, documentApprovalConfigDataId: info.id })
            resetInit()
          },
          onNegativeClick: () => {}
        })
      }
      watch(
        () => props.infoId,
        () => {
          if (props.infoId) {
            resetInit()
          } else {
            nextTick(() => {
              setFieldsValue(state.configInfo)
            })
          }
        },
        { immediate: true }
      )
      return {
        tableRef,
        register,
        modalRegister,
        columnsDetail,
        actionColumn,
        ...toRefs(state),
        getDetail,
        handleSubmit,
        handleAddBind,
        handleSubmitBind,
        handleEditSort,
        closeModalBind,
        handleDelete
      }
    }
  })
</script>

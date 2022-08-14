<template>
  <div class="document-bind-param">
    <basic-table :columns="columnsParam" :action-column="actionColumn" :request="resetInit" ref="tableRef" :pagination="false" :scroll-x="600">
      <template #tableTitle>
        <n-button type="primary" @click="handleAdd">
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
  <basic-modal @register="modalRegister" @on-ok="okModal" style="width: 70%">
    <param-config v-model:bindKeys="bindKeys" :isSelection="true" />
    <div class="flex justify-end items-end">
      <n-button class="ml-2" @click="okModal">取消</n-button>
      <n-button class="ml-2" @click="handleBindParam" type="primary">提交</n-button>
    </div>
  </basic-modal>
</template>

<script lang="ts">
  import { useDialog, useMessage } from 'naive-ui'
  import { AddOutline } from '@vicons/ionicons5'
  import { columnsParam } from './columns'
  import { TableAction } from '@/components/table'
  import { useModal } from '@/components/modal'

  import { bindDocumentParam, deleteBindDocumentParam, queryDocumentParam } from '@/api/document/model-config'
  import ParamConfig from '../../param-config/index.vue'
  export default defineComponent({
    name: 'DocumentBindParam',
    components: {
      AddOutline,
      ParamConfig
    },
    props: {
      documentModelId: {
        type: String,
        default: null
      }
    },
    setup(props) {
      const tableRef = ref()
      const dialog = useDialog()
      const message = useMessage()
      const state = reactive({
        paramData: [],
        bindKeys: [] as string[],
        documentModelId: '' //当前id
      })
      const reloadTable = () => {
        // 刷新表单数据
        tableRef.value.reload()
      }

      const actionColumn = ref({
        width: 60,
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
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const handleAdd = () => {
        state.documentModelId = ''
        openModal()
      }
      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '绑定字段'
      })
      const okModal = () => {
        closeModal()
        reloadTable()
      }
      const resetInit = async () => {
        if (props.documentModelId) {
          const dataList = await queryDocumentParam(props.documentModelId)
          state.bindKeys = dataList.map((item) => {
            return item.id
          })
          return dataList
        } else {
          return {}
        }
      }
      const handleBindParam = () => {
        message.loading('正在提交', { duration: 1000 })
        bindDocumentParam({ sourceId: props.documentModelId, targetList: state.bindKeys })
        setTimeout(() => {
          closeModal()
          reloadTable()
        }, 1000)
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deleteBindDocumentParam({ coreId: props.documentModelId, columnConfigId: info.id })
            reloadTable()
          },
          onNegativeClick: () => {}
        })
      }
      watch(
        () => props.documentModelId,
        () => {
          if (state.documentModelId) {
            state.documentModelId = props.documentModelId
            nextTick(() => reloadTable())
          } else {
            state.documentModelId = props.documentModelId
          }
        },
        { immediate: true }
      )
      return {
        tableRef,
        columnsParam,
        actionColumn,
        modalRegister,
        ...toRefs(state),
        okModal,
        resetInit,
        handleBindParam,
        handleAdd,
        openModal
      }
    }
  })
</script>

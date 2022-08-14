<template>
  <div class="param-config">
    <n-card :bordered="false">
      <basic-form @register="register" @submit="queryData" />
      <basic-table
        :columns="tableColumns"
        :action-column="!isSelection ? actionColumn : {}"
        :row-key="(row) => row.id"
        :request="resetInit"
        ref="tableRef"
        :checked-row-keys="checkedKeys"
        @update:checked-row-keys="handleChecked"
        :scroll-x="1400"
        :frontEndIdentification="['b02_05_01']"
      >
        <template #tableTitle="{ disabled }">
          <n-button type="primary" @click="handleAdd" v-if="!isSelection" :disabled="disabled">
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
        <param-config-save :configId="configId" @on-submit="okModal" />
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
  import ParamConfigSave from './components/param-config-save.vue'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { deleteParamConfig, queryParamConfig } from '@/api/document/param-config'
  export default defineComponent({
    name: 'ParamConfig',
    components: {
      AddOutline,
      BasicModal,
      ParamConfigSave
    },
    props: {
      isSelection: {
        type: Boolean,
        default: false
      },
      bindKeys: {
        type: Array as PropType<Array<string | number>>,
        default: () => []
      }
    },
    emits: ['update:bindKeys'],
    setup(props, context) {
      const checkedKeys = ref<Array<string | number>>([])
      const tableRef = ref()
      const dialog = useDialog()
      const state = reactive({
        searchParam: {},
        configId: undefined //当前id
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const tableColumns = ref(columns)
      const [register] = useForm({
        gridProps: {
          cols: props.isSelection ? 3 : 4
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
      const okModal = () => {
        closeModal()
        reloadTable()
      }
      const actionColumn = ref({
        width: 120,
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
            frontEndIdentification: ['b02_05_01'],
            type: 'info',
            label: '编辑',
            onClick: handleEdit.bind(null, record)
          },
          {
            frontEndIdentification: ['b02_05_02'],
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const handleAdd = () => {
        state.configId = undefined
        openModal()
      }
      const handleEdit = (info) => {
        state.configId = info.id
        openModal()
      }
      const resetInit = async (res) => {
        return await queryParamConfig({
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
          onPositiveClick: () => {
            deleteParamConfig(info.id).then(() => {
              reloadTable()
            })
          },
          onNegativeClick: () => {}
        })
      }
      // 勾选
      const handleChecked = (keys) => {
        checkedKeys.value = keys
        context.emit('update:bindKeys', checkedKeys.value)
      }
      watch(
        () => props.bindKeys,
        () => {
          checkedKeys.value = props.bindKeys
        },
        { immediate: true }
      )
      watchEffect(() => {
        if (props.isSelection) {
          tableColumns.value[0].type = 'selection'
        } else {
          tableColumns.value[0].type = ''
        }
      })

      return {
        register,
        checkedKeys,
        tableRef,
        tableColumns,
        actionColumn,
        modalRegister,
        ...toRefs(state),
        resetInit,
        okModal,
        handleChecked,
        queryData,
        handleAdd
      }
    }
  })
</script>

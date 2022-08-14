<template>
  <div class="personnel-list">
    <basic-form @register="register" @submit="queryData" />
    <basic-table :columns="columns" :action-column="actionColumn" :scroll-x="3050" :request="resetInit" ref="personnelRef" :frontEndIdentification="isUser ? ['a03_01'] : ['b06_01']">
      <template #tableTitle="{ disabled }">
        <n-button type="primary" @click="handleAdd" v-show="isShowAdd" :disabled="disabled">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增
        </n-button>
      </template>
      <template #toolbar>
        <n-button class="mr-4" icon-placement="right" type="success" @click="onImportPersonnel">
          <template #icon>
            <n-icon>
              <Add />
            </n-icon>
          </template>
          导入人员
        </n-button>
      </template>
    </basic-table>
    <basic-modal :showActionButtonGroup="true" :disabled="isCheck" :title="personnelId ? (isCheck ? '查看' : '编辑') : '新增'" @register="modalRegister" style="width: 70%" @on-ok="okPersonnelModal">
      <personnel-add-edit :personnelId="personnelId" :orgId="orgId" ref="personnelAddRef" :is-check="isCheck" />
    </basic-modal>
    <basic-modal @register="passwordModalRegister">
      <reset-password :personnelId="personnelId" @close-modal="passwordCloseModal" />
    </basic-modal>
    <basic-modal @register="importPersonnelRegister" style="width: 50%">
      <import-personnel @submit-handler="submitHandler" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { useDialog } from 'naive-ui'
  import { deleteNoParam } from '@/utils'
  import { PlusOutlined } from '@vicons/antd'
  import { TableAction } from '@/components/table/index'
  import { columns } from '../columns'
  import { FormSchema, useForm } from '@/components/form/index'
  import { useModal } from '@/components/modal/index'
  import PersonnelAddEdit from './personnel-add-edit.vue'
  import ResetPassword from './reset-password.vue'
  import { deletePersonnel, queryManager, queryPersonnel } from '@/api/user/personnel'
  import { Add } from '@vicons/ionicons5'
  import ImportPersonnel from './import-personnel.vue'

  export default defineComponent({
    name: 'PersonnelList',
    components: { PlusOutlined, Add, PersonnelAddEdit, ResetPassword, ImportPersonnel },
    props: {
      orgId: {
        type: String,
        default: ''
      },
      // true 用户，false 维护人员
      isUser: {
        type: Boolean,
        default: true
      },
      // 机关分组不能新增人员
      isShowAdd: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const dialog = useDialog()
      const personnelRef = ref()
      const personnelAddRef = ref() // 编辑修改的modal ref
      const state = reactive({
        searchParam: {} as any, // 查询条件
        orgId: '', // 机关id
        personnelId: '', // 编辑人员id
        isCheck: false // true 查看 false编辑
      })
      const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({})
      const [passwordModalRegister, { openModal: passwordOpenModal, closeModal: passwordCloseModal }] = useModal({
        title: '重置密码'
      })

      const [importPersonnelRegister, { openModal: openImportPersonnel, closeModal: closeImportPersonnel }] = useModal({
        title: '导入人员'
      })

      // 查询条件
      const schemas = ref<FormSchema[]>([
        {
          field: 'realName'
          component: 'NInput',
          label: '真实姓名:',
          defaultValue: '',
          giProps: {},
          componentProps: {
            placeholder: '请输入真实姓名'
          }
        },
        {
          field: 'enforceCode',
          component: 'NInput',
          label: '执法证号:',
          defaultValue: '',
          giProps: {},
          componentProps: {
            placeholder: '请输入执法证号'
          }
        }
      ])
      const [register] = useForm({
        gridProps: { cols: 2 },
        labelWidth: 80,
        showAdvancedButton: false,
        schemas
      })
      const okPersonnelModal = async () => {
        const formRes = await personnelAddRef.value.handleSubmit()
        if (formRes) {
          closeModal()
          reloadTable(state.personnelId ? {} : { page: 1 })
          state.personnelId = ''
        } else {
          setSubLoading(false)
        }
      }
      const actionColumn = ref({
        width: 215,
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
            label: '查看',
            onClick: handleEdit.bind(null, record, true)
          },
          {
            frontEndIdentification: props.isUser ? ['a03_01'] : ['b06_01'],
            label: '编辑',
            onClick: handleEdit.bind(null, record, false)
          },
          {
            frontEndIdentification: props.isUser ? ['a03_03'] : ['b06_03'],
            label: '重置密码',
            onClick: resetPassword.bind(null, record)
          },
          {
            frontEndIdentification: props.isUser ? ['a03_02'] : ['b06_02'],
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      // 新增
      const handleAdd = () => {
        state.personnelId = ''
        state.isCheck = false
        openModal()
      }

      function onImportPersonnel() {
        openImportPersonnel()
      }

      function submitHandler() {
        closeImportPersonnel()
        reloadTable()
      }

      // 编辑
      const handleEdit = (record, check) => {
        state.isCheck = check
        state.personnelId = record.id
        openModal()
      }
      // 重置密码
      const resetPassword = (record) => {
        state.personnelId = record.id
        passwordOpenModal()
      }
      // 删除
      const handleDelete = (record) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            deletePersonnel(record.id).then(() => {
              reloadTable()
            })
          },
          onNegativeClick: () => {}
        })
      }
      // 查询
      const queryData = (params) => {
        state.searchParam = { ...params }
        reloadTable({ page: 1 })
      }
      const reloadTable = (param = {}) => {
        // 刷新表单数据
        personnelRef.value.reload(param)
      }
      const resetInit = async (res) => {
        const params = {
          ...res,
          ...state.searchParam,
          orgId: state.orgId
        }
        if (props.isUser) {
          // 是用户情况
          if (state.orgId) {
            return await queryPersonnel(deleteNoParam(params))
          } else {
            return {}
          }
        } else {
          return await queryManager(deleteNoParam(params))
        }
      }
      watch(
        () => props.orgId,
        () => {
          state.orgId = props.orgId
          if (state.orgId) {
            state.personnelId = ''
            reloadTable({ page: 1 })
          }
        }
      )
      return {
        personnelRef,
        personnelAddRef,
        ...toRefs(state),
        register,
        onImportPersonnel,
        importPersonnelRegister,
        columns,
        actionColumn,
        modalRegister,
        passwordModalRegister,
        passwordCloseModal,
        okPersonnelModal,
        queryData,
        resetInit,
        submitHandler,
        handleAdd
      }
    }
  })
</script>

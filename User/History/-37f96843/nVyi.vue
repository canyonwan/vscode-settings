<template>
  <div class="workflow">
    <n-card :segmented="{ content: 'soft' }" :bordered="false">
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
    </n-card>
    <group-bind-dept :groupId="groupId" ref="groupDeptRef" />
    <basic-modal @register="modalRegister" @on-ok="okModal">
      <group-save :groupInfo="groupInfo" @on-submit="okModal" />
    </basic-modal>
    <n-drawer v-model:show="orgModal" :width="502">
      <n-drawer-content :title="`${groupInfo.name} 绑定机关`">
        <org-select @on-check="submitBindOrg" :bindKeys="bindOrgIds" @close-modal="orgModal = false" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts">
  import { useDialog } from 'naive-ui'
  import { AddOutline } from '@vicons/ionicons5'
  import { TableAction } from '@/components/table'
  import { FormSchema, useForm } from '@/components/form'
  import { BasicModal, useModal } from '@/components/modal'
  import orgSelect from '@/views/user/org-manage/components/org-select.vue'
  import GroupSave from './components/group-save.vue'
  import groupBindDept from './components/group-bind-dept.vue'
  import { IGroupInfo, IGroupOrg } from '@/api/workflow/types'
  import { bindGroupOrg, deleteGroup, querybindGroupOrg, queryGroupData } from '@/api/workflow/model-group'
  import { difference } from 'lodash-es'
  export default defineComponent({
    name: 'Workflow',
    components: {
      AddOutline,
      BasicModal,
      orgSelect,
      groupBindDept,
      GroupSave
    },
    emits: ['closeModal', 'onCheck'],
    setup() {
      const tableRef = ref()
      const groupDeptRef = ref()
      const router = useRouter()
      const dialog = useDialog()
      const schemas = ref<FormSchema[]>([
        {
          field: 'groupName',
          component: 'NInput',
          label: '组名称',
          defaultValue: '',
          giProps: {},
          componentProps: {}
        }
      ])
      const state = reactive({
        orgModal: false,
        searchParam: {},
        groupInfo: {} as IGroupInfo, // 组详情
        groupId: '', // 组id
        bindOrgIds: [] as string[] // 已绑定机关id集合
      })
      const [register] = useForm({
        gridProps: {
          cols: 3
        },
        labelWidth: 50,
        submitButtonText: '查询',
        showAdvancedButton: false,
        schemas: schemas.value
      })
      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '组新增编辑'
      })
      // 查询
      const queryData = (params) => {
        state.searchParam = params
        reloadTable()
      }
      const reloadTable = () => {
        // 刷新表单数据
        tableRef.value.reload()
      }
      const columns = ref([
        {
          title: 'id',
          key: 'id',
          width: 100
        },
        {
          title: '组名称',
          key: 'name',
          minWidth: 160
        }
      ])
      const actionColumn = ref({
        width: 380,
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
            label: '绑定模型',
            onClick: handleBindModel.bind(null, record)
          },
          {
            label: '绑定部门',
            onClick: handleBindDept.bind(null, record)
          },
          {
            label: '绑定机关',
            onClick: handleBindOrg.bind(null, record)
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
      const handleAdd = () => {
        state.groupInfo = {
          id: undefined,
          name: ''
        }
        openModal()
      }
      const handleEdit = (info) => {
        state.groupInfo = info
        openModal()
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            deleteGroup(info.id).then(() => {
              reloadTable()
            })
          },
          onNegativeClick: () => {}
        })
      }
      const handleBindModel = async (info) => {
        router.push({ path: `goroup-bind/${info.id}` })
      }
      const handleBindOrg = (info) => {
        state.groupInfo = info
        querybindGroupOrg(state.groupInfo.id).then((data) => {
          state.bindOrgIds = data.map((item) => String(item))
        })
        state.orgModal = true
      }
      const handleBindDept = (info) => {
        state.groupId = info.id
        groupDeptRef.value.openModal()
      }

      // 提交组绑定机关ids集合
      const submitBindOrg = async (ids) => {
        const removeIds = difference(state.bindOrgIds, ids)
        const listInput = [
          {
            type: 'remove',
            orgIds: removeIds
          },
          {
            type: 'cover',
            listCover: [
              {
                modelGroupId: state.groupInfo.id,
                orgIds: ids
              }
            ]
          }
        ] as IGroupOrg[]
        await bindGroupOrg({ listInput: listInput })
      }
      const okModal = () => {
        closeModal()
        reloadTable()
      }
      const resetInit = async (res) => {
        return await queryGroupData({ ...res, ...state.searchParam })
      }
      return {
        tableRef,
        groupDeptRef,
        columns,
        actionColumn,
        register,
        modalRegister,
        ...toRefs(state),
        queryData,
        resetInit,
        handleAdd,
        okModal,
        submitBindOrg
      }
    }
  })
</script>

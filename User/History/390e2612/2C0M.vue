<template>
  <div class="bind-dept-edit">
    <basic-modal @register="modalRegister" style="width: 60%">
      <template #default>
        <basic-table :pagination="false" ref="deptAliasRef" :columns="columns" :action-column="actionColumn" :request="getDepartmentTypes" />
      </template>
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { TableAction } from '@/components/table/index'
  import { BasicModal, useModal } from '@/components/modal'
  import { queryRoleDepartIds, setDepartmentRoleName } from '@/api/authority/role-set'
  import { NTag } from 'naive-ui'

  export default defineComponent({
    name: 'BindDeptEdit',
    components: { BasicModal },
    props: {
      roleId: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const deptAliasRef = ref()
      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '部门角色名称编辑'
      })
      const reloadTable = () => {
        // 刷新表单数据
        nextTick(() => {
          deptAliasRef.value.reload()
        })
      }
      const actionColumn = ref({
        width: 160,
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
      const columns = ref([
        {
          title: 'id',
          key: 'id',
          width: 100
        },
        {
          title: '部门类型',
          key: 'departmentName',
          width: 160,
          render(row) {
            return h(
              NTag,
              {
                style: {
                  marginRight: '6px'
                },
                type: row.departmentName.indexOf('已被删除') === -1 ? 'info' : 'error'
              },
              {
                default: () => row.departmentName
              }
            )
          }
        },
        {
          title: '名称',
          key: 'departmentRoleName',
          edit: true,
          editComponent: 'NInput',
          width: 160
        }
      ])
      // 创建部门操作
      const createActions = (record) => {
        if (!record.editable) {
          return [
            {
              type: 'info',
              label: '编辑',
              onClick: handleDepartmentEdit.bind(null, record)
            }
          ]
        } else {
          return [
            {
              type: 'success',
              label: '保存',
              onClick: handleSave.bind(null, record)
            },
            {
              label: '取消',
              onClick: handleCancel.bind(null, record)
            }
          ]
        }
      }
      // 部门编辑
      const handleDepartmentEdit = (record) => {
        record.onEdit?.(true, false)
      }
      const handleSave = async (record) => {
        await record.onEdit?.(false, true)
        const params = {
          relationId: record.id,
          departmentRoleName: record.departmentRoleName
        }
        await setDepartmentRoleName(params)
      }
      const handleCancel = (record) => {
        record.onEdit?.(false, false)
      }
      // 获取已绑定部门的数据
      const getDepartmentTypes = async () => {
        return await queryRoleDepartIds(props.roleId)
      }
      watch(
        () => props.roleId,
        () => {
          reloadTable()
        }
      )
      return {
        deptAliasRef,
        actionColumn,
        columns,
        modalRegister,
        openModal,
        closeModal,
        getDepartmentTypes
      }
    }
  })
</script>

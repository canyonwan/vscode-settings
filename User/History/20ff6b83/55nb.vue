<template>
  <div class="bind-org-edit">
    <basic-modal @register="modalRegister" style="width: 60%">
      <template #default>
        <basic-table :pagination="false" :columns="columns" :action-column="actionColumn" :request="getRoleOrgIds" ref="orgAliasRef" />
      </template>
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { TableAction } from '@/components/table/index'
  import { BasicModal, useModal } from '@/components/modal'
  import { queryRoleOrgIds, setOrgRoleName } from '@/api/authority/role-set'
  import { NTag } from 'naive-ui'

  export default defineComponent({
    name: 'BindOrgEdit',
    components: { BasicModal },
    props: {
      roleId: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const orgAliasRef = ref()

      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '机关角色名称编辑'
      })
      const reloadTable = () => {
        // 刷新表单数据
        nextTick(() => {
          orgAliasRef.value.reload()
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
          title: '机关名称',
          key: 'orgName',
          width: 160,
          render(row) {
            return h(
              NTag,
              {
                style: {
                  marginRight: '6px'
                },
                type: row.orgName.indexOf('已被删除') === -1 ? 'info' : 'error'
              },
              {
                default: () => row.orgName
              }
            )
          }
        },
        {
          title: '角色名称',
          key: 'orgRoleName',
          edit: true,
          editComponent: 'NInput',
          width: 160
        }
      ])
      const createActions = (record) => {
        if (!record.editable) {
          return [
            {
              type: 'info',
              label: '编辑',
              onClick: handleOrgEdit.bind(null, record)
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
      // 机关名称编辑
      const handleOrgEdit = (record) => {
        record.onEdit?.(true, false)
      }
      const handleSave = async (record) => {
        await record.onEdit?.(false, true)
        const params = {
          relationId: record.id,
          orgRoleName: record.orgRoleName
        }
        await setOrgRoleName(params)
      }
      const handleCancel = (record) => {
        record.onEdit?.(false, false)
      }
      const getRoleOrgIds = async () => {
        return await queryRoleOrgIds(props.roleId)
      }
      watch(
        () => props.roleId,
        () => {
          reloadTable()
        }
      )
      return {
        orgAliasRef,
        actionColumn,
        columns,
        modalRegister,
        openModal,
        closeModal,
        getRoleOrgIds
      }
    }
  })
</script>

<template>
  <div class="role-set">
    <platform-tab @change-platform="changePlatformType" />
    <n-grid :x-gap="12">
      <n-grid-item span="3">
        <n-card :bordered="false">
          <n-thing
            v-for="item in dictionaryList.userGroupType"
            :key="item.value"
            class="p-2 cursor-pointer"
            :class="{ 'bg-blue-100 text-blue-100 bg-opacity-10': groupType === item.value }"
            @click="changeGroupType(item.value)"
          >
            <template #header>{{ item.label }}</template>
            <template #description>[ {{ item.remarks }} ]</template>
          </n-thing>
        </n-card>
      </n-grid-item>
      <n-grid-item span="21">
        <n-card :bordered="false">
          <basic-form :schemas="schemas" :gridProps="{ cols: 1 }" :showAdvancedButton="false" @submit="queryData" />
          <basic-table :columns="columns" :action-column="actionColumn" v-if="platformType" :request="resetInit" ref="roleRef" :frontEndIdentification="['b05_03_01']">
            <template #tableTitle="{ disabled }">
              <n-button type="primary" @click="handleAdd" :disabled="disabled">
                <template #icon>
                  <n-icon>
                    <PlusOutlined />
                  </n-icon>
                </template>
                新增
              </n-button>
            </template>
          </basic-table>
        </n-card>
      </n-grid-item>
    </n-grid>
    <n-drawer v-model:show="menuModal" :width="502">
      <n-drawer-content :title="`${drawerTitle} 设置菜单`">
        <single-and-all-select :tree-data="menuTreeData" :bind-keys="bindMenuKeys" :labelName="'jurisdictionName'" @on-check="submitMenuCheck" @close-modal="menuModal = false" />
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="interfaceTreeModal" :width="502">
      <n-drawer-content :title="`${drawerTitle} 设置接口`">
        <interface-permissions :is-check="true" :bind-keys="bindInterfaceKeys" @on-check="submitInterfaceCheck" @close-modal="interfaceTreeModal = false" />
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="memberModal" :width="502">
      <n-drawer-content :title="`${drawerTitle} 设置成员`" />
    </n-drawer>
    <n-drawer v-model:show="orgModal" :width="502">
      <n-drawer-content :title="`${drawerTitle} 设置机关`">
        <org-select @on-check="submitBindOrgId" :bindKeys="bindOrgIds" @close-modal="orgModal = false" />
      </n-drawer-content>
    </n-drawer>
    <bind-org-edit :roleId="roleIdOrg" ref="orgEditRef" />
    <bind-dept :roleId="roleIdDept" ref="deptRef" />
    <bind-dept-edit :roleId="roleIdDepeEdit" ref="deptEditRef" />
    <n-drawer v-model:show="addEditModal" :width="502">
      <n-drawer-content :title="roleInfo.id ? `${drawerTitle} 编辑角色` : `${drawerTitle} 新增角色`">
        <role-edit :form-info="roleInfo" @close-modal="addEditRefresh" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script lang="ts">
  import { useDialog } from 'naive-ui'
  import { PlusOutlined } from '@vicons/antd'
  import { FormSchema } from '@/components/form/index'
  import { TableAction } from '@/components/table/index'
  import { columns } from './columns'
  import PlatformTab from '../platform-tab.vue'
  import { SingleAndAllSelect } from '@/components/tree-select'
  import InterfacePermissions from '../interface-permissions/index.vue'
  import RoleEdit from './components/role-edit.vue'
  import OrgSelect from '@/views/user/org-manage/components/org-select.vue'
  import BindOrgEdit from './components/bind-org-edit.vue'
  import BindDept from './components/bind-dept.vue'
  import BindDeptEdit from './components/bind-dept-edit.vue'
  import { dictionariesKeys } from '@/hooks/dictionaries-keys'
  import { bindRoleBack, bindRoleFront, bindRoleOrg, changeRoleStatus, queryBindRoleBackId, queryBindRoleFrontId, queryRoleOrgIds, queryRolePermissions } from '@/api/authority/role-set'
  import { queryFrontPermissions } from '@/api/authority/front-permissions'
  import { IMenuParam } from '@/api/authority/types'

  export default defineComponent({
    name: 'RoleSet',
    components: {
      PlusOutlined,
      SingleAndAllSelect,
      InterfacePermissions,
      RoleEdit,
      OrgSelect,
      BindOrgEdit,
      BindDept,
      BindDeptEdit,
      PlatformTab
    },
    emits: ['closeModal'],
    setup(_prop, context) {
      const dialog = useDialog()
      // 字典
      const dictionaryList = ref<any>({})
      const orgEditRef = ref() // 角色绑定的机关起别名
      const deptRef = ref() // 角色绑定部门
      const deptEditRef = ref() // 角色绑定的部门起别名
      // 角色数据
      // const roleList = ref<>()
      const roleRef = ref()
      const state = reactive({
        menuModal: false, // 侧边栏-设置菜单
        interfaceTreeModal: false, // 侧边栏-设置接口
        addEditModal: false, // 侧边栏 -新增编辑
        memberModal: false, // 侧边栏-设置成员
        orgModal: false, // 侧边栏- 设置机关
        drawerTitle: '', // 侧边栏名字
        platformType: 0,
        searchRoleName: '', // 查询的rolename
        roleInfo: {
          id: undefined,
          platformType: 0, //平台类型
          userGroupType: 0, //所属用户组
          roleName: '', // 角色名称
          remarks: '', //描述
          status: undefined // 状态
        }, // 操作的角色信息
        menuTreeData: [] as IMenuParam[], // 设置菜单树
        bindMenuKeys: [] as number[], // 角色已绑定菜单id
        bindInterfaceKeys: [] as number[], // 角色已绑定接口id
        bindOrgIds: [] as Partial<string[]>, // 设置机关
        deptList: [], // 部门数据列
        menuCheckId: 0, // 当前角色id -设置菜单
        groupType: 1, // 当前用户组类型
        roleIdOrg: '',
        roleIdDept: '',
        roleIdDepeEdit: ''
      })
      // 查询条件
      const schemas = ref<FormSchema[]>([
        {
          field: 'roleName',
          component: 'NInput',
          label: '角色名称',
          defaultValue: '',
          giProps: {},
          componentProps: {
            placeholder: '请输入关键字'
          }
        }
      ])
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
            frontEndIdentification: ['b05_03_03'],
            label: '设置菜单',
            onClick: handleMenu.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_03'],
            label: '设置接口',
            onClick: handleInterface.bind(null, record),
            ifShow: () => {
              return state.groupType === 3
            }
          },
          {
            frontEndIdentification: ['b05_03_03'],
            label: '设置成员',
            onClick: handleMember.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_03'],
            label: '绑定部门',
            onClick: handleDepartment.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_03'],
            label: '绑定部门编辑',
            onClick: handleDeptEdit.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_03'],
            label: '绑定机关',
            onClick: handleOrg.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_03'],
            label: '绑定机关编辑',
            onClick: handleOrgEdit.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_01'],
            label: '编辑',
            onClick: handleEdit.bind(null, record)
          },
          {
            frontEndIdentification: ['b05_03_02'],
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const closeModal = () => {
        context.emit('closeModal')
      }
      const resetInit = async (res) => {
        const params = {
          ...res,
          platformType: state.platformType,
          userGroupType: state.groupType,
          roleName: state.searchRoleName
        }
        return await queryRolePermissions(params)
      }
      const reloadTable = (param = {}) => {
        // 刷新表单数据
        roleRef.value.reload(param)
      }
      // 查询
      const queryData = (params) => {
        state.searchRoleName = params.roleName
        reloadTable({ page: 1 })
      }
      // 新增
      const handleAdd = () => {
        state.roleInfo = {
          id: undefined,
          platformType: state.platformType, //平台类型
          userGroupType: state.groupType, //所属用户组
          roleName: '', // 角色名称
          remarks: '', //描述
          status: undefined // 状态
        }
        state.drawerTitle = ''
        state.addEditModal = true
      }
      // 绑定菜单
      const handleMenu = (record) => {
        state.drawerTitle = record.roleName
        state.menuCheckId = record.id
        getMenuTree(record.platformType, record.userGroupType)
        getBindMenuKeys(record.id)
        state.menuModal = true
      }
      // 第三方绑定接口
      const handleInterface = (record) => {
        state.menuCheckId = record.id
        state.drawerTitle = record.roleName
        getBindInterfaceKeys(record.id)
        state.interfaceTreeModal = true
      }
      // 设置成员
      const handleMember = (record) => {
        state.menuCheckId = record.id
        state.drawerTitle = record.roleName
        state.memberModal = true
      }
      // 设置部门
      const handleDepartment = (record) => {
        state.roleIdDept = record.id
        deptRef.value.openModal()
      }
      // 角色已绑定的部门-别名编辑
      const handleDeptEdit = (record) => {
        state.roleIdDepeEdit = record.id
        deptEditRef.value.openModal()
      }
      // 设置机关
      const handleOrg = (record) => {
        state.menuCheckId = record.id
        state.drawerTitle = record.roleName
        getRoleOrgIds(record.id)
        state.orgModal = true
      }
      // 获取角色绑定的机关id
      const getRoleOrgIds = (id) => {
        queryRoleOrgIds(id).then((data) => {
          state.bindOrgIds = data.map((item) => {
            return item.orgId
          })
        })
      }
      // 设置机关-提交
      const submitBindOrgId = async (keys) => {
        await bindRoleOrg({ id: state.menuCheckId, bindingIds: keys })
      }
      // 角色已绑定的机关-别名编辑
      const handleOrgEdit = (record) => {
        state.roleIdOrg = record.id
        orgEditRef.value.openModal()
      }
      // 编辑
      const handleEdit = (record) => {
        state.menuCheckId = record.id
        state.drawerTitle = record.roleName
        state.roleInfo = record
        state.addEditModal = true
      }
      // 删除
      const handleDelete = (record) => {
        state.menuCheckId = record.id
        const params = {
          id: record.id,
          status: record.status
        }
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            changeRoleStatus(params).then(() => {
              reloadTable()
            })
          },
          onNegativeClick: () => {}
        })
      }
      // 获取菜单数据
      const getMenuTree = (platformType, userGroupType) => {
        const params = {
          platformType: platformType,
          userGroupTypes: userGroupType
        }
        queryFrontPermissions(params).then((data) => {
          state.menuTreeData = data
        })
      }
      // 获取角色已绑定的菜单id
      const getBindMenuKeys = (id) => {
        const params = {
          roleId: id
        }
        queryBindRoleFrontId(params).then((data) => {
          state.bindMenuKeys = data
        })
      }
      // 保存设置菜单勾选
      const submitMenuCheck = async (keys) => {
        await bindRoleFront({ id: state.menuCheckId, bindingIds: keys })
      }
      // 获取角色已绑定的接口id
      const getBindInterfaceKeys = (id) => {
        const params = {
          roleId: id
        }
        queryBindRoleBackId(params).then((data) => {
          state.bindInterfaceKeys = data
        })
      }
      // 保存设置接口勾选
      const submitInterfaceCheck = async (keys) => {
        await bindRoleBack({ id: state.menuCheckId, bindingIds: keys })
      }
      // 新增编辑后刷新
      const addEditRefresh = () => {
        state.addEditModal = false
        reloadTable(state.roleInfo.id ? {} : { page: 1 })
      }
      // 平台切换
      const changePlatformType = (value, isInit) => {
        state.platformType = value
        if (!isInit) {
          reloadTable({ page: 1 })
        }
      }
      // 用户组切换
      const changeGroupType = (value) => {
        state.groupType = value
        reloadTable({ page: 1 })
      }
      // 获取用户组类型
      const getGroupTypes = async () => {
        dictionaryList.value = await dictionariesKeys(['userGroupType'], true)
        state.groupType = dictionaryList.value.userGroupType[0].value
      }
      getGroupTypes()
      return {
        dictionaryList,
        reloadTable,
        roleRef,
        orgEditRef,
        deptRef,
        deptEditRef,
        schemas,
        actionColumn,
        columns,
        ...toRefs(state),
        closeModal,
        changePlatformType,
        changeGroupType,
        resetInit,
        queryData,
        handleAdd,
        addEditRefresh,
        submitMenuCheck,
        submitInterfaceCheck,
        submitBindOrgId
      }
    }
  })
</script>

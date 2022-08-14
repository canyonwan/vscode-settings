<template>
  <div class="org-manage">
    <n-tree
      v-if="treeData.length"
      block-line
      :key-field="'id'"
      :label-field="'orgName'"
      :children-field="'childrenList'"
      virtual-scroll
      :data="treeData"
      :default-expanded-keys="defaultExpandedKeys"
      :selected-keys="selectedKeys"
      :render-suffix="renderSuffix"
      :render-prefix="renderPrefix"
      @update:selected-keys="updateSelectedKeys"
      style="height: calc(100vh - 150px)"
    />
    <basic-modal :title="isAdd ? '机关机构新增' : '机关机构编辑'" @register="modalRegister" style="width: 70%" @on-ok="okModal">
      <org-add-edit :org-id="orgId" :is-add="isAdd" @on-submit="okModal" @close-modal="closeModal" />
    </basic-modal>
    <basic-modal :title="isAddGroup ? '机关组新增' : '机关组编辑'" @register="groupModalRegister" @on-ok="okModal">
      <org-group-add :org-id="orgIdGroup" :is-add="isAddGroup" :orgGroup="orgGroup" @on-submit="okModal" @close-modal="groupCloseModal" />
    </basic-modal>
    <basic-modal @register="manageModalRegister" style="min-width: 40%" @on-ok="manageCloseModal">
      <org-select @on-check="submitManage" :bindKeys="manageOrgIds" @close-modal="manageCloseModal" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { useDialog, NDropdown, NIcon } from 'naive-ui'
  import { CheckSquareFilled, DeleteFilled, EditFilled, PlusSquareFilled } from '@vicons/antd'
  import { orgTreeData } from './org-tree-data'
  import OrgAddEdit from './components/org-add-edit.vue'
  import { useModal } from '@/components/modal/index'
  import { deleteOrg, queryOrgManage, saveOrgManage } from '@/api/user/org'
  import { editTreeItem } from '@/utils'
  import OrgSelect from './components/org-select.vue'
  import { IOrgManage } from '@/api/user/types'
  import OrgGroupAdd from './components/org-group-add.vue'
  import { Folder, People } from '@vicons/ionicons5'
  import { usePermission } from '@/hooks/web/use-permission'

  export default defineComponent({
    name: 'OrgManage',
    components: {
      OrgAddEdit,
      OrgSelect,
      OrgGroupAdd
    },
    emits: ['selectedInfo'],
    setup(_props, context) {
      const treeData = ref<any>([])
      const defaultExpandedKeys = ref<Array<string | number>>([])
      const selectedKeys = ref<Array<string | number>>([])
      const dialog = useDialog()
      const state = reactive({
        isAdd: true, // 判断新增true,编辑false
        orgId: '', // 操作的机关id
        orgGroup: '', // 判断新增的机关机构还是机关组
        orgIdGroup: '', // 机关组机关id
        isAddGroup: true, // 判断新增true,编辑false
        manageOrgInfo: {} as IOrgManage, // 机关管辖的下属机关信息
        manageOrgIds: [] as Array<number | string> // 机关管辖的下属机关ids
      })
      const [modalRegister, { openModal, closeModal }] = useModal({})
      // 设置管辖关系弹窗
      const [manageModalRegister, { openModal: manageOpenModal, closeModal: manageCloseModal }] = useModal({
        title: '设置管辖关系'
      })
      // 机关机构组维护
      const [groupModalRegister, { openModal: groupOpenModal, closeModal: groupCloseModal }] = useModal({})
      const updateSelectedKeys = (keys, option) => {
        if (keys && keys.length) {
          selectedKeys.value = keys
          const noGroup = option[0].orgGroup === '0'
          context.emit('selectedInfo', keys[0], noGroup)
        }
      }
      // 动态权限
      const { buttonShowPermission, buttonDisabledPermission } = usePermission()

      // 树数据处理
      const renderSuffix = ({ option }) => {
        if (option.childrenList && option.childrenList.length === 0) {
          delete option.childrenList
        }
        return [
          h(
            NDropdown,
            {
              placement: 'right-start',
              showArrow: true,
              options: [
                {
                  label: '设置管辖关系',
                  key: 'manage',
                  icon() {
                    return h(NIcon, null, {
                      default: () => h(CheckSquareFilled)
                    })
                  },
                  props: {
                    style: {
                      display: buttonShowPermission(['a03_04']) ? '' : 'none'
                    }
                  },
                  disabled: buttonDisabledPermission(['a03_04'])
                },
                {
                  label: '新增',
                  key: 'add',
                  icon() {
                    return h(NIcon, null, {
                      default: () => h(PlusSquareFilled)
                    })
                  },
                  props: {
                    style: {
                      display: buttonShowPermission(['a03_05']) ? '' : 'none'
                    }
                  },
                  disabled: buttonDisabledPermission(['a03_05']),
                  children: [
                    {
                      label: '机关机构',
                      key: '0',
                      icon() {
                        return h(NIcon, null, {
                          default: () => h(People)
                        })
                      }
                    },
                    {
                      label: '分组',
                      key: '1',
                      icon() {
                        return h(NIcon, null, {
                          default: () => h(Folder)
                        })
                      }
                    }
                  ]
                },
                {
                  label: '编辑',
                  key: 'edit',
                  icon() {
                    return h(NIcon, null, {
                      default: () => h(EditFilled)
                    })
                  },
                  props: {
                    style: {
                      display: buttonShowPermission(['a03_05']) ? '' : 'none'
                    }
                  },
                  disabled: buttonDisabledPermission(['a03_05'])
                },
                {
                  label: '删除',
                  key: 'delete',
                  icon() {
                    return h(NIcon, null, {
                      default: () => h(DeleteFilled)
                    })
                  },
                  props: {
                    style: {
                      display: buttonShowPermission(['a03_06']) ? '' : 'none'
                    }
                  },
                  disabled: buttonDisabledPermission(['a03_06'])
                }
              ],
              onSelect: (key) => {
                if (key === 'manage') {
                  handleManage(option)
                } else if (key === '0') {
                  handleAdd('0', option)
                } else if (key === '1') {
                  handleAdd('1', option)
                } else if (key === 'edit') {
                  handleEdit(option)
                } else if (key === 'delete') {
                  handleDelete(option)
                }
              }
            },
            {
              default: () => '···'
            }
          )
        ]
      }
      const renderPrefix = ({ option }) => {
        return h(NIcon, null, {
          default: () => (option.orgGroup === '0' ? h(People) : h(Folder))
        })
      }
      const resetInit = async () => {
        const data = await orgTreeData({})
        defaultExpandedKeys.value[0] = data[0].id
        selectedKeys.value[0] = data[0].id
        context.emit('selectedInfo', data[0].id)
        treeData.value = data
      }
      const okModal = (data, isAdd) => {
        if (state.orgGroup === '1') {
          groupCloseModal()
        } else if (state.orgGroup === '0') {
          closeModal()
        }
        treeData.value = editTreeItem(treeData.value, data, isAdd)
      }
      const handleManage = (info) => {
        state.orgId = info.id
        // 获取管辖的机关ids
        queryOrgManage(info.id).then(
          (data) => {
            state.manageOrgInfo = data
            state.manageOrgIds = data.parentPowerOrg ? data.parentPowerOrg.split(',') : []
          },
          () => {
            state.manageOrgIds = []
          }
        )
        manageOpenModal()
      }
      // 提交管辖机关
      const submitManage = async (keys) => {
        let params: IOrgManage = {
          orgId: state.orgId,
          parentPowerOrg: keys.join(',')
        }
        // 编辑有id
        if (state.manageOrgInfo.id) {
          params.id = state.manageOrgInfo.id
        }
        await saveOrgManage(params)
      }
      const handleAdd = (key, info) => {
        state.orgGroup = key
        if (key === '1') {
          state.orgIdGroup = info.id
          state.isAddGroup = true
          groupOpenModal()
        } else if (key === '0') {
          state.isAdd = true
          state.orgId = info.id
          openModal()
        }
      }
      const handleEdit = (info) => {
        // 机关组判断 orgGroup为1是分组
        if (info.orgGroup === '1') {
          state.orgIdGroup = info.id
          state.isAddGroup = false
          groupOpenModal()
        } else if (info.orgGroup === '0') {
          state.orgId = info.id
          state.isAdd = false
          openModal()
        }
        state.orgGroup = info.orgGroup
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            deleteOrg(info.id).then(() => {
              resetInit()
            })
          },
          onNegativeClick: () => {}
        })
      }
      resetInit()
      return {
        treeData,
        defaultExpandedKeys,
        selectedKeys,
        ...toRefs(state),
        modalRegister,
        manageModalRegister,
        groupModalRegister,
        manageCloseModal,
        okModal,
        renderSuffix,
        renderPrefix,
        updateSelectedKeys,
        submitManage,
        groupCloseModal,
        closeModal
      }
    }
  })
</script>

<template>
  <div class="select-user h-full">
    <n-grid cols="1 s:1 m:1 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12">
      <n-grid-item span="1">
        <n-card :bordered="false" :content-style="'padding: 18px 10px 10px 10px;'">
          <n-tree
            v-if="orgTreeData.length"
            block-line
            key-field="id"
            label-field="orgName"
            children-field="childrenList"
            virtual-scroll
            :data="orgTreeData"
            :default-expanded-keys="defaultExpandedKeys"
            :selected-keys="selectedKeys"
            :render-suffix="rendeSruffix"
            @update:selected-keys="updateSelectedKeys"
            style="height: calc(100vh - 147px)"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card :bordered="false" :content-style="'padding: 18px 15px;'">
          <basic-form @register="register" @submit="queryData" />
          <n-spin :show="loading">
            <n-checkbox-group :value="selectedUserIds" @update-value="updateSelectedUsers" class="overflow-y-scroll" style="height: calc(100vh - 300px)">
              <!-- :defaultExpandedId="orgUserData.id ? orgUserData.id : ''" -->
              <org-user :item="orgUserData" v-model:selectUser="selectedUsers" />
            </n-checkbox-group>
            <div class="mt-3 mb-3 p-2 bg-gray-100 bg-opacity-10">
              <n-space>
                <span>已选:</span>
                <template v-if="selectedUsers && selectedUsers.length">
                  <n-tag v-for="item in selectedUsers" closable :key="item.id" @close="handleDelete(item)">
                    <!-- {{ item.positionValue ? '(' + item.positionValue + ')' : '' -->
                    {{ item.orgName ? item.orgName + '/' + item.realName : item.realName }}
                  </n-tag>
                </template>
              </n-space>
            </div>
            <div class="text-right justify-end">
              <n-button type="primary" class="ml-2" @click="closeModal">取消</n-button>
              <n-button class="ml-2" @click="handleSubmit" type="primary">确定</n-button>
            </div>
          </n-spin>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts">
  import { useForm } from '@/components/form'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { schemas } from './components/option'
  import { queryOrgAndUser, queryUpAndDownOrg } from '@/api/user/org'
  import { IOrgTreeInfo, IPersonnelInfo } from '@/api/user/types'
  import { useUserStore } from '@/store/modules/user'
  import OrgUser from './components/org-user.vue'
  import { difference } from 'lodash-es'
  import { NTag } from 'naive-ui'
  export default defineComponent({
    name: 'SelectUser',
    components: {
      OrgUser
    },
    props: {
      // 是否单选
      isSingleSelect: {
        type: Boolean,
        default: false
      },
      usersData: {
        type: Array as PropType<IPersonnelInfo[]>,
        default: () => []
      }
    },
    emits: ['closeModal', 'update:usersData'],
    setup(props, context) {
      const user = useUserStore()
      const loading = ref(false)
      const selectedKeys = ref<Array<string | number>>([])
      const defaultExpandedKeys = ref<Array<string | number>>([])
      const state = reactive({
        searchParam: {},
        selectedUserIds: [] as string[], // 选择人员ids
        userDetail: {} as IPersonnelInfo, // 每次选择取消操作的人员详情
        // userLength: 0, // 选择的人员数组长度
        selectedUsers: [] as IPersonnelInfo[], // 选择人员详情
        orgTreeData: [] as IOrgTreeInfo[],
        orgUserData: {} as IOrgTreeInfo
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [register] = useForm({
        gridProps: {
          cols: 2
        },
        labelWidth: 80,
        submitButtonText: '查询',
        showAdvancedButton: false,
        schemas: schemasForm.value
      })
      const resetInit = async () => {
        const orgId = user.getUserInfo.orgId ? user.getUserInfo.orgId : 0
        const data = await queryUpAndDownOrg(orgId)
        defaultExpandedKeys.value[0] = data[0].id
        state.orgTreeData = data
        selectedKeys.value[0] = String(orgId)
        getOrgAndUser({ orgId: orgId })
      }
      resetInit()

      const rendeSruffix = ({ option }) => {
        if (option.childrenList && option.childrenList.length === 0) {
          delete option.childrenList
        }
        if (option.orgGroup === '1') {
          option.disabled = true
        }
        return h(
          NTag,
          {
            type: option.orgGroup === '1' ? 'warning' : option.attachedType === 1 ? 'info' : 'success',
            style: {
              marginRight: '10px'
            },
            size: 'small',
            round: true
          },
          {
            default: () => (option.orgGroup === '1' ? '分组' : option.attachedType === 1 ? '机关' : '机构')
          }
        )
      }

      // 右侧机关和人员数据
      const getOrgAndUser = (res) => {
        loading.value = true
        state.orgUserData = {} as IOrgTreeInfo
        queryOrgAndUser(res).then(
          (data) => {
            loading.value = false
            state.orgUserData = data
          },
          () => {
            loading.value = false
          }
        )
      }
      const queryData = (params) => {
        state.searchParam = params
        getOrgAndUser({ ...params, orgId: selectedKeys.value[0] })
      }
      // 人员选择
      const updateSelectedUsers = (value) => {
        if (value && value.length) {
          if (state.selectedUserIds.length > value.length) {
            const removeItem = difference(state.selectedUserIds, value)
            const ids = removeItem[0].split(',')
            handleSelect(true, ids, value)
          } else {
            const ids = value[value.length - 1].split(',')
            handleSelect(false, ids, value)
          }
        } else {
          state.selectedUsers = []
          state.selectedUserIds = []
        }
      }
      const handleSelect = (isRemove, ids, value) => {
        queryUser(state.orgUserData, ids)
        if (props.isSingleSelect) {
          if (isRemove) {
            state.selectedUsers.splice(0, 1)
            state.selectedUserIds = []
            state.userDetail = {} as IPersonnelInfo
          } else {
            state.selectedUserIds = [value[value.length - 1]]
            if (value.length > 1) {
              state.selectedUsers.splice(0, value.length - 1, state.userDetail)
            } else if (value.length === 1) {
              state.selectedUsers.push(state.userDetail)
            }
            state.userDetail = {} as IPersonnelInfo
          }
        } else {
          if (isRemove) {
            state.selectedUsers.splice(state.selectedUsers.indexOf(state.userDetail), 1)
          } else {
            state.selectedUsers.push(state.userDetail)
          }
          state.selectedUserIds = value
          state.userDetail = {} as IPersonnelInfo
        }
      }
      // 返回选择的人员信息 orgUserData
      const queryUser = (data, ids) => {
        if (data.id === ids[0]) {
          for (const item of data.userList) {
            if (item.id === ids[1]) {
              item.orgName = data.orgName
              state.userDetail = item
            }
          }
        } else {
          if (data.childrenList && data.childrenList.length) {
            for (const item of data.childrenList) {
              queryUser(item, ids)
            }
          }
        }
      }
      const updateSelectedKeys = (keys) => {
        if (keys && keys.length) {
          selectedKeys.value = keys
          getOrgAndUser({ ...state.searchParam, orgId: selectedKeys.value[0] })
        }
      }
      const closeModal = () => {
        context.emit('closeModal')
      }
      const handleSubmit = () => {
        context.emit('update:usersData', state.selectedUsers)
        context.emit('closeModal')
      }
      const handleDelete = (item) => {
        state.selectedUserIds.splice(state.selectedUserIds.indexOf(item.orgId + ',' + item.id), 1)
        state.selectedUsers.splice(state.selectedUsers.indexOf(item), 1)
      }
      watch(
        () => props.usersData,
        () => {
          state.selectedUsers = props.usersData.length ? [...props.usersData] : []
          state.selectedUserIds = props.usersData.length ? props.usersData.map((item) => item.orgId + ',' + item.id) : []
        },
        {
          immediate: true,
          deep: true
        }
      )
      return {
        loading,
        selectedKeys,
        defaultExpandedKeys,
        register,
        ...toRefs(state),
        rendeSruffix,
        updateSelectedKeys,
        updateSelectedUsers,
        closeModal,
        handleSubmit,
        handleDelete,
        queryData
      }
    }
  })
</script>

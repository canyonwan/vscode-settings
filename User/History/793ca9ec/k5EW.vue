<template>
  <div class="case-type-trees">
    <n-tree
      :data="treeOptions"
      :render-suffix="$props.useCheckable ? () => [] : renderSuffix"
      block-line
      :checkable="$props.useCheckable"
      key-field="id"
      label-field="name"
      children-field="list"
      @update:checked-keys="updateCheckedKeys"
      :default-checked-keys="boundCaseTypeKeys"
      check-strategy="all"
    />
    <div class="pt-4 text-right" v-if="$props.useCheckable">
      <n-button class="ml-2" @click="onCancelCheckKeys"> 取消 </n-button>
      <n-button class="ml-2" type="primary" @click="onSubmitCheckedKeys"> 确定 </n-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { queryCaseTypesTree } from '@/api/setting/case-type'
  import type { ICaseType } from '@/api/setting/types'
  import { NButton, TreeOption, useDialog } from 'naive-ui'
  import { usePermission } from '@/hooks/web/use-permission'

  export default defineComponent({
    name: 'CaseTypeTrees',
    props: {
      useCheckable: {
        type: Boolean,
        default: false
      },
      boundCaseTypeKeys: {
        type: Array as PropType<string[]>,
        default: () => []
      }
    },
    emits: ['addSubHandler', 'onEditRow', 'onDeleteRow', 'onAddTopLevel', 'onCheckedKeysHandler', 'onCancelCheckKeys'],
    setup(props, { emit }) {
      const state = reactive({
        treeOptions: [] as ICaseType[],
        boundCaseTypeKeys: [] as string[],
        boundCaseTypeTreeOptions: [] as TreeOption[]
      })
      // 动态权限
      const { buttonShowPermission, buttonDisabledPermission } = usePermission()

      function renderSuffix({ option }) {
        return [
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              style: {
                marginRight: '10px',
                display: buttonShowPermission(['b04_04_01']) ? '' : 'none'
              },
              disabled: buttonDisabledPermission(['b04_04_01']),
              onClick: () => onAddRow(option)
            },
            { default: () => '新增' }
          ),
          h(
            NButton,
            {
              text: true,
              type: 'success',
              style: {
                marginRight: '10px',
                display: buttonShowPermission(['b04_04_01']) ? '' : 'none'
              },
              disabled: buttonDisabledPermission(['b04_04_01']),
              onClick: () => onEditRow(option)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              text: true,
              type: 'error',
              style: {
                marginRight: '5px',
                display: buttonShowPermission(['b04_04_02']) ? '' : 'none'
              },
              disabled: buttonDisabledPermission(['b04_04_02']),
              onClick: () => onDeleteRow(option)
            },
            { default: () => '删除' }
          )
        ]
      }

      // 获取案件类型树
      async function getCaseTypesTree() {
        let res = await queryCaseTypesTree()
        state.treeOptions = processTreeData(res)
      }

      // 处理tree数据
      function processTreeData(data: ICaseType[]) {
        if (data.length > 0) {
          for (const ele of data) {
            if (ele.list.length > 0) {
              processTreeData(ele.list)
            } else {
              delete ele.list
            }
          }
        }
        return data
      }

      // 新增子级 id: null, parentId: row.id
      function onAddRow(row: ICaseType) {
        const params = {
          id: undefined,
          parentId: row.id,
          name: '',
          remarks: '',
          dataType: 0,
          programTypeId: null,
          whetherParentUseType: null
        }
        emit('addSubHandler', params, row.name)
      }

      // 编辑行
      function onEditRow(row: ICaseType) {
        emit('onEditRow', row)
      }

      const dialog = useDialog()

      // 删除行
      function onDeleteRow(option: ICaseType) {
        dialog.error({
          title: '警告',
          content: '你确定删除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            emit('onDeleteRow', option)
          }
        })
      }

      // 勾选行
      const updateCheckedKeys = (keys: string[], options: TreeOption[]) => {
        state.boundCaseTypeKeys = keys
        state.boundCaseTypeTreeOptions = options
      }

      // 点击行
      // TAG 暂时去掉, 因为点新增时会触发点击行操作
      // const onUpdateSelectedKeys = (_: string[], options: TreeOption[]) => {
      // emit('onEditRow', options.[0])
      // }

      const onSubmitCheckedKeys = () => {
        emit('onCheckedKeysHandler', state.boundCaseTypeKeys, state.boundCaseTypeTreeOptions)
      }

      const onCancelCheckKeys = () => {
        emit('onCancelCheckKeys')
      }

      props.useCheckable && watchEffect(() => (state.boundCaseTypeKeys = props.boundCaseTypeKeys))

      onMounted(() => {
        getCaseTypesTree()
      })

      return { ...toRefs(state), getCaseTypesTree, renderSuffix, updateCheckedKeys, onSubmitCheckedKeys, onCancelCheckKeys }
    }
  })
</script>

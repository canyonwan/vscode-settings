<template>
  <div class="case-type-trees">
    <n-tree
      :data="treeOptions"
      :render-suffix="renderSuffix"
      block-line
      :checkable="$props.useCheckable"
      key-field="id"
      label-field="name"
      children-field="list"
      @update:checked-keys="updateCheckedKeys"
      @update:selected-keys="onUpdateSelectedKeys"
      :default-checked-keys="boundCaseTypeKeys"
      check-strategy="all"
    />
    <div class="pt-4 text-right" v-if="$props.useCheckable">
      <n-button class="ml-2" x @click="onCancelCheckKeys"> 取消 </n-button>
      <n-button class="ml-2" x type="primary" @click="onSubmitCheckedKeys"> 确定 </n-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { queryCaseTypesTree } from '@/api/setting/case-type'
  import type { ICaseType } from '@/api/setting/types'
  import { NButton, TreeOption } from 'naive-ui'

  export default defineComponent({
    name: 'CaseTypeTrees',
    components: {},
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
    emits: ['addSubhandler', 'onEditRow', 'onDeleteRow', 'onAddTopLevel', 'onCheckedKeysHandler', 'onCancelCheckKeys'],
    setup(props, { emit }) {
      const state = reactive({
        treeOptions: [] as ICaseType[],
        boundCaseTypeKeys: [] as string[],
        boundCaseTypeTreeOptions: [] as TreeOption[]
      })

      function renderSuffix({ option }) {
        return [
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              style: {
                marginRight: '10px'
              },
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
                marginRight: '10px'
              },
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
                marginRight: '5px'
              },
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
        console.log('新增')
        const params = {
          id: null,
          parentId: row.id
        }
        emit('addSubhandler', params)
      }

      // 编辑行
      function onEditRow(row: ICaseType) {
        console.log('编辑')

        emit('onEditRow', row)
      }

      // 删除行
      function onDeleteRow(option: ICaseType) {
        emit('onDeleteRow', option)
      }

      // 勾选行
      const updateCheckedKeys = (keys: string[], options: TreeOption[]) => {
        state.boundCaseTypeKeys = keys
        state.boundCaseTypeTreeOptions = options
      }

      // 点击行
      const onUpdateSelectedKeys = (_: string[], options: TreeOption[]) => {
        emit('onEditRow', options.at(0))
      }

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

      return { ...toRefs(state), getCaseTypesTree, renderSuffix, updateCheckedKeys, onUpdateSelectedKeys, onSubmitCheckedKeys, onCancelCheckKeys }
    }
  })
</script>

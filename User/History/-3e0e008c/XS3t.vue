<template>
  <div class="single-and-all-select">
    <n-tree
      v-if="treeList.length"
      block-line
      :data="treeList"
      checkable
      default-expand-all
      virtual-scroll
      :style="`max-height: calc(100vh - ${height}px)`"
      :key-field="keyName"
      :label-field="labelName"
      :children-field="'childrenList'"
      :render-prefix="renderPrefix"
      :checked-keys="checkedKeys"
      @update:checked-keys="updateCheckedKeys"
    />
    <div class="text-right">
      <n-button class="ml-2" @click="closeModal">取消</n-button>
      <n-button class="ml-2" @click="handleSubmit" type="primary">确定</n-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { NButton } from 'naive-ui'
  import { IMenuParam } from '@/api/authority/types'
  import { getSelectIds } from './check'
  import { intersection } from 'lodash-es'
  export default defineComponent({
    name: 'SingleAndAllSelect',
    components: {},
    props: {
      // 树数据
      treeData: {
        type: Array as PropType<IMenuParam[]>,
        default: () => {
          return []
        }
      },
      bindKeys: {
        type: Array as PropType<Array<number | string>>,
        default: () => {
          return []
        }
      },
      // 树节点 显示名称
      labelName: {
        type: String,
        default: 'label'
      },
      keyName: {
        type: String,
        default: 'id'
      },
      height: {
        type: Number,
        default: 150
      }
    },
    emits: ['closeModal', 'onCheck'],
    setup(props, context) {
      const state = reactive({
        treeList: [] as IMenuParam[],
        allTreeKeys: [] as Array<number | string>, // 数据所有的id
        checkedKeys: [] as Array<number | string>, // 勾选的树节点
        checkedRows: [] as Array<number | string> // 勾选的树节点
      })

      // 树数据处理
      const renderPrefix = ({ option }) => {
        if (option.childrenList && option.childrenList.length > 0) {
          return [
            h(
              NButton,
              {
                text: true,
                type: 'primary',
                style: {
                  marginRight: '5px'
                },
                onClick: () => handleCheckChild(true, option)
              },
              {
                default: () => '全选'
              }
            ),
            h(
              NButton,
              {
                text: true,
                type: 'error',
                style: {
                  marginRight: '5px'
                },
                onClick: () => handleCheckChild(false, option)
              },
              {
                default: () => '取消'
              }
            )
          ]
        } else {
          delete option.childrenList
        }
      }
      watch([() => props.treeData, () => props.bindKeys], () => {
        state.allTreeKeys = []
        state.treeList = props.treeData
        state.treeList.map((item) => {
          state.allTreeKeys.push(...getSelectIds(item))
        })
        state.checkedKeys = intersection(state.allTreeKeys, props.bindKeys)
      })
      const handleCheckChild = (checked, item) => {
        const allSelectKeys = getSelectIds(item)
        if (checked) {
          state.checkedKeys = [...new Set([...state.checkedKeys, ...allSelectKeys])]
        } else {
          let removeKeys = new Set(allSelectKeys)
          state.checkedKeys = [...state.checkedKeys].filter((x) => !removeKeys.has(x))
        }
      }
      const closeModal = () => {
        context.emit('closeModal')
      }
      const updateCheckedKeys = (keys) => {
        state.checkedKeys = keys
      }
      const handleSubmit = () => {
        context.emit('onCheck', state.checkedKeys)
        closeModal()
      }
      return {
        ...toRefs(state),
        closeModal,
        renderPrefix,
        updateCheckedKeys,
        handleSubmit
      }
    }
  })
</script>

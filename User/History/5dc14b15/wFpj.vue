<template>
  <div class="select-bind-tag">
    <n-tree
      :data="treeOptions"
      v-if="treeOptions?.length"
      cascade
      checkable
      block-line
      :default-expanded-keys="defaultExpandedKeys"
      :checked-keys="checkedKeys"
      @update:checked-keys="updateCheckedTags"
      key-field="id"
      label-field="name"
      children-field="list"
      virtual-scroll
      style="height: calc(100vh - 175px)"
    />
    <div class="pt-4 text-right">
      <n-button class="ml-2" @click="closeModal">取消</n-button>
      <n-button class="ml-2" @click="handleSubmit" type="primary">确定</n-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { ILawTagType } from '@/api/law/types'
  import { queryAllLawTags } from '@/api/law/tag'
  import { LawEnum } from '@/enums/law-enum'
  import { queryAllCauseTags } from '@/api/cause-manage/cause-manage'

  export default defineComponent({
    name: 'SelectBindTag',
    components: {},
    props: {
      dataType: {
        type: Number as PropType<LawEnum>,
        default: LawEnum.TYPE
      },
      selectKeys: {
        type: Array as PropType<Array<string>>,
        default: () => {
          return []
        }
      }
    },
    emits: ['closeModal', 'handleUpdateValue'],
    setup(props, { emit }) {
      const state = reactive({
        defaultExpandedKeys: [] as string[],
        checkedKeys: [] as string[],
        treeOptions: [] as ILawTagType[]
      })

      function handleTreeData(data) {
        if (data.length > 0) {
          for (const ele of data) {
            if (ele.list && ele.list.length > 0) {
              handleTreeData(ele.list)
            } else {
              delete ele.list
            }
          }
        }
        return data
      }

      // cancel
      function closeModal() {
        emit('closeModal')
      }

      // 更新选中的标签
      function updateCheckedTags(val: string[]) {
        state.checkedKeys = val
      }

      // 获取违法行为标签数据
      async function getLawTypeData() {
        let res: ILawTagType[] = await queryAllCauseTags()
        state.treeOptions = await handleTreeData(res)
      }

      // 获取法标签数据
      async function getLawTagData() {
        let res: ILawTagType[] = await queryAllLawTags()
        state.treeOptions = await handleTreeData(res)
      }

      function handleSubmit() {
        emit('handleUpdateValue', state.checkedKeys)
      }

      onMounted(() => {
        props.dataType === LawEnum.TAG ? getLawTagData() : getLawTypeData()
      })

      watch(
        () => props.selectKeys,
        () => {
          state.checkedKeys = props.selectKeys
        },
        { immediate: true }
      )

      return { ...toRefs(state), closeModal, handleSubmit, updateCheckedTags }
    }
  })
</script>

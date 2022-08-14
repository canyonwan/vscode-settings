<template>
  <div class="bind-tag">
    <n-tree
      :data="lawTags"
      v-if="lawTags?.length"
      cascade
      checkable
      block-line
      @update:checked-keys="updateCheckedTags"
      :default-expanded-keys="defaultExpandedKeys"
      :checked-keys="checkedKeys"
      key-field="id"
      label-field="name"
      children-field="list"
    />
    <div class="pt-4 text-right">
      <n-button class="ml-2" @click="closeModal">取消</n-button>
      <n-button class="ml-2" @click="handleSubmit" type="primary">确定</n-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { ILawTagType } from '@/api/law/types'
  import { lawBindTag, queryAllLawTags, queryTagsWithLaw } from '@/api/law/tag'

  export default defineComponent({
    name: 'BindTag',
    components: {},
    props: {
      currentLawId: {
        type: String,
        default: '',
        required: true
      }
    },
    emits: ['onCloseModal', 'onSubmit'],
    setup(props, { emit }) {
      const state = reactive({
        lawTags: [] as ILawTagType[],
        boundLawWithTags: [] as string[],
        defaultExpandedKeys: [] as string[],
        checkedKeys: [] as string[]
      })

      // 获取数据
      async function queryLawTags() {
        let res = await queryAllLawTags()
        state.lawTags = handleTreeData(res)
      }
      function handleTreeData(data: ILawTagType[]) {
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

      // 获取法绑定的标签
      async function getBoundLawWithTags() {
        let res: ILawTagType[] = await queryTagsWithLaw(props.currentLawId)
        state.boundLawWithTags = res.map((item) => item.id!)
        res.length > 0 && (state.defaultExpandedKeys = [state.boundLawWithTags[0]])
        Object.assign(state.checkedKeys, state.boundLawWithTags)
      }

      // submit
      async function handleSubmit() {
        await lawBindTag({
          sourceId: props.currentLawId,
          targetList: state.checkedKeys
        })
        emit('onSubmit')
      }

      // cancel
      function closeModal() {
        emit('onCloseModal')
      }

      // 更新选中的标签
      function updateCheckedTags(val: string[]) {
        state.checkedKeys = val
      }

      onMounted(() => {
        queryLawTags()
        getBoundLawWithTags()
      })

      return { ...toRefs(state), closeModal, handleSubmit, updateCheckedTags }
    }
  })
</script>

<template>
  <div style="width: 80%">
    <n-tree-select v-model:value="lawTypeIdValue" clearable :multiple="multiple" :options="treeOptions" label-field="name" key-field="id" children-field="list" @update:value="onUpdateValue" />
  </div>
</template>

<script lang="ts">
  import { queryAllLawTypes } from '@/api/law/type'
  import type { ILawTagType } from '@/api/law/types'
  import { queryAllLawTags } from '@/api/law/tag'
  import { LawEnum } from '@/enums/law-enum'

  export default defineComponent({
    name: 'LawTypeTreeSelect',
    props: {
      dataType: {
        type: Number as PropType<LawEnum>,
        default: LawEnum.TYPE
      },
      lawTypeId: {
        type: String,
        default: ''
      }
    },
    emits: ['handleUpdateValue'],
    setup(props, { emit }) {
      const state = reactive({
        lawTypeIdValue: '',
        treeOptions: [] as ILawTagType[],
        multiple: props.dataType !== LawEnum.TYPE
      })

      // 获取法类型数据
      async function getLawTypeData() {
        let res: ILawTagType[] = await queryAllLawTypes()
        state.treeOptions = await handleTreeData(res)
      }

      async function handleTreeData(data: ILawTagType[]) {
        if (data.length > 0) {
          for (const ele of data) {
            ele.list && ele.list.length > 0 ? await handleTreeData(ele.list) : delete ele.list
          }
        }
        return data
      }

      // 获取法标签数据
      async function getLawTagData() {
        let res: ILawTagType[] = await queryAllLawTags()
        state.treeOptions = await handleTreeData(res)
      }

      function onUpdateValue(value: string) {
        state.lawTypeIdValue = value
        emit('handleUpdateValue', value)
      }

      watch(
        () => props.lawTypeId,
        () => {
          state.lawTypeIdValue = props.lawTypeId
        }
      )

      onMounted(() => {
        props.dataType === LawEnum.TAG ? getLawTagData() : getLawTypeData()
      })

      return { ...toRefs(state), onUpdateValue }
    }
  })
</script>

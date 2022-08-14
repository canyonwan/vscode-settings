<template>
  <div class="target-manage">
    <main-header :options="optionsList" @click-item-handler="clickItemHandler" v-if="typeData && typeData.length" />
    <n-card :bordered="false">
      <template v-if="typeData && typeData.length">
        <target-info
          :rootTypeId="currentTargetType"
          :key="currentTargetType"
          :childTypes="childTypes"
          :searchSchemas="currentSearch"
          :formSchemas="currentForm"
          :rootTypeName="currentTargetTypeName"
          v-bind="$attrs"
        />
      </template>
    </n-card>
  </div>
</template>

<script lang="ts">
  import { handleSchemaForm, handleSchemaSearch } from './components/option'
  import { queryTargetTypes } from '@/api/target/target-type'
  import TargetInfo from './components/target-info.vue'
  import type { ISelectOption } from '@/components/main-header'
  import type { ITargetType } from '@/api/target/types'
  export default defineComponent({
    components: { TargetInfo },
    emits: [],
    setup() {
      const state = reactive({
        typeData: [] as any[],
        optionsList: [] as Array<ISelectOption>,
        currentTargetType: '', // 当前检查对象类型
        currentTargetTypeName: '',
        childTypes: [] as ITargetType[]
      })
      const formData = ref()
      const searchData = ref()
      const currentForm = ref()
      const currentSearch = ref()
      const getTargetTypes = async () => {
        state.typeData = await queryTargetTypes()
        state.optionsList = state.typeData.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        state.currentTargetType = state.typeData.length ? state.typeData[0].id : undefined
        state.currentTargetTypeName = state.typeData.length ? state.typeData[0].name : undefined
        state.childTypes = state.typeData[0].list.length ? state.typeData[0].list : undefined
        formData.value = handleSchemaForm(state.typeData)
        currentForm.value = formData.value.get(state.currentTargetType)
        searchData.value = handleSchemaSearch(state.typeData)
        currentSearch.value = searchData.value.get(state.currentTargetType)
      }
      getTargetTypes()

      const clickItemHandler = (item: ISelectOption) => {
        state.currentTargetType = item.value.toString()
        state.currentTargetTypeName = item.label as string
        currentForm.value = formData.value.get(state.currentTargetType)
        currentSearch.value = searchData.value.get(state.currentTargetType)
        for (const data of state.typeData) {
          if (data.id === state.currentTargetType) {
            state.childTypes = data.list || []
          }
        }
      }
      return {
        currentForm,
        currentSearch,
        ...toRefs(state),
        clickItemHandler
      }
    }
  })
</script>

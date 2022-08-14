<template>
  <div class="bound-tabs-index">
    <base-types
      :table-columns="causeBaseAttrsTableColumns"
      :form-schemas="causeBaseAttrsSchemas"
      :load-table-data="getCauseBaseAttrs"
      :table-title="'违法行为基本属性'"
      :use-selection="true"
      @selected-row-handler="selectedRowHandler"
      :bound-keys="boundKeys"
      :key="'违法行为基本属性'"
      :create-actions="[]"
    />
  </div>
</template>

<script lang="ts">
  import { causeBaseAttrsSchemas, causeBaseAttrsTableColumns } from '@/components/base-types/options'
  import { queryCauseBaseAttrs } from '@/api/setting/base-types'
  import type { ICaseType } from '@/api/setting/types'
  import { bindCauseAttrsForCaseType, queryCauseAttrsWithCaseType } from '@/api/setting/case-type'

  export default defineComponent({
    name: 'BoundTabsIndex',
    setup() {
      const state = reactive({
        boundKeys: [] as string[]
      })

      // 获取违法行为基本属性类型数据
      async function getCauseBaseAttrs() {
        return await queryCauseBaseAttrs()
      }

      const currentRowData: ICaseType = inject('currentRowData')!

      // 提交选中行
      async function selectedRowHandler(rowKeys: number[]) {
        let params = {
          sourceId: unref(currentRowData).id,
          targetList: rowKeys
        }
        await bindCauseAttrsForCaseType(params)
      }

      // 查询案件类型已经绑定的违法行为基本属性
      async function getCauseBaseAttrsWithCaseType(id: string) {
        let res: ICaseType[] = await queryCauseAttrsWithCaseType(id)
        state.boundKeys = res.map((item) => item.id!)
      }

      onMounted(() => getCauseBaseAttrsWithCaseType(unref(currentRowData).id!))

      return {
        ...toRefs(state),
        getCauseBaseAttrs,
        selectedRowHandler,
        causeBaseAttrsSchemas,
        causeBaseAttrsTableColumns
      }
    }
  })
</script>

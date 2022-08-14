<template>
  <div class="evidence-rule-bind">
    <base-types
      ref="evidenceRuleRef"
      :use-selection="true"
      :load-table-data="getEvidenceRuleTypes"
      :table-title="'证据规则'"
      :bound-keys="boundKeys"
      @selected-row-handler="selectedRowHandler"
      :create-actions="() => []"
    />
  </div>
</template>

<script lang="ts">
  import { queryEvidenceRuleTypes } from '@/api/setting/base-types'

  import { bindEvidenceRuleForCaseType, queryEvidenceRuleWithCaseType } from '@/api/setting/case-type'
  import { IBaseType, ICaseType } from '@/api/setting/types'

  export default defineComponent({
    name: 'EvidenceRuleBind',
    setup() {
      const boundKeys = ref<string[]>()
      const currentRowData: ICaseType = inject('currentRowData')!

      // 获取证据规则类型列表
      async function getEvidenceRuleTypes() {
        return await queryEvidenceRuleTypes()
      }

      // 查询已绑定的
      ;(async () => {
        let res = await queryEvidenceRuleWithCaseType(unref(currentRowData).id!)
        boundKeys.value = res.map((item) => item.id!)
      })()

      // 绑定
      async function selectedRowHandler(rows: IBaseType[]) {
        let params = {
          sourceId: unref(currentRowData).id!,
          targetList: rows.map((item) => item.id)
        }
        await bindEvidenceRuleForCaseType(params)
      }

      return { boundKeys, getEvidenceRuleTypes, selectedRowHandler }
    }
  })
</script>

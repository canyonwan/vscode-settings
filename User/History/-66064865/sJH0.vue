<template>
  <div class="flex w-full base-types">
    <n-grid cols="1 s:1 m:1 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12">
      <n-grid-item span="2">
        <n-card>
          <base-types
            ref="programRef"
            :load-table-data="getProgramData"
            :table-title="'程序'"
            :create-actions="createProgramActions"
            @submit-handler="programSubmitHandler"
            :frontEndIdentification="['b04_03_01']"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card>
          <base-types
            ref="evidenceRuleRef"
            :load-table-data="getEvidenceRuleData"
            :table-title="'证据规则'"
            :create-actions="createEvidenceRuleActions"
            @submit-handler="evidenceRuleSubmitHandler"
            :frontEndIdentification="['b04_03_01']"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="4">
        <n-card class="mt-4">
          <base-types
            ref="causeBaseAttrsRef"
            :table-columns="causeBaseAttrsTableColumns"
            :form-schemas="causeBaseAttrsSchemas"
            :load-table-data="getCauseBaseAttrs"
            :table-title="'违法行为基本属性'"
            :create-actions="createCauseBaseAttrsActions"
            @submit-handler="causeBaseAttrsSubmitHandler"
            :frontEndIdentification="['b04_03_01']"
          />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts">
  import {
    deleteCauseBaseAttrs,
    deleteEvidenceRuleTypes,
    deleteProgramType,
    queryCauseBaseAttrs,
    queryEvidenceRuleTypes,
    queryProgramTypes,
    saveCauseBaseAttrs,
    saveEvidenceRuleType,
    saveProgramType
  } from '@/api/setting/base-types'
  import { causeBaseAttrsSchemas, causeBaseAttrsTableColumns } from '@/components/base-types/options'
  import type { IBaseType } from '@/api/setting/types'
  import { useDialog } from 'naive-ui'

  export default defineComponent({
    setup() {
      const state = reactive({})
      const programRef = ref()
      const evidenceRuleRef = ref()
      const causeBaseAttrsRef = ref()

      const dialog = useDialog()

      // 创建程序操作
      function createProgramActions(record) {
        return [
          {
            frontEndIdentification: ['b04_03_02'],
            type: 'error',
            label: '删除',
            onClick: handleProgramDelete.bind(null, record)
          }
        ]
      }

      // 创建程序操作
      function createEvidenceRuleActions(record) {
        return [
          {
            frontEndIdentification: ['b04_03_02'],
            type: 'error',
            label: '删除',
            onClick: handleEvidenceRuleDelete.bind(null, record)
          }
        ]
      }

      // 创建违法行为基本属性操作
      function createCauseBaseAttrsActions(record) {
        return [
          {
            frontEndIdentification: ['b04_03_02'],
            type: 'error',
            label: '删除',
            onClick: handleCauseBaseAttrsDelete.bind(null, record)
          },
          {
            frontEndIdentification: ['b04_03_02'],
            type: 'info',
            label: '编辑',
            onClick: handleCauseBaseAttrsEdit.bind(null, record)
          }
        ]
      }

      // 违法行为编辑
      function handleCauseBaseAttrsEdit(record: IBaseType) {
        causeBaseAttrsRef.value.onOpenEditModal(record)
      }

      // 程序删除
      function handleProgramDelete(record) {
        dialog.error({
          title: '警告',
          content: '你确定删除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            record.onEdit?.(false, true)
            await deleteProgramType(record.id)
            programRef.value.reloadTable()
          }
        })
      }

      // 证据规则删除
      function handleEvidenceRuleDelete(record) {
        dialog.error({
          title: '警告',
          content: '你确定删除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            record.onEdit?.(false, true)
            await deleteEvidenceRuleTypes(record.id)
            evidenceRuleRef.value.reloadTable()
          }
        })
      }

      // 违法行为基本属性删除
      function handleCauseBaseAttrsDelete(record) {
        dialog.error({
          title: '警告',
          content: '你确定删除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            record.onEdit?.(false, true)
            await deleteCauseBaseAttrs(record.id)
            causeBaseAttrsRef.value.reloadTable()
          }
        })
      }

      // 获取程序类型数据
      async function getProgramData() {
        return await queryProgramTypes()
      }

      // 获取证据规则类型数据
      async function getEvidenceRuleData() {
        return await queryEvidenceRuleTypes()
      }

      // 获取违法行为基本属性类型数据
      async function getCauseBaseAttrs() {
        return await queryCauseBaseAttrs()
      }

      // 保存程序类型
      async function programSubmitHandler(values: IBaseType) {
        await saveProgramType(values)
        programRef.value.reloadTable()
        programRef.value.closeModal()
      }

      // 保存证据规则类型
      async function evidenceRuleSubmitHandler(values: IBaseType) {
        await saveEvidenceRuleType(values)
        evidenceRuleRef.value.reloadTable()
        evidenceRuleRef.value.closeModal()
      }

      // 保存违法行为基本属性类型
      async function causeBaseAttrsSubmitHandler(values: IBaseType) {
        await saveCauseBaseAttrs(values)
        causeBaseAttrsRef.value.reloadTable()
        causeBaseAttrsRef.value.closeModal()
      }

      return {
        ...toRefs(state),
        programRef,
        evidenceRuleRef,
        causeBaseAttrsRef,
        causeBaseAttrsTableColumns,
        causeBaseAttrsSchemas,
        createProgramActions,
        createEvidenceRuleActions,
        createCauseBaseAttrsActions,
        getProgramData,
        getEvidenceRuleData,
        getCauseBaseAttrs,
        programSubmitHandler,
        evidenceRuleSubmitHandler,
        causeBaseAttrsSubmitHandler
      }
    }
  })
</script>

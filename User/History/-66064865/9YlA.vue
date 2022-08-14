<template>
  <div class="flex w-full base-types">
    <n-grid cols="1 s:1 m:1 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12">
      <n-grid-item span="2">
        <n-card>
          <base-types :load-table-data="getDepartmentData" :table-title="'部门'" ref="departmentRef" :create-actions="createDepartmentActions" @submit-handler="departmentSubmitHandler" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card>
          <base-types ref="programRef" :load-table-data="getProgramData" :table-title="'程序'" :create-actions="createProgramActions" @submit-handler="programSubmitHandler" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card class="mt-4">
          <base-types ref="evidenceRuleRef" :load-table-data="getEvidenceRuleData" :table-title="'证据规则'" :create-actions="createEvidenceRuleActions" @submit-handler="evidenceRuleSubmitHandler" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card class="mt-4">
          <base-types
            ref="causeBaseAttrsRef"
            :table-columns="causeBaseAttrsTableColumns"
            :form-schemas="causeBaseAttrsSchemas"
            :load-table-data="getCauseBaseAttrs"
            :table-title="'案由基本属性'"
            :create-actions="createCauseBaseAttrsActions"
            @submit-handler="causeBaseAttrsSubmitHandler"
          />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts">
  import {
    deleteCauseBaseAttrs,
    deleteDepartmentType,
    deleteEvidenceRuleTypes,
    deleteProgramType,
    queryCauseBaseAttrs,
    queryDepartmentTypes,
    queryEvidenceRuleTypes,
    queryProgramTypes,
    saveBaseType,
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
      const departmentRef = ref()
      const programRef = ref()
      const evidenceRuleRef = ref()
      const causeBaseAttrsRef = ref()

      const dialog = useDialog()

      // 创建部门操作
      function createDepartmentActions(record) {
        return [
          {
            type: 'error',
            label: '删除',
            onClick: handleDepartmentDelete.bind(null, record)
          }
        ]
      }

      // 创建程序操作
      function createProgramActions(record) {
        return [
          {
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
            type: 'error',
            label: '删除',
            onClick: handleEvidenceRuleDelete.bind(null, record)
          }
        ]
      }

      // 创建案由基本属性操作
      function createCauseBaseAttrsActions(record) {
        return [
          {
            type: 'error',
            label: '删除',
            onClick: handleCauseBaseAttrsDelete.bind(null, record)
          },
          {
            type: 'info',
            label: '编辑',
            onClick: handleCauseBaseAttrsEdit.bind(null, record)
          }
        ]
      }

      // 案由编辑
      function handleCauseBaseAttrsEdit(record: IBaseType) {
        causeBaseAttrsRef.value.onOpenEditModal(record)
      }

      // 部门删除
      function handleDepartmentDelete(record) {
        dialog.warning({
          title: '警告',
          content: '你确定删除？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: async () => {
            record.onEdit?.(false, true)
            await deleteDepartmentType(record.id)
            departmentRef.value.reloadTable()
          }
        })
      }

      // 程序删除
      function handleProgramDelete(record) {
        dialog.warning({
          title: '警告',
          content: '你确定删除？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: async () => {
            record.onEdit?.(false, true)
            await deleteProgramType(record.id)
            programRef.value.reloadTable()
          }
        })
      }

      // 证据规则删除
      function handleEvidenceRuleDelete(record) {
        record.onEdit?.(false, true)
        deleteEvidenceRuleTypes(record.id).then(() => {
          evidenceRuleRef.value.reloadTable()
        })
      }

      // 案由基本属性删除
      function handleCauseBaseAttrsDelete(record) {
        record.onEdit?.(false, true)
        deleteCauseBaseAttrs(record.id).then(() => {
          causeBaseAttrsRef.value.reloadTable()
        })
      }

      // 获取部门类型数据
      async function getDepartmentData() {
        return await queryDepartmentTypes()
      }

      // 获取程序类型数据
      async function getProgramData() {
        return await queryProgramTypes()
      }

      // 获取证据规则类型数据
      async function getEvidenceRuleData() {
        return await queryEvidenceRuleTypes()
      }

      // 获取案由基本属性类型数据
      async function getCauseBaseAttrs() {
        return await queryCauseBaseAttrs()
      }

      // 保存部门类型
      async function departmentSubmitHandler(values: IBaseType) {
        await saveBaseType(values)
        departmentRef.value.reloadTable()
      }

      // 保存程序类型
      async function programSubmitHandler(values: IBaseType) {
        await saveProgramType(values)
        programRef.value.reloadTable()
      }

      // 保存证据规则类型
      async function evidenceRuleSubmitHandler(values: IBaseType) {
        await saveEvidenceRuleType(values)
        evidenceRuleRef.value.reloadTable()
      }

      // 保存案由基本属性类型
      async function causeBaseAttrsSubmitHandler(values: IBaseType) {
        await saveCauseBaseAttrs(values)
        causeBaseAttrsRef.value.reloadTable()
      }

      return {
        ...toRefs(state),
        departmentRef,
        programRef,
        evidenceRuleRef,
        causeBaseAttrsRef,
        causeBaseAttrsTableColumns,
        causeBaseAttrsSchemas,
        createDepartmentActions,
        createProgramActions,
        createEvidenceRuleActions,
        createCauseBaseAttrsActions,
        getDepartmentData,
        getProgramData,
        getEvidenceRuleData,
        getCauseBaseAttrs,
        departmentSubmitHandler,
        programSubmitHandler,
        evidenceRuleSubmitHandler,
        causeBaseAttrsSubmitHandler
      }
    }
  })
</script>

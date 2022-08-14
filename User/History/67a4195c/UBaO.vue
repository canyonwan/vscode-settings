<template>
  <div class="case-types">
    <n-grid cols="5" responsive="screen" :x-gap="12">
      <n-gi span="2">
        <n-card
          :bordered="false"
          :segmented="{
            content: 'soft',
            footer: 'soft'
          }"
        >
          <template #header> <n-button type="primary" class="mb-1" @click="addTopLevel">新增顶级</n-button> </template>
          <case-type-trees ref="caseTypeTreeRef" @on-add-row="addRowHandler" @on-edit-row="editRowHandler" @on-delete-row="onDeleteRow" />
        </n-card>
      </n-gi>
      <n-gi span="3">
        <n-card class="flex-none h-full custom-from-item" size="small" content-style="padding: 0 10px">
          <n-tabs v-model:value="currentTab" @before-leave="handleTabBeforeLeave" justify-content="space-evenly" default-value="baseInfo" type="line" size="large">
            <n-tab-pane display-directive="show" name="baseInfo" tab="基本信息">
              <form-home @form-submit-handler="formSubmitHandler" />
            </n-tab-pane>
            <n-tab-pane name="causeBindTab" tab="案由绑定">
              <cause-base-bind-tab />
            </n-tab-pane>
            <n-tab-pane name="evidenceRuleBindTab" tab="证据规则绑定">
              <evidence-rule-bind-tab />
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts">
  import CaseTypeTrees from '@/views/setting/case-type/components/case-type-trees.vue'
  import type { ICaseType } from '@/api/setting/types'
  import { deleteCaseType } from '@/api/setting/case-type'
  import { useMessage } from 'naive-ui'
  import FormHome from '@/views/setting/case-type/components/form-home.vue'
  import CauseBaseBindTab from '@/views/setting/case-type/bind-tabs/cause-base-bind.vue'
  import EvidenceRuleBindTab from '@/views/setting/case-type/bind-tabs/evidence-rule-bind.vue'

  export default defineComponent({
    name: 'CaseTypes',
    components: {
      FormHome,
      CauseBaseBindTab,
      EvidenceRuleBindTab,
      CaseTypeTrees
    },
    setup() {
      const caseTypeTreeRef = ref()
      const message = useMessage()

      const state = reactive({
        editMode: false,
        handleTarget: '',
        currentTab: 'baseInfo'
      })

      const provideRowData = ref<ICaseType>()

      provide('currentRowData', readonly(provideRowData))
      provide('handleTarget', readonly(state))

      // 编辑按钮回调
      function editRowHandler(row: ICaseType) {
        state.editMode = true
        state.handleTarget = row.name
        provideRowData.value = row
        state.currentTab = 'baseInfo'
      }

      function addTopLevel() {
        state.handleTarget = '新增顶级'
        provideRowData.value = {
          id: null,
          name: '',
          remarks: '',
          parentId: '0',
          dataType: 0,
          programTypeId: null,
          whetherParentUseType: null
        }
      }

      // 新增按钮回调
      // 新增顶级 id: null, parentId: '0'
      // 新增子级 id: null, parentId: row.id
      // 编辑: id: id
      function addRowHandler(row: ICaseType) {
        console.log('row', row)
        state.currentTab = 'baseInfo'
        state.handleTarget = '新增子级'
        // state.editMode = false
        // state.handleTarget = row?.name ? row.name : '顶级'
        provideRowData.value = {
          ...row,
          name: '',
          remarks: '',
          dataType: 0,
          programTypeId: null,
          whetherParentUseType: null
        }
        console.log('provideRowData', provideRowData)
      }

      async function onDeleteRow(row: ICaseType) {
        await deleteCaseType(row.id!)
        caseTypeTreeRef.value.getCaseTypesTree()
      }

      // 表单回调, 刷新tree
      function formSubmitHandler() {
        caseTypeTreeRef.value.getCaseTypesTree()
      }

      // 当点击tab时, 判断是否需要提示
      // 需要点击编辑才可以进
      function handleTabBeforeLeave(tabName: string) {
        if ((tabName === 'causeBindTab' || tabName === 'evidenceRuleBindTab') && !provideRowData.value?.id) {
          message.error('请从左侧选择一项进行绑定 🚧')
          return false
        }
        return true
      }

      return {
        ...toRefs(state),
        provideRowData,
        caseTypeTreeRef,
        addRowHandler,
        editRowHandler,
        formSubmitHandler,
        handleTabBeforeLeave,
        addTopLevel,
        onDeleteRow
      }
    }
  })
</script>

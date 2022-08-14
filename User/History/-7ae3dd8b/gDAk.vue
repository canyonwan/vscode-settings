<template>
  <div class="form-home">
    <n-card :bordered="false">
      <n-alert type="info" closable class="mb-10">
        {{ rowData ? `正在${handleTargetData.editMode ? '编辑' : '新增'} 【${handleTargetData.handleTarget}】 ${rowData.parentId !== '0' ? '的子级' : ''}` : '请从左侧选择需要操作的对象' }}
      </n-alert>
      <form-actions ref="formRef" @on-form-submit="formSubmitHandler" />
    </n-card>
  </div>
</template>

<script lang="ts">
  import FormActions from '@/views/setting/case-type/components/form-actions.vue'
  import { ICaseType } from '@/api/setting/types'
  import { IHomeState } from '../index.vue'

  export default defineComponent({
    name: 'FormHome',
    components: {
      FormActions
    },
    emits: ['formSubmitHandler'],
    setup(_, { emit }) {
      // 表单回调, 刷新tree
      function formSubmitHandler() {
        emit('formSubmitHandler')
      }

      const rowData = inject<ICaseType>('currentRowData')
      const handleTargetData = inject<IHomeState>('handleTarget')

      return { formSubmitHandler, rowData, handleTargetData }
    }
  })
</script>

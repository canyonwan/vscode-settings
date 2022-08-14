<template>
  <div class="select-dept">
    <base-types
      :load-table-data="getDepartmentTypes"
      :use-selection="true"
      :table-title="'部门'"
      :bound-keys="$props.bindKeys"
      @cancel-modal-handler="closeModal"
      @selected-row-handler="selectionHandler"
    />
  </div>
</template>

<script lang="ts">
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  export default defineComponent({
    name: 'SelectDept',
    props: {
      // 已绑定的部门id集合
      bindKeys: {
        type: Array as PropType<string[]>,
        default: () => []
      }
    },
    emits: ['onCheck', 'closeModal'],
    setup(_props, context) {
      // 提交绑定部门id
      const selectionHandler = (infos) => {
        const keys = infos.map((item) => item.id)
        context.emit('onCheck', keys)
      }

      // 获取所有部门类型
      const getDepartmentTypes = async () => {
        return await queryDepartmentTypes()
      }

      const closeModal = () => {
        context.emit('closeModal')
      }

      return {
        selectionHandler,
        getDepartmentTypes,
        closeModal
      }
    }
  })
</script>

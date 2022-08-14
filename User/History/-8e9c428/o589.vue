<template>
  <basic-modal @register="modalRegister" style="width: 60%">
    <base-types :load-table-data="getDepartmentTypes" :use-selection="true" :bound-keys="bindKeys" @cancel-modal-handler="closeModal" @selected-row-handler="selectionHandler" />
  </basic-modal>
</template>

<script lang="ts">
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { useModal } from '@/components/modal'
  import { customFormDeptBinding, getCustomFormDeptBinding } from '@/api/setting/custom-form'
  import type { IBaseType } from '@/api/setting/types'

  export default defineComponent({
    name: 'FormBindDept',
    components: { BasicModal },
    props: {
      formId: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const bindKeys = ref()
      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '绑定部门类型'
      })

      // 提交绑定部门id
      const selectionHandler = async (rows: IBaseType[]) => {
        await customFormDeptBinding({ sourceId: props.formId, targetList: keys.map((item) => item.id) })
        getFormDepartIds()
        closeModal()
      }

      // 获取所有部门类型
      const getDepartmentTypes = async () => {
        return await queryDepartmentTypes()
      }
      // 已绑定部门的数据
      const getFormDepartIds = () => {
        getCustomFormDeptBinding(props.formId).then((data) => {
          bindKeys.value = data.map((item) => {
            return item.id
          })
        })
      }
      watch(
        () => props.formId,
        () => {
          getFormDepartIds()
        }
      )
      return {
        bindKeys,
        modalRegister,
        openModal,
        closeModal,
        selectionHandler,
        getDepartmentTypes
      }
    }
  })
</script>

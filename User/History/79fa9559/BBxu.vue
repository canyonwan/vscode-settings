<template>
  <div class="target-detail-save">
    <basic-modal :showActionButtonGroup="true" :disabled="buttonDisabledPermission(['a01_01']) || !buttonShowPermission(['a01_01'])" @register="modalRegister" style="width: 60%" @on-ok="okSubmit">
      <target-add-edit
        :targetDetail="targetDetail"
        :formSchemas="formSchemas"
        v-if="formSchemas && formSchemas.length"
        :isDisabled="buttonDisabledPermission(['a01_01']) || !buttonShowPermission(['a01_01'])"
        ref="targetFomRef"
      />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { useModal } from '@/components/modal'
  import TargetAddEdit from './target-add-edit.vue'
  import { queryTargetDetail } from '@/api/target/target-manage'
  import { queryTargetTypes } from '@/api/target/target-type'
  import { handleSchemaForm } from './option'
  import { usePermission } from '@/hooks/web/use-permission'

  export default defineComponent({
    name: 'TargetDetailSave',
    components: { TargetAddEdit },
    props: {
      targetId: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const targetDetail = ref()
      const targetFomRef = ref()
      const formSchemas = ref()
      const formData = ref()
      const state = reactive({
        typeData: [] as any,
        optionsList: [] as Array<{ label: string; value: string }>
      })
      // 按钮权限 禁用隐藏
      const { buttonDisabledPermission, buttonShowPermission } = usePermission()
      const [modalRegister, { openModal: openTargetModal, closeModal, setSubLoading }] = useModal({
        title: '检查对象'
      })
      const getTargetTypes = async () => {
        state.typeData = await queryTargetTypes()
        state.optionsList = state.typeData.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        formData.value = handleSchemaForm(state.typeData)
        formSchemas.value = formData.value.get(targetDetail.value.rootTypeId)
      }
      const okSubmit = async () => {
        const formRes = await targetFomRef.value.handleSubmit()
        if (formRes) {
          closeModal()
        } else {
          setSubLoading(false)
        }
      }
      watch(
        () => props.targetId,
        () => {
          if (props.targetId) {
            queryTargetDetail(props.targetId).then((data) => {
              targetDetail.value = data
              getTargetTypes()
            })
          }
        },
        { immediate: true }
      )
      return {
        targetFomRef,
        targetDetail,
        modalRegister,
        openTargetModal,
        okSubmit,
        formSchemas,
        buttonDisabledPermission,
        buttonShowPermission
      }
    }
  })
</script>
